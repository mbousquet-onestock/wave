
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
      
      {/* Step 2 Sub-Header & Mode Selection */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#00A79D]/10 text-[#00A79D] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Step 02</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Execution Scenario</h2>
          </div>
          <p className="text-slate-500 text-xs font-medium">Configure routing logic and volume constraints.</p>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200 shadow-inner w-full md:w-auto">
          <button
            onClick={() => setMode('strategy')}
            className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-3 ${
              mode === 'strategy' 
                ? 'bg-white text-[#00A79D] shadow-md border border-slate-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Auto Strategy
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-3 ${
              mode === 'manual' 
                ? 'bg-white text-orange-600 shadow-md border border-slate-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Manual Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col min-h-[550px]">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 mb-1">
                {mode === 'strategy' ? 'Decision Engine' : 'Destination Pool'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {mode === 'strategy' ? 'Automatic matching logic' : 'Forced fulfillment points'}
              </p>
            </div>

            <div className="p-8 space-y-6 flex-1">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder={mode === 'strategy' ? "Find orchestration strategy..." : "Search Stock Point ID..."}
                  value={mode === 'strategy' ? strategySearch : stockPointSearch}
                  onChange={(e) => mode === 'strategy' ? setStrategySearch(e.target.value) : setStockPointSearch(e.target.value)}
                  className={`w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all outline-none focus:ring-4 ${
                    mode === 'strategy' ? 'focus:ring-[#00A79D]/10 focus:border-[#00A79D]' : 'focus:ring-orange-500/10 focus:border-orange-500'
                  }`}
                />
                <div className={`absolute left-4.5 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform ${
                  mode === 'strategy' ? 'text-[#00A79D]' : 'text-orange-500'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                
                {mode === 'manual' && stockPointSearch && filteredStockPoints.length > 0 && (
                  <div className="absolute z-50 top-full left-0 w-full mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-4">
                    {filteredStockPoints.map(sp => (
                      <button 
                        key={sp}
                        onClick={() => { toggleStockPoint(sp); setStockPointSearch(''); }}
                        className="w-full text-left px-5 py-3.5 text-sm font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        {sp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {mode === 'strategy' ? (
                  filteredStrategies.map((strategy) => (
                    <div 
                      key={strategy.id}
                      onClick={() => setSelectedStrategyId(strategy.id)}
                      className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group ${
                        selectedStrategyId === strategy.id 
                          ? 'bg-white border-[#00A79D] shadow-lg ring-8 ring-[#00A79D]/5' 
                          : 'bg-white border-slate-50 hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                        selectedStrategyId === strategy.id 
                          ? 'bg-[#00A79D] text-white shadow-lg shadow-emerald-500/20 rotate-3' 
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-black text-base truncate ${selectedStrategyId === strategy.id ? 'text-[#00A79D]' : 'text-slate-800'}`}>
                          {strategy.name}
                        </h3>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter bg-slate-100 text-slate-400">
                          {strategy.rulesCount} Rules
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  config.stockPoints.map(sp => (
                    <div key={sp} className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-[1.5rem] group hover:border-orange-200 shadow-sm transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        </div>
                        <span className="font-black text-slate-800 tracking-tight">{sp}</span>
                      </div>
                      <button 
                        onClick={() => removeStockPoint(sp)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30 relative overflow-hidden">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
                Simulation Caps
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Constraint envelopes applied to this wave execution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders Count</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      value={config.minOrders}
                      onChange={e => setConfig({...config, minOrders: parseInt(e.target.value) || 0})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-800 outline-none focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="number"
                      value={config.maxOrders}
                      onChange={e => setConfig({...config, maxOrders: parseInt(e.target.value) || 0})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-800 outline-none focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume (m³)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" step="0.1"
                      value={config.minVolume}
                      onChange={e => setConfig({...config, minVolume: parseFloat(e.target.value) || 0})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-800 outline-none focus:border-[#00A79D] transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="number" step="0.1"
                      value={config.maxVolume}
                      onChange={e => setConfig({...config, maxVolume: parseFloat(e.target.value) || 0})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-800 outline-none focus:border-[#00A79D] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${mode === 'strategy' ? 'bg-[#00A79D]' : 'bg-orange-600'} text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group`}>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Active Wave Context</h3>
              <p className="text-white/80 text-sm max-w-lg leading-relaxed font-medium">
                {mode === 'strategy' ? (
                  <>Orchestrating using <span className="text-white font-black underline">"{selectedStrategyName}"</span>. Logic evaluates proximity, cost, and load balancing.</>
                ) : (
                  <>Strict adherence to <span className="text-white font-black underline">{config.stockPoints.length} fulfillment points</span>. No fallback logic applied.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
