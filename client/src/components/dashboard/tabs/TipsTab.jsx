'use client';

import { useEffect, useState } from 'react';
import apiService from '../../../services/api';

const AGE_GROUPS = ['All Ages', '0-2 years', '3-5 years', '6-12 years', '13-18 years'];

const DEFAULT_SAFETY_TIPS = [
  { id: 's1', title: 'Child-proof Your Home', category: 'Home Safety', content: 'Install safety gates, cover electrical outlets, and secure heavy furniture to prevent tip-overs.', ageGroup: 'All Ages' },
  { id: 's2', title: 'Swimming Safety', category: 'Outdoor Safety', content: 'Never leave children unattended near water. Enroll children in swimming lessons early.', ageGroup: '3-5 years' },
  { id: 's3', title: 'Road Safety', category: 'Outdoor Safety', content: 'Teach children to look both ways before crossing. Always use car seats and seat belts.', ageGroup: 'All Ages' },
  { id: 's4', title: 'Food Choking Prevention', category: 'Food Safety', content: 'Cut food into small pieces. Avoid hard, round foods like whole grapes for young children.', ageGroup: '0-2 years' },
];

const DEFAULT_HEALTH_TIPS = [
  { id: 'h1', title: 'Vaccination Schedules', category: 'Vaccination', content: 'Follow the recommended immunization schedule. Keep vaccination records up to date.', ageGroup: 'All Ages' },
  { id: 'h2', title: 'Sleep Requirements', category: 'Sleep & Rest', content: 'Toddlers need 11-14 hours, school-age children need 9-12 hours of sleep per night.', ageGroup: 'All Ages' },
  { id: 'h3', title: 'Physical Activity', category: 'Physical Activity', content: 'Children need at least 60 minutes of moderate to vigorous activity daily.', ageGroup: '6-12 years' },
  { id: 'h4', title: 'Dental Care', category: 'Dental Health', content: 'Brush teeth twice daily. First dental visit should be at age 1 or when first tooth appears.', ageGroup: '0-2 years' },
];

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

  useEffect(() => {
    setLoading(true);
    apiService.getTips(activeType, ageFilter || undefined)
      .then(r => {
        if (r.data && r.data.length > 0) setTips(r.data);
        else setTips(activeType === 'safety' ? DEFAULT_SAFETY_TIPS : DEFAULT_HEALTH_TIPS);
      })
      .catch(() => setTips(activeType === 'safety' ? DEFAULT_SAFETY_TIPS : DEFAULT_HEALTH_TIPS))
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map(tip => <TipCard key={tip.id} tip={tip} />)}
        </div>
      )}
    </div>
  );
}
