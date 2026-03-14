'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../../../services/api';

function SimpleLineChart({ data, valueKey, color, unit }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gradient-to-br from-[#dfe6e9] to-[#b2bec3] rounded-[10px] text-[#636e72] text-[0.9rem]">
        No data yet — add your first measurement
      </div>
    );
  }

  const values = data.map(d => parseFloat(d[valueKey]) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 400, H = 150, PAD = 20;
  const pts = values.map((v, i) => ({
    x: PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - ((v - min) / range) * (H - PAD * 2),
    v,
    date: data[i].measurementDate,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: '160px' }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
            stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
        ))}
        <path d={`${pathD} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`}
          fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between px-5 mt-1">
        {pts.map((p, i) => (
          <span key={i} className="text-[0.7rem] text-[#b2bec3]">
            {new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
      <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm mt-2.5">
        Current: <strong className="text-[#2d3436]">{values[values.length - 1]}{unit}</strong>
        <span className="text-[0.75rem] text-[#b2bec3] ml-2">Latest reading</span>
      </div>
    </div>
  );
}

export default function GrowthTab() {
  const { list: children } = useSelector((state) => state.children);
  const [selectedChild, setSelectedChild] = useState('');
  const [growthData, setGrowthData] = useState([]);
  const [form, setForm] = useState({ measurementDate: new Date().toISOString().split('T')[0], height: '', weight: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (children.length > 0 && !selectedChild) setSelectedChild(String(children[0].id));
  }, [children]);

  useEffect(() => {
    if (selectedChild) {
      setLoading(true);
      apiService.getGrowthHistory(selectedChild)
        .then(r => setGrowthData(r.data || []))
        .catch(() => setGrowthData([]))
        .finally(() => setLoading(false));
    }
  }, [selectedChild]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiService.addGrowthMeasurement({ ...form, childId: +selectedChild });
      if (res.success) {
        setGrowthData(prev => [...prev, res.data]);
        setForm({ measurementDate: new Date().toISOString().split('T')[0], height: '', weight: '' });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const childObj = children.find(c => String(c.id) === selectedChild);

  if (children.length === 0) {
    return (
      <div>
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">Growth Progress Tracking</div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10 text-[#636e72]">
          <div className="text-[3rem] mb-4">📏</div>
          <p>Please add a child first to track growth</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">Growth Progress Tracking</div>

      {/* Child Selector + Update Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base">📏 Update Measurements</div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Child</label>
              <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                {children.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.dateOfBirth ? `(${Math.floor((Date.now() - new Date(c.dateOfBirth)) / 31557600000)} yrs)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Date</label>
              <input type="date" required value={form.measurementDate}
                onChange={e => setForm({ ...form, measurementDate: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="mb-4">
                <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Weight (kg)</label>
                <input type="number" step="0.1" value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value })}
                  placeholder="e.g. 16.5" className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" />
              </div>
              <div className="mb-4">
                <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Height (cm)</label>
                <input type="number" step="0.1" value={form.height}
                  onChange={e => setForm({ ...form, height: e.target.value })}
                  placeholder="e.g. 101" className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" />
              </div>
            </div>

            {saved && (
              <div className="bg-gradient-to-br from-[#55efc4] to-[#00b894] text-white px-3 py-2.5 rounded-lg mb-2.5 text-center font-semibold">
                ✓ Measurement saved!
              </div>
            )}

            <button type="submit" disabled={saving || !selectedChild} className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
              {saving ? 'Saving...' : '💾 Save Measurement'}
            </button>
          </form>
        </div>

        {/* Latest Stats */}
        {growthData.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base">📊 Latest Stats — {childObj?.name}</div>
            {(() => {
              const latest = [...growthData].sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate))[0];
              return (
                <div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                    <strong>📅 Date:</strong> {new Date(latest.measurementDate).toLocaleDateString()}
                  </div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                    <strong>⚖️ Weight:</strong> {latest.weight ? `${latest.weight} kg` : '—'}
                  </div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                    <strong>📏 Height:</strong> {latest.height ? `${latest.height} cm` : '—'}
                  </div>
                  {latest.bmi && (
                    <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                      <strong>🔢 BMI:</strong> {latest.bmi}
                    </div>
                  )}
                  <div className="mt-3 text-[0.8rem] text-[#636e72] text-center">
                    Total records: {growthData.length}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Charts */}
      {loading ? (
        <div className="text-center py-10 text-[#636e72]">Loading growth data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base">
              📏 Height Growth Chart
            </div>
            <SimpleLineChart data={growthData} valueKey="height" color="#667eea" unit="cm" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#fd79a8] to-[#e84393] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base">
              ⚖️ Weight Growth Chart
            </div>
            <SimpleLineChart data={growthData} valueKey="weight" color="#fd79a8" unit="kg" />
          </div>
        </div>
      )}

      {/* History Table */}
      {growthData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">📋 Measurement History</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.9rem]">
              <thead>
                <tr className="border-b-2 border-[#667eea]">
                  {['Date', 'Height (cm)', 'Weight (kg)', 'BMI'].map(h => (
                    <th key={h} className="p-2.5 text-left text-[#667eea] font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...growthData].reverse().map((r, i) => (
                  <tr key={r.id} className={`border-b border-[#f0f0f0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                    <td className="p-2.5">{new Date(r.measurementDate).toLocaleDateString()}</td>
                    <td className="p-2.5 text-[#667eea] font-semibold">{r.height || '—'}</td>
                    <td className="p-2.5 text-[#e84393] font-semibold">{r.weight || '—'}</td>
                    <td className="p-2.5 text-[#636e72]">{r.bmi || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
