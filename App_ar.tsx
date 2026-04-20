
import React, { useState } from 'react';
import { SCENARIOS, OTA_FEE_PERCENTAGE, VAT_PERCENTAGE } from './constants';
import { Scenario, UnitMixItem } from './types';
import Header_ar from './components/Header_ar';
import { Section } from './components/DashboardComponents';
import { FadeInUp } from './components/AnimatedWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { BanknotesIcon, UploadIcon, LinkIcon } from './components/Icons';

const formatCurrency = (value: number) => {
    return `${Math.round(value).toLocaleString('ar-SA')} ريال`;
};

type CaseType = 'worst' | 'base' | 'best';

// --- Apple-Style Segmented Control (RTL Optimized) ---
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
        <div className={`p-1 sm:p-1.5 rounded-full flex relative w-full sm:w-auto overflow-hidden ${containerClass} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {options.map((option) => {
                const isActive = selected === option.value;
                const activePillClass = option.activePillClassName || defaultActivePillClass;
                const activeTextClass = option.activeTextClassName || defaultActiveTextClass;

                return (
                    <button
                        key={option.value}
                        onClick={() => !disabled && onChange(option.value)}
                        className={`relative z-10 flex-1 px-3 sm:px-6 py-2.5 sm:py-2 text-[13px] sm:text-sm font-bold transition-colors duration-200 rounded-full font-cairo whitespace-nowrap ${
                            isActive ? activeTextClass : (option.className || defaultInactiveTextClass)
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`pill-ar-${name}`}
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 block text-right">الإيرادات السنوية</span>
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(revenue)}</span>
                </div>
                <div className="text-left">
                    <span className="text-[10px] font-medium text-white/40 bg-white/5 px-1.5 py-0.5 rounded">إجمالي الإيرادات</span>
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
                                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 border border-emerald-500/30 p-5 sm:p-6 shadow-[0_8px_32px_rgba(16,185,129,0.15)] text-right"
                            >
                                <div className="absolute top-0 left-0 p-4 opacity-20">
                                    <div className="w-16 h-16 bg-emerald-400 rounded-full blur-2xl"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${item.color || 'bg-white'} shadow-[0_0_8px_currentColor] text-emerald-400`}></div>
                                             <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">{item.category}</span>
                                        </div>
                                        <span className="text-xs font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full">{percent}٪</span>
                                    </div>
                                    
                                    <div className="flex items-baseline justify-end gap-2 mt-1">
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
                                    <span className="text-xs font-medium text-white/90 tracking-wide">{item.category}</span>
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold text-white tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.2, ease: "circOut" }}
                                    className={`h-full rounded-full ${item.color || 'bg-white'} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const App_ar: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const [scenarios] = useState<Scenario[]>(SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeCase, setActiveCase] = useState<CaseType>('base');
  const [occupancyRate, setOccupancyRate] = useState<number>(0.8); // Default to 80%
  const [managementFee] = useState<number>(0.20); 

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const baseFinancials = activeScenario.financials[activeCase];

  const effectiveOccupancy = occupancyRate;
  const effectiveRevenue = Math.round(baseFinancials.revenue * effectiveOccupancy);
  
  // Fees calculation
  const otaFeeAmount = Math.round(effectiveRevenue * OTA_FEE_PERCENTAGE);
  const vatAmount = Math.round(effectiveRevenue * VAT_PERCENTAGE);
  const operatorFeeAmount = Math.round(effectiveRevenue * managementFee);
  
  // Net Income
  const effectiveNetIncome = effectiveRevenue - otaFeeAmount - vatAmount - operatorFeeAmount;

  const caseOptions = [
      { value: 'worst', label: 'متحفظ' },
      { value: 'base', label: 'واقعي' },
      { value: 'best', label: 'متفائل' },
  ];

  const occupancyOptions = [
      { value: 0.4, label: '٤٠٪' },
      { 
          value: 0.47, 
          label: '٤٧٪', 
          className: 'text-emerald-400 hover:text-emerald-300',
          activePillClassName: 'bg-emerald-500 shadow-sm ring-1 ring-emerald-600',
          activeTextClassName: 'text-white'
      },
      { value: 0.5, label: '٥٠٪' },
      { value: 0.6, label: '٦٠٪' },
      { value: 0.7, label: '٧٠٪', activePillClassName: 'bg-white', activeTextClassName: 'text-black' },
      { value: 0.8, label: '٨٠٪', activePillClassName: 'bg-white', activeTextClassName: 'text-black' },
      { value: 0.9, label: '٩٠٪' },
  ];

  const feeOptions = [
      { value: 0.20, label: '٢٠٪' },
  ];
  
  // Build ledger items dynamically
  const ledgerItems: { category: string; amount: number; color?: string; highlight?: boolean }[] = [];
  
  ledgerItems.push({ category: `رسوم منصات الحجز (١٥.٥٪)`, amount: otaFeeAmount, color: 'bg-blue-400' });
  ledgerItems.push({ category: `ضريبة القيمة المضافة (١٥٪)`, amount: vatAmount, color: 'bg-red-400' });
  ledgerItems.push({ category: `رسوم المشغل (٢٠٪)`, amount: operatorFeeAmount, color: 'bg-purple-400' });
  ledgerItems.push({ category: 'صافي الدخل (المالك)', amount: effectiveNetIncome, color: 'bg-emerald-400', highlight: true });

  const getUnitBasePrice = (unit: UnitMixItem, caseType: CaseType) => {
    if (!unit.priceRange) return unit.avgPrice;
    switch(caseType) {
        case 'worst': return unit.priceRange.min;
        case 'best': return unit.priceRange.max;
        case 'base':
        default: return unit.priceRange.avg;
    }
  };

  const translateScenarioName = (id: string) => {
      return 'المدينة المنورة';
  };

  const translateScenarioDesc = (id: string) => {
      return 'محفظة مكونة من ٣ وحدات فاخرة (M55-1, M55-2, M55-3) ضمن مجمع المدينة المنورة بنموذج التأجير قصير المدى.';
  };
  
  const translateUnitLabel = (id: string) => {
      return 'وحدات';
  };
  
  const translateUnitName = (name: string) => {
      if (name.includes('M55-1')) return 'M55-1: ٢ غرف نوم';
      if (name.includes('M55-2')) return 'M55-2: ٣ غرف نوم';
      if (name.includes('M55-3')) return 'M55-3: استوديو';
      return name;
  };

  const translateDuration = (label: string) => {
      return '٣٦٥ ليلة متاحة';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-cairo overflow-x-hidden selection:bg-[#4A2C5A] selection:text-white" dir="rtl">
      <Header_ar onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        
        <FadeInUp>
          <div className="text-center pt-8 pb-8 sm:pt-16 sm:pb-8">
             <div className="inline-block mb-4 sm:mb-6 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">دراسة جدوى عقارية</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-black text-[#1D1D1F] tracking-tighter mb-4 sm:mb-6 leading-[0.9]">
              المدينة المنورة<span className="text-[#4A2C5A]">.</span>
            </h1>
            <p className="text-sm sm:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight px-4 mb-4">
                تحليل المحفظة لوحدات <span className="text-[#4A2C5A]">٢ غرف، ٣ غرف، واستوديو</span> في مجمع المدينة.
            </p>
            <div className="flex justify-center mb-8">
                <div className="px-4 py-2 rounded-xl bg-[#4A2C5A]/5 border border-[#4A2C5A]/10 flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#4A2C5A]/60 uppercase tracking-widest">أُعِدّ لـ</span>
                    <span className="text-xs sm:text-sm font-bold text-[#4A2C5A]">شركة مرسم للتطوير العقاري</span>
                </div>
            </div>

            {/* Comparison Buttons */}
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
                    <span>مجموعة المقارنة: تحليل السوق</span>
                </button>
            </motion.div>
          </div>
        </FadeInUp>

        {/* Section 2: Interactive Deep Dive */}
        <Section title="تحليل المحفظة" className="!mt-0 !pt-0" titleColor="text-[#1D1D1F]">
            
            <div className="bg-[#000000] text-white rounded-3xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 flex flex-col gap-4 sticky top-0 z-20">
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Simulation Context */}
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1 leading-none">محاكاة تفاعلية</span>
                            <span className="text-sm font-bold text-white uppercase tracking-tight">محفظة المدينة المنورة</span>
                        </div>
                     </div>

                    {/* Simulation Controls - Row */}
                    <AnimatePresence>
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="w-full overflow-x-auto pb-1 sm:pb-0 hide-scrollbar border-t border-white/5 pt-3 overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-w-max mx-auto">
                                    {/* Occupancy */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">معدل الإشغال</span>
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
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">رسوم المشغل</span>
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
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 text-right"
                    >
                        {/* RIGHT COLUMN (Financials) - Natural RTL First Column */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                                    الإيرادات السنوية المتوقعة
                                </p>
                                <div className="flex items-baseline justify-start gap-4 sm:gap-6">
                                    <h2 className="text-3xl sm:text-7xl font-black tracking-tighter text-white tabular-nums">
                                        {formatCurrency(effectiveRevenue)}
                                    </h2>
                                </div>
                                <div className="inline-flex items-center justify-start gap-2 mt-4 px-2 py-1 rounded bg-white/10 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-white/70 tracking-wide uppercase">
                                        {translateDuration(activeScenario.occupancyDurationLabel)}
                                        {` (إشغال ${Math.round(effectiveOccupancy * 100).toLocaleString('ar-SA')}٪)`}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-base sm:text-lg font-bold mb-6 sm:mb-8 flex items-center justify-start gap-3 text-white">
                                    <div className="p-1.5 bg-white/10 rounded-lg">
                                        <BanknotesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                                    </div>
                                    التحليل المالي
                                </h4>
                                <DigitalLedger 
                                    revenue={effectiveRevenue} 
                                    items={ledgerItems} 
                                />
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-base sm:text-lg font-bold mb-6 text-white/90">الإيرادات لكل شقة</h4>
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
                                                            <p className="font-bold text-white text-sm">{translateUnitName(unit.name)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="text-[9px] text-white/40 uppercase tracking-wider">{unit.count} {translateUnitLabel(activeScenario.id)}</span>
                                                    </div>
                                                </div>

                                                {/* Pricing Breakdown */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">سعر اليوم</p>
                                                        <p className="text-lg font-bold text-white tabular-nums">
                                                            {formatCurrency(dailyRate)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">الإيراد السنوي</p>
                                                        <p className="text-lg font-bold text-white tabular-nums">
                                                            {formatCurrency(effectiveAnnual)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                                                        <p className="text-[9px] text-emerald-400/60 uppercase tracking-widest mb-1">صافي الدخل السنوي</p>
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

                        {/* LEFT COLUMN (Context) */}
                        <div className="lg:col-span-5 space-y-6">
                             <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10">
                                 <h4 className="text-white font-bold text-base sm:text-lg mb-2">سياق الدراسة</h4>
                                 <p className="text-sm text-white/60 leading-relaxed font-light mb-6">
                                     {translateScenarioDesc(activeScenario.id)}
                                 </p>

                                 <div className="border-t border-white/10 pt-6">
                                    <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        نموذج التأجير قصير المدى
                                    </h5>
                                    <div className="text-sm text-white/60 leading-relaxed font-light space-y-3">
                                        <p>
                                            تفترض هذه الدراسة تأجير الوحدات بنظام يومي مع معدلات إشغال متغيرة.
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
         <p className="text-sm font-semibold text-[#1D1D1F]/30 uppercase tracking-widest font-cairo">
            دراسة من إعداد مثوى لإدارة الأملاك®
         </p>
      </footer>
    </div>
  );
};

export default App_ar;
