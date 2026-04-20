
import React, { useState } from 'react';
import { SCENARIOS, OTA_FEE_PERCENTAGE, VAT_PERCENTAGE } from './constants';
import { Scenario, UnitMixItem } from './types';
import Header from './components/Header';
import { Section } from './components/DashboardComponents';
import { FadeInUp } from './components/AnimatedWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { BanknotesIcon, LinkIcon } from './components/Icons';

const formatCurrency = (value: number) => {
    return `SAR ${Math.round(value).toLocaleString('en-US')}`;
};

type CaseType = 'worst' | 'base' | 'best';

// --- Apple-Style Segmented Control (Universal White Pill) ---
const SegmentedControl: React.FC<{
    name: string;
    options: { value: string | number; label: string; className?: string; activePillClassName?: string; activeTextClassName?: string }[];
    selected: string | number;
    onChange: (value: any) => void;
    dark?: boolean;
    disabled?: boolean;
}> = ({ name, options, selected, onChange, dark = false, disabled = false }) => {
    
    const containerClass = dark ? 'bg-white/10' : 'bg-[#E5E5EA]';
    const defaultActivePillClass = 'bg-white shadow-sm ring-1 ring-black/5';
    const defaultActiveTextClass = 'text-black';
    const defaultInactiveTextClass = dark ? 'text-white/60 hover:text-white' : 'text-[#8E8E93] hover:text-black';

    return (
        <div className={`p-1 rounded-full flex relative w-full sm:w-auto overflow-hidden ${containerClass} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {options.map((option) => {
                const isActive = selected === option.value;
                const activePillClass = option.activePillClassName || defaultActivePillClass;
                const activeTextClass = option.activeTextClassName || defaultActiveTextClass;

                return (
                    <button
                        key={option.value}
                        onClick={() => !disabled && onChange(option.value)}
                        className={`relative z-10 flex-1 px-3 sm:px-4 py-1.5 sm:py-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 rounded-full whitespace-nowrap ${
                            isActive ? activeTextClass : (option.className || defaultInactiveTextClass)
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`pill-${name}`}
                                className={`absolute inset-0 rounded-full ${activePillClass}`}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

const DigitalLedger: React.FC<{ 
    revenue: number; 
    items: { category: string; amount: number; color?: string; highlight?: boolean }[] 
}> = ({ revenue, items }) => {
    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 block">Total Annual Revenue</span>
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(revenue)}</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-medium text-white/40 bg-white/5 px-1.5 py-0.5 rounded">Gross Potential</span>
                </div>
            </div>
            
            <div className="space-y-4">
                {items.map((item, idx) => {
                    const percent = revenue > 0 ? Math.round((item.amount / revenue) * 100) : 0;
                    
                    if (item.highlight) {
                         return (
                            <motion.div 
                                key={idx}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 border border-emerald-500/30 p-5 sm:p-6 shadow-[0_8px_32px_rgba(16,185,129,0.15)]"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <div className="w-16 h-16 bg-emerald-400 rounded-full blur-2xl"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${item.color || 'bg-white'} shadow-[0_0_8px_currentColor] text-emerald-400`}></div>
                                             <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">{item.category}</span>
                                        </div>
                                        <span className="text-xs font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full">{percent}%</span>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-2xl sm:text-4xl font-black text-white tracking-tighter tabular-nums text-shadow-sm">{formatCurrency(item.amount)}</span>
                                    </div>

                                    {/* Progress Bar specific to highlight */}
                                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-4">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className={`h-full rounded-full ${item.color || 'bg-white'} shadow-[0_0_10px_currentColor]`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    return (
                        <div key={idx} className="group px-1 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ring-1 ring-white/10 ${item.color || 'bg-white'}`}></div>
                                    <span className="text-xs font-medium text-white/70 tracking-wide">{item.category}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm font-bold text-white/90 tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                            </div>
                            {/* Apple Health Style Bar */}
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.2, ease: "circOut" }}
                                    className={`h-full rounded-full ${item.color || 'bg-white'} opacity-60`}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const App_en: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const [scenarios] = useState<Scenario[]>(SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeCase, setActiveCase] = useState<CaseType>('base');
  const [occupancyRate, setOccupancyRate] = useState<number>(0.8); // Default to 80%
  const [managementFee] = useState<number>(0.20); // 20% Operator fee
  
  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const baseFinancials = activeScenario.financials[activeCase];

  const effectiveOccupancy = occupancyRate;
  const effectiveRevenue = Math.round(baseFinancials.revenue * effectiveOccupancy);
  
  // Fees Calculation
  const otaFeeAmount = Math.round(effectiveRevenue * OTA_FEE_PERCENTAGE);
  const vatAmount = Math.round(effectiveRevenue * VAT_PERCENTAGE);
  const operatorFeeAmount = Math.round(effectiveRevenue * managementFee);
  
  // Net Income
  const effectiveNetIncome = effectiveRevenue - otaFeeAmount - vatAmount - operatorFeeAmount;

  const caseOptions = [
      { value: 'worst', label: 'Conservative' },
      { value: 'base', label: 'Realistic' },
      { value: 'best', label: 'Optimistic' },
  ];

  const occupancyOptions = [
      { value: 0.4, label: '40%' },
      { 
          value: 0.47, 
          label: '47%', 
          className: 'text-emerald-400 hover:text-emerald-300',
          activePillClassName: 'bg-emerald-500 shadow-sm ring-1 ring-emerald-600',
          activeTextClassName: 'text-white'
      },
      { value: 0.5, label: '50%' },
      { value: 0.6, label: '60%' },
      { value: 0.7, label: '70%', activePillClassName: 'bg-white', activeTextClassName: 'text-black' },
      { value: 0.8, label: '80%', activePillClassName: 'bg-white', activeTextClassName: 'text-black' },
      { value: 0.9, label: '90%' },
  ];

  const feeOptions = [
      { value: 0.20, label: '20%' },
  ];

  // Build ledger items dynamically
  const ledgerItems: { category: string; amount: number; color?: string; highlight?: boolean }[] = [];
  
  ledgerItems.push({ category: `OTA Fees (15.5%)`, amount: otaFeeAmount, color: 'bg-blue-400' });
  ledgerItems.push({ category: `VAT (15%)`, amount: vatAmount, color: 'bg-red-400' });
  ledgerItems.push({ category: `Operator Fee (20%)`, amount: operatorFeeAmount, color: 'bg-purple-400' });
  ledgerItems.push({ category: 'Net Income (Owner)', amount: effectiveNetIncome, color: 'bg-emerald-400', highlight: true });

  const getUnitBasePrice = (unit: UnitMixItem, caseType: CaseType) => {
    if (!unit.priceRange) return unit.avgPrice;
    switch(caseType) {
        case 'worst': return unit.priceRange.min;
        case 'best': return unit.priceRange.max;
        case 'base':
        default: return unit.priceRange.avg;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-[#4A2C5A] selection:text-white">
      <Header onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        
        {/* Project Header */}
        <FadeInUp>
          <div className="text-center pt-8 pb-8 sm:pt-16 sm:pb-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block mb-3 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm"
            >
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Property Feasibility Study</span>
            </motion.div>
            <h1 className="text-3xl sm:text-6xl font-black text-[#1D1D1F] tracking-tighter mb-4 leading-none text-uppercase">
              Al Madinah<span className="text-[#4A2C5A]">.</span>
            </h1>
            <p className="text-sm sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight px-4 mb-4">
                Portfolio analysis for <span className="text-[#4A2C5A]">2BR, 3BR & Studio</span> units at Al Madinah complex.
            </p>
            <div className="flex justify-center mb-8">
                <div className="px-4 py-2 rounded-xl bg-[#4A2C5A]/5 border border-[#4A2C5A]/10 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#4A2C5A]/60 uppercase tracking-widest">Prepared for</span>
                    <span className="text-xs font-bold text-[#4A2C5A]">Marsam Real Estate Development</span>
                </div>
            </div>

            {/* Comparison Set Buttons */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
            >
                <button
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/1jLhkfBdyH6YDX-_v-slHOjCPCYK48CX93QVF38K4PUI/edit?usp=sharing', '_blank')}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-gray-300 transition-all shadow-sm active:scale-95"
                >
                    <div className="w-6 h-6 rounded-full bg-[#2A5B64]/10 flex items-center justify-center text-[#2A5B64] group-hover:bg-[#2A5B64] group-hover:text-white transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Comp Set: Market Analysis</span>
                </button>
            </motion.div>
          </div>
        </FadeInUp>

        {/* SECTION 2: INTERACTIVE DEEP DIVE (Dark Mode) */}
        <Section title="Portfolio Analysis" className="!mt-0 !pt-0" titleColor="text-[#1D1D1F]">
            
            {/* The Cockpit */}
            <div className="bg-[#000000] text-white rounded-3xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                {/* Control Bar - Mobile Optimized */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 flex flex-col gap-4 sticky top-0 z-20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                         {/* Simulation Context */}
                         <div className="flex flex-col">
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Interactive Simulation</span>
                             <span className="text-sm font-bold text-white uppercase tracking-tight">Al Madinah Portfolio</span>
                         </div>
                    </div>
                    
                    {/* Simulator Controls Row */}
                    <AnimatePresence>
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="w-full overflow-x-auto pb-1 sm:pb-0 hide-scrollbar border-t border-white/5 pt-3 overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-w-max mx-auto">
                                    {/* Occupancy Rate */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Occupancy</span>
                                        <SegmentedControl 
                                            name="cockpit-occupancy"
                                            selected={occupancyRate} 
                                            onChange={(val) => setOccupancyRate(val)}
                                            dark={true}
                                            options={occupancyOptions}
                                        />
                                    </div>
                                    <div className="hidden sm:block w-[1px] h-6 bg-white/10"></div>

                                    {/* Operator Fee */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Operator Fee</span>
                                        <SegmentedControl 
                                            name="cockpit-fee"
                                            selected={managementFee} 
                                            onChange={() => {}}
                                            dark={true}
                                            options={feeOptions}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeScenario.id}-${activeCase}-${occupancyRate}-${managementFee}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
                    >
                        {/* LEFT COLUMN: The Engine */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Hero Revenue */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                                    Projected Annual Revenue
                                </p>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-3xl sm:text-6xl font-black tracking-tighter text-white tabular-nums">
                                        {formatCurrency(effectiveRevenue)}
                                    </h2>
                                </div>
                                <div className="inline-flex items-center gap-2 mt-3 px-2 py-1 rounded bg-white/10 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-white/70 tracking-wide uppercase">
                                        {activeScenario.occupancyDurationLabel}
                                        {` (${Math.round(effectiveOccupancy * 100)}% Occupancy)`}
                                    </span>
                                </div>
                            </div>

                            {/* Digital Ledger */}
                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
                                    <div className="p-1.5 bg-white/10 rounded-md">
                                        <BanknotesIcon className="w-4 h-4 text-white/90" />
                                    </div>
                                    Financial Distribution
                                </h4>
                                <DigitalLedger 
                                    revenue={effectiveRevenue} 
                                    items={ledgerItems} 
                                />
                            </div>

                            {/* Unit Mix - Revenue Per Apartment */}
                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-sm font-bold mb-4 text-white/90">Revenue Per Apartment</h4>
                                <div className="space-y-4">
                                    {activeScenario.unitMix.map((unit, idx) => {
                                        const baseAnnual = getUnitBasePrice(unit, activeCase);
                                        const effectiveAnnual = baseAnnual * effectiveOccupancy;
                                        const dailyRate = Math.round(baseAnnual / 365);
                                        const annualNet = effectiveAnnual * (1 - managementFee - OTA_FEE_PERCENTAGE - VAT_PERCENTAGE);

                                        return (
                                            <div key={idx} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                                                {/* Header Row */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                                                            {unit.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{unit.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-white/40 uppercase tracking-wider">{unit.count} Units</span>
                                                    </div>
                                                </div>

                                                {/* Pricing Breakdown */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Daily Rate</p>
                                                        <p className="text-lg font-bold text-white tabular-nums">
                                                            {formatCurrency(dailyRate)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Annual Revenue</p>
                                                        <p className="text-lg font-bold text-white tabular-nums">
                                                            {formatCurrency(effectiveAnnual)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                                                        <p className="text-[9px] text-emerald-400/60 uppercase tracking-widest mb-1">Annual Net Income</p>
                                                        <p className="text-lg font-bold text-emerald-400 tabular-nums">
                                                            {formatCurrency(annualNet)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Context & Investment Logic */}
                        <div className="lg:col-span-5 space-y-6">
                             {/* Strategy Text */}
                             <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10">
                                 <h4 className="text-white font-bold text-base sm:text-lg mb-2">Study Context</h4>
                                 <p className="text-sm text-white/60 leading-relaxed font-light mb-6">
                                     {activeScenario.description}
                                 </p>

                                 <div className="border-t border-white/10 pt-6">
                                    <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Short Term Rental Model
                                    </h5>
                                    <div className="text-sm text-white/60 leading-relaxed font-light space-y-3">
                                        <p>
                                            This study assumes daily rentals with variable occupancy rates.
                                        </p>
                                    </div>
                                 </div>
                             </div>

                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
            
        </Section>

      </main>

      <footer className="py-12 text-center pb-20 sm:pb-12">
         <p className="text-sm font-semibold text-[#1D1D1F]/30 uppercase tracking-widest">
            Study by Mathwaa Property Management®
         </p>
      </footer>
    </div>
  );
};

export default App_en;
