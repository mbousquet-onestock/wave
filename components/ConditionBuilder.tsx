
import React, { useState } from 'react';
import { Condition } from '../types';
import { FIELDS, OPERATORS, MOCK_ORDERS } from '../constants';

interface ConditionBuilderProps {
  conditions: Condition[];
  onAdd: (c: Condition) => void;
  onRemove: (id: string) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ conditions, onAdd, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<Condition>>({
    field: FIELDS[0],
    operator: OPERATORS[3], // Default to 'in'
    value: '',
    joiner: 'AND',
    infoFieldName: '',
    infoFieldType: 'string'
  });

  const handleAdd = () => {
    const isInfo = newCondition.field?.toLowerCase().includes('information');
    if (newCondition.value || (isInfo && newCondition.infoFieldName)) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        field: newCondition.field!,
        operator: newCondition.operator!,
        value: newCondition.value!,
        joiner: conditions.length > 0 ? newCondition.joiner : undefined,
        infoFieldName: isInfo ? newCondition.infoFieldName : undefined,
        infoFieldType: isInfo ? newCondition.infoFieldType : undefined
      });
      setNewCondition({ ...newCondition, value: '', infoFieldName: '' });
      setIsModalOpen(false);
    }
  };

  const isInformationField = newCondition.field?.toLowerCase().includes('information');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Filters Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-[#00A79D] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              </div>
              Selection Filters
            </h2>
            <p className="text-slate-500 text-sm mt-1">Include or exclude orders from the wave using advanced rules.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00A79D] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20 hover:bg-[#008d84] transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Add Filter Rule
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 min-h-[60px]">
          {conditions.length === 0 ? (
            <div className="w-full text-slate-400 italic text-sm py-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center bg-slate-50/30">
              No filters active. All <span className="font-bold text-slate-600">3,492 pending orders</span> are eligible.
            </div>
          ) : (
            conditions.map((c, idx) => (
              <React.Fragment key={c.id}>
                {idx > 0 && (
                  <div className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-orange-200">
                    {c.joiner}
                  </div>
                )}
                <div className="flex items-center gap-3 bg-white border border-slate-200 pl-4 pr-2 py-2.5 rounded-2xl text-xs shadow-sm group hover:border-[#00A79D] transition-all">
                  <span className="font-bold text-slate-800">{c.field}{c.infoFieldName ? `:${c.infoFieldName}` : ''}</span>
                  <span className="text-slate-400 italic">{c.operator}</span>
                  <span className="bg-emerald-50 text-[#00A79D] px-2 py-0.5 rounded-lg font-bold border border-emerald-100">{c.value}</span>
                  <button onClick={() => onRemove(c.id)} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Live Selection Preview</h3>
            <p className="text-sm text-slate-500 font-medium">Matching orders based on current filters</p>
          </div>
          <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Total Matched:</span>
            <span className="text-lg font-black text-[#00A79D]">142</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Channel</th>
                <th className="px-8 py-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ORDERS.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-mono font-bold text-[#00A79D]">{order.id}</td>
                  <td className="px-8 py-4 font-bold text-slate-800">{order.client}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${order.priority === 'P1' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500'}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-slate-500 font-medium">{order.channel}</td>
                  <td className="px-8 py-4 text-slate-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center bg-slate-50/50 border-t border-slate-100">
            <button className="text-xs font-bold text-[#00A79D] hover:underline">View all 142 matching orders</button>
          </div>
        </div>
      </div>

      {/* Modal remains the same but with enhanced styling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">New Selection Filter</h3>
                <p className="text-slate-500 text-sm">Target specific orders for orchestration.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              {conditions.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">Logical Joiner</label>
                  <div className="flex gap-2">
                    {['AND', 'OR'].map(joiner => (
                      <button
                        key={joiner}
                        onClick={() => setNewCondition({...newCondition, joiner: joiner as any})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                          newCondition.joiner === joiner 
                            ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20' 
                            : 'bg-white border-slate-200 text-slate-400 hover:border-orange-300'
                        }`}
                      >
                        {joiner}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 relative">
                <label className="text-[11px] font-bold text-slate-500 block">Field</label>
                <div className="relative">
                  <select 
                    value={newCondition.field}
                    onChange={e => setNewCondition({...newCondition, field: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all appearance-none cursor-pointer pr-10"
                  >
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {isInformationField && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">Information field name</label>
                    <input 
                      type="text"
                      value={newCondition.infoFieldName}
                      onChange={e => setNewCondition({...newCondition, infoFieldName: e.target.value})}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">Information field type</label>
                    <div className="relative">
                      <select 
                        value={newCondition.infoFieldType}
                        onChange={e => setNewCondition({...newCondition, infoFieldType: e.target.value})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all appearance-none cursor-pointer pr-10"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                        <option value="date">date</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 block">Operator</label>
                <div className="relative">
                  <select 
                    value={newCondition.operator}
                    onChange={e => setNewCondition({...newCondition, operator: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all appearance-none cursor-pointer pr-10"
                  >
                    {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 block">Values</label>
                <div className="relative">
                  <select 
                    value={newCondition.value}
                    onChange={e => setNewCondition({...newCondition, value: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Select option</option>
                    <option value="FR">France</option>
                    <option value="UK">United Kingdom</option>
                    <option value="US">USA</option>
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-2 bg-[#00A79D] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-[#008d84] transition-all"
              >
                Confirm Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
