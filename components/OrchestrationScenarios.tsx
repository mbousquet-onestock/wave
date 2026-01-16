
import React, { useState, useMemo } from 'react';
import { ORCHESTRATION_STRATEGIES } from '../constants';

type OrchestrationMode = 'strategy' | 'manual';

export const OrchestrationScenarios: React.FC = () => {
  const [mode, setMode] = useState<OrchestrationMode>('strategy');
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(ORCHESTRATION_STRATEGIES[0].id);
  const [strategySearch, setStrategySearch] = useState('');
  const [stockPointSearch, setStockPointSearch] = useState('');
  
  const [config, setConfig] = useState({
    stockPoints: ['WH-PARIS-01', 'WH-LYON-02'],
    minOrders: 1,
    maxOrders: 50,
    minLines: 1,
    maxLines: 200,
    minQty: 1,
    maxQty: 500,
    minVolume: 0.1,
    maxVolume: 10.5
  });

  const allAvailableStockPoints = [
    'WH-PARIS-01', 'WH-LYON-02', 'STORE-NICE-04', 'WH-BERLIN-01', 
    'WH-MADRID-03', 'STORE-LONDON-01', 'WH-MILAN-02', 'STORE-ROME-01'
  ];

  const filteredStrategies = useMemo(() => 
    ORCHESTRATION_STRATEGIES.filter(s => 
      s.name.toLowerCase().includes(strategySearch.toLowerCase())
    ), [strategySearch]
  );

  const filteredStockPoints = useMemo(() => 
    allAvailableStockPoints.filter(sp => 
      sp.toLowerCase().includes(stockPointSearch.toLowerCase()) && !config.stockPoints.includes(sp)
    ), [stockPointSearch, config.stockPoints]
  );

  const toggleStockPoint = (sp: string) => {
    setConfig(prev => ({
      ...prev,
      stockPoints: prev.stockPoints.includes(sp) 
        ? prev.stockPoints.filter(s => s !== sp) 
        : [...prev.stockPoints, sp]
    }));
  };

  const removeStockPoint = (sp: string) => {
    setConfig(prev => ({
      ...prev,
      stockPoints: prev.stockPoints.filter(s => s !== sp)
    }));
  };

  const selectedStrategyName = ORCHESTRATION_STRATEGIES.find(s => s.id === selectedStrategyId)?.name;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Mode Selector Toggle - Enforces Mutual Exclusivity */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200 shadow-inner overflow-hidden">
          <button
            onClick={() => setMode('strategy')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'strategy' 
                ? 'bg-white text-[#00A79D] shadow-md border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Automatic Strategy
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'manual' 
                ? 'bg-white text-orange-600 shadow-md border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Manual Routing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Selection (Exclusive) */}
        <div className="lg:col-span-5 space-y-6">
          {mode === 'strategy' ? (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between px-2 mb-6">
                  <h2 className="text-lg font-black text-slate-900">Choose Strategy</h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredStrategies.length} Matched</span>
                </div>
                
                <div className="relative group mb-6">
                  <input 
                    type="text"
                    placeholder="Search strategy..."
                    value={strategySearch}
                    onChange={(e) => setStrategySearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#00A79D]/5 focus:border-[#00A79D] transition-all outline-none"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00A79D]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredStrategies.map((strategy) => (
                    <div 
                      key={strategy.id}
                      onClick={() => setSelectedStrategyId(strategy.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                        selectedStrategyId === strategy.id 
                          ? 'bg-white border-[#00A79D] shadow-lg ring-4 ring-[#00A79D]/5' 
                          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        selectedStrategyId === strategy.id ? 'bg-emerald-50 text-[#00A79D]' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-[#00A79D]'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm truncate ${selectedStrategyId === strategy.id ? 'text-[#00A79D]' : 'text-slate-800'}`}>
                          {strategy.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{strategy.rulesCount} rules</p>
                      </div>
                      {selectedStrategyId === strategy.id && (
                        <div className="w-6 h-6 bg-[#00A79D] text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between px-2 mb-6">
                  <h2 className="text-lg font-black text-slate-900">Manual Scope</h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.stockPoints.length} Selected</span>
                </div>
                
                <div className="relative group mb-6">
                  <input 
                    type="text"
                    placeholder="Input Stock Point ID..."
                    value={stockPointSearch}
                    onChange={(e) => setStockPointSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all outline-none"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  
                  {stockPointSearch && filteredStockPoints.length > 0 && (
                    <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredStockPoints.map(sp => (
                        <button 
                          key={sp}
                          onClick={() => { toggleStockPoint(sp); setStockPointSearch(''); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {config.stockPoints.map(sp => (
                    <div key={sp} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl group hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        </div>
                        <span className="font-bold text-slate-800">{sp}</span>
                      </div>
                      <button 
                        onClick={() => removeStockPoint(sp)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {config.stockPoints.length === 0 && (
                    <div className="text-center py-12 text-slate-400 italic text-sm">No stock points added.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Global Simulation Parameters */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="mb-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-800 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                Simulation Caps
              </h2>
              <p className="text-slate-500 text-sm mt-1">Numerical range limits applied to this specific orchestration wave.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Orders Range */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Orders count</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Min</span>
                    <input 
                      type="number" min="0" max={config.maxOrders}
                      value={config.minOrders}
                      onChange={e => setConfig({...config, minOrders: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Max</span>
                    <input 
                      type="number" min={config.minOrders} max="500"
                      value={config.maxOrders}
                      onChange={e => setConfig({...config, maxOrders: Math.min(500, Math.max(config.minOrders, parseInt(e.target.value) || 0))})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Order Lines Range */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Order Lines count</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Min</span>
                    <input 
                      type="number" min="0" max={config.maxLines}
                      value={config.minLines}
                      onChange={e => setConfig({...config, minLines: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Max</span>
                    <input 
                      type="number" min={config.minLines} max="2000"
                      value={config.maxLines}
                      onChange={e => setConfig({...config, maxLines: Math.min(2000, Math.max(config.minLines, parseInt(e.target.value) || 0))})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Total Items Range */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Total Items count</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Min</span>
                    <input 
                      type="number" min="0" max={config.maxQty}
                      value={config.minQty}
                      onChange={e => setConfig({...config, minQty: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Max</span>
                    <input 
                      type="number" min={config.minQty} max="5000"
                      value={config.maxQty}
                      onChange={e => setConfig({...config, maxQty: Math.min(5000, Math.max(config.minQty, parseInt(e.target.value) || 0))})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Volume Range */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Volume (m³)</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Min</span>
                    <input 
                      type="number" step="0.1" min="0" max={config.maxVolume}
                      value={config.minVolume}
                      onChange={e => setConfig({...config, minVolume: Math.max(0, parseFloat(e.target.value) || 0)})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Max</span>
                    <input 
                      type="number" step="0.1" min={config.minVolume} max="100"
                      value={config.maxVolume}
                      onChange={e => setConfig({...config, maxVolume: Math.min(100, Math.max(config.minVolume, parseFloat(e.target.value) || 0))})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#00A79D]/10 focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Preview */}
          <div className={`${mode === 'strategy' ? 'bg-[#00A79D]' : 'bg-orange-600'} text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all duration-500`}>
            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-2 uppercase tracking-widest">Active Scenario Preview</h3>
              <p className="text-white/80 text-sm max-w-md leading-relaxed">
                {mode === 'strategy' ? (
                  <>Processing <span className="text-white font-black underline">142 orders</span> using the <span className="text-white font-black underline">"{selectedStrategyName}"</span> automatic decision engine.</>
                ) : (
                  <>Strict manual routing applied to <span className="text-white font-black underline">{config.stockPoints.length} points</span>. Target range: <span className="text-white font-black underline">{config.minOrders} to {config.maxOrders} orders</span>.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};
