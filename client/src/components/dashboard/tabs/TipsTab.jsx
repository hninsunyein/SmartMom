'use client';

import { useEffect, useState } from 'react';
import apiService from '../../../services/api';

const AGE_GROUPS = ['All Ages', '0-2 years', '3-5 years', '6-12 years', '13-18 years'];

function TipCard({ tip }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
      onClick={() => setExpanded(!expanded)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <span className="text-[0.75rem] px-2.5 py-0.5 bg-[#f0eeff] text-[#667eea] rounded-[10px] font-bold">
              {tip.category}
            </span>
            {tip.ageGroup && (
              <span className="text-[0.75rem] px-2.5 py-0.5 bg-gradient-to-r from-[#f5f7fa] to-[#e9ecef] text-[#636e72] rounded-[10px]">
                {tip.ageGroup}
              </span>
            )}
          </div>
          <h3 className="m-0 text-[0.95rem] text-[#2d3436] font-bold">{tip.title}</h3>
        </div>
        <span className={`text-[1.1rem] ml-2.5 transition-transform duration-200 text-[#667eea] ${expanded ? 'rotate-180' : 'rotate-0'}`}>▾</span>
      </div>
      {expanded && (
        <p className="mt-3 text-[0.9rem] text-[#636e72] leading-relaxed border-t border-[#f0f0f0] pt-3">
          {tip.content}
        </p>
      )}
    </div>
  );
}

export default function TipsTab() {
  const [activeType, setActiveType] = useState('safety');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setLoading(true);
    setFetchError('');
    apiService.getTips(activeType, ageFilter || undefined)
      .then(r => setTips(r.data || []))
      .catch(err => {
        setTips([]);
        setFetchError(err?.message || 'Failed to load tips. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [activeType, ageFilter]);

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">Tips & Information</div>

      {/* Type Toggle */}
      <div className="flex gap-2.5 mb-5">
        <button onClick={() => setActiveType('safety')}
          className={activeType === 'safety'
            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55'
            : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm'}>
          🛡️ Safety Tips
        </button>
        <button onClick={() => setActiveType('health')}
          className={activeType === 'health'
            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55'
            : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm'}>
          💪 Health Tips
        </button>
      </div>

      {/* Age Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.85rem] font-bold text-[#764ba2] mr-1">Filter by age:</span>
          {['', ...AGE_GROUPS].map(ag => (
            <span key={ag} onClick={() => setAgeFilter(ag)}
              className={`inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-3 py-1.5 rounded-full text-[0.8rem] cursor-pointer transition-all hover:scale-105 m-1${ageFilter === ag ? ' ring-2 ring-white outline outline-2 outline-[#667eea]' : ''}`}>
              {ag || 'All'}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#636e72]">Loading tips...</div>
      ) : fetchError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-8 text-center text-sm">
          {fetchError}
        </div>
      ) : tips.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-12 text-center shadow-sm">
          <p className="text-gray-500 font-semibold mb-1">No tips available</p>
          <p className="text-gray-400 text-sm">
            {ageFilter ? `No ${activeType} tips found for "${ageFilter}".` : `No ${activeType} tips have been published yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map(tip => <TipCard key={tip.id} tip={tip} />)}
        </div>
      )}
    </div>
  );
}
