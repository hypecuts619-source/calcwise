import React, { useEffect, useState, useRef } from 'react';
import { Copy, RotateCcw, Save, Trash2, SplitSquareHorizontal, Printer, Link as LinkIcon, Share2, Download, FileText, Target, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { CalculationInput, CalculationResult } from '../types.ts';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext.tsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import { ChartRenderer } from './ChartRenderer.tsx';

interface CalculatorWidgetProps {
  id: string;
  title: string;
  inputs: CalculationInput[];
  onCalculate: (values: Record<string, any>) => CalculationResult[];
  children?: React.ReactNode;
}

export function CalculatorWidget({ id, title, inputs, onCalculate, children }: CalculatorWidgetProps) {
  const { symbol: globalSymbol, code: globalCode, setCurrency: setGlobalCurrency } = useCurrency();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<Record<string, any>>(() => {
    // 1. Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialValues: Record<string, any> = {};
    let hasUrlParams = false;

    inputs.forEach(input => {
      const urlValue = urlParams.get(input.name);
      if (urlValue !== null && urlValue !== '') {
        hasUrlParams = true;
        initialValues[input.name] = input.type === 'number' ? parseFloat(urlValue) : urlValue;
      } else {
        initialValues[input.name] = input.defaultValue ?? '';
      }
    });

    if (hasUrlParams) return initialValues;

    // 2. Check local storage draft
    const draft = localStorage.getItem(`calcwise_draft_${id}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        inputs.forEach(input => {
          if (parsed[input.name] !== undefined) initialValues[input.name] = parsed[input.name];
        });
      } catch (e) {}
    }
    return initialValues;
  });

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<{id: string, name: string, values: Record<string, any>, results: CalculationResult[]}[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Goal seek state
  const [targetMode, setTargetMode] = useState<{
    inputName: string;
    targetResultLabel: string;
    targetValue: string;
  } | null>(null);

  const handleGoalSeek = () => {
    if (!targetMode) return;
    const targetValueNum = parseFloat(targetMode.targetValue);
    if (isNaN(targetValueNum)) return;

    const inputName = targetMode.inputName;
    const targetResultLabel = targetMode.targetResultLabel;
    const inputDef = inputs.find(i => i.name === inputName);
    
    // Evaluate goal seek using binary search
    const evaluate = (testVal: number) => {
       const testValues = {...values, [inputName]: testVal, currencySymbol: globalSymbol};
       try {
           const outResults = onCalculate(testValues);
           const targetRes = outResults.find(r => r.label === targetResultLabel);
           if (!targetRes) return NaN;
           const numStr = String(targetRes.value).replace(/[^0-9.-]+/g,"");
           return parseFloat(numStr);
       } catch (e) {
           return NaN;
       }
    };

    let low = inputDef?.min ?? 0;
    let high = inputDef?.max ?? 100000000;
    
    const valLow = evaluate(low);
    const valHigh = evaluate(high);
    
    if (isNaN(valLow) || isNaN(valHigh)) {
        displayToast("Cannot evaluate goal seek for this input. Please adjust other parameters and try again.");
        return;
    }
    
    if (Math.abs(valHigh - valLow) < 0.00001) {
        displayToast("Target result does not change based on this input.");
        return;
    }

    const isIncreasing = valHigh > valLow;
    let iterations = 0;
    let bestVal = values[inputName] || 0;

    if ((isIncreasing && (targetValueNum < valLow || targetValueNum > valHigh)) ||
        (!isIncreasing && (targetValueNum > valLow || targetValueNum < valHigh))) {
        displayToast(`Target value is out of reachable bounds. Reachable range is ${Math.min(valLow, valHigh).toFixed(2)} to ${Math.max(valLow, valHigh).toFixed(2)}.`);
        return;
    }

    while(iterations < 100) {
       const mid = (low + high) / 2;
       const midVal = evaluate(mid);
       if (isNaN(midVal)) break;
       
       if (Math.abs(midVal - targetValueNum) < 0.001 || Math.abs(high - low) < 0.0001) {
          bestVal = mid;
          break;
       }
       if (isIncreasing) {
          if (midVal < targetValueNum) low = mid;
          else high = mid;
       } else {
          if (midVal > targetValueNum) low = mid;
          else high = mid;
       }
       bestVal = mid;
       iterations++;
    }
    
    const stepObj = inputDef?.step ? inputDef.step : 0.01;
    const roundedBest = Math.round(bestVal / stepObj) * stepObj;

    const err = validate(inputName, roundedBest);
    setErrors(prev => ({ ...prev, [inputName]: err || '' }));
    setValues(prev => ({ ...prev, [inputName]: roundedBest }));
    setTargetMode(null);
  };

  // Load saved scenarios on mount / ID change
  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`calcwise_compare_${id}`);
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved));
      } catch(e) {}
    } else {
      setSavedScenarios([]);
    }
  }, [id]);

  const validate = (name: string, val: any) => {
    const input = inputs.find(i => i.name === name);
    if (!input || input.type !== 'number') return null;
    if (val === '' || isNaN(val)) return null; 
    if (input.min !== undefined && val < input.min) return `Min allowed: ${input.min}`;
    if (input.max !== undefined && val > input.max) return `Max allowed: ${input.max}`;
    return null;
  };

  const handleCalculate = () => {
    // Check globally for validation errors
    let isInvalid = false;
    inputs.forEach(input => {
      const err = validate(input.name, values[input.name]);
      if (err) isInvalid = true;
    });

    if (isInvalid) {
      setResults([]);
      return; 
    }

    const newResults = onCalculate({ ...values, currencySymbol: globalSymbol });
    setResults(newResults);
  };

  const handleReset = () => {
    const resetValues = inputs.reduce((acc, input) => {
      acc[input.name] = input.defaultValue ?? '';
      return acc;
    }, {} as Record<string, any>);
    setValues(resetValues);
    setErrors({});
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleCopy = () => {
    const text = results.map(r => `${r.label}: ${r.value}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Label,Value\n"
      + results.map(r => `"${r.label}","${r.value}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${id}-results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    if (results.length === 0) return;
    const doc = new jsPDF();
    
    // CalcWise Branding
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Primary color
    doc.text("CalcWise", 14, 22);
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); 
    doc.text(`${title} Report`, 14, 32);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 38);
    
    const inputData = inputs.filter(i => i.type !== 'hidden').map(i => {
      const val = values[i.name] !== undefined ? values[i.name] : '-';
      const unit = i.unit ? (i.unit === '$' ? globalSymbol : i.unit) : '';
      return [i.label, `${val} ${unit}`.trim()];
    });
    
    autoTable(doc, {
      startY: 45,
      head: [['Input', 'Value']],
      body: inputData,
      theme: 'grid',
      headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 45;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Calculation Results", 14, finalY + 10);
    
    const resultData = results.filter(r => !r.chartData).map(r => [r.label, r.value.toString()]);
    
    autoTable(doc, {
      startY: finalY + 14,
      head: [['Result', 'Value']],
      body: resultData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    // Check if there is a chart to capture
    const chartElements = document.querySelectorAll('.calcwise-chart-capture');
    for (let i = 0; i < chartElements.length; i++) {
        const el = chartElements[i] as HTMLElement;
        try {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (currentY + imgHeight > 280) {
                doc.addPage();
                currentY = 20;
            }
            
            doc.addImage(imgData, 'PNG', 14, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 10;
        } catch(e) {
            console.error("Failed to capture chart", e);
        }
    }
    
    // Footer branding
    if (currentY + 20 > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Find more free specialized tools at CalcWise.com", 14, currentY + 10);

    doc.save(`${id}-report.pdf`);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    inputs.forEach(input => {
      if (values[input.name] !== undefined && values[input.name] !== '') {
        url.searchParams.set(input.name, String(values[input.name]));
      }
    });
    navigator.clipboard.writeText(url.toString());
    displayToast("Shareable link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveScenario = () => {
    if (results.length === 0) return;
    const newScenario = {
      id: Date.now().toString(),
      name: `Option ${savedScenarios.length + 1}`,
      values: { ...values },
      results: [...results]
    };
    const updated = [...savedScenarios, newScenario];
    setSavedScenarios(updated);
    if (id) {
      localStorage.setItem(`calcwise_compare_${id}`, JSON.stringify(updated));
    }
  };

  const handleRemoveScenario = (scenId: string) => {
    const updated = savedScenarios.filter(s => s.id !== scenId);
    setSavedScenarios(updated);
    if (id) {
      localStorage.setItem(`calcwise_compare_${id}`, JSON.stringify(updated));
    }
  };

  const handleClearScenarios = () => {
    setSavedScenarios([]);
    if (id) {
      localStorage.removeItem(`calcwise_compare_${id}`);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    const err = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: err || '' }));
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Recalculate when values or global currency changes + trigger draft auto-save
  useEffect(() => {
    handleCalculate();
    localStorage.setItem(`calcwise_draft_${id}`, JSON.stringify(values));
  }, [values, globalSymbol]);

  return (
    <div className="w-full space-y-12 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 z-50">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}
      <div className="card-surface p-4 sm:p-6 md:p-8 w-full max-w-3xl mx-auto backdrop-blur-sm bg-white/95 leading-normal rounded-2xl shadow-sm border border-border print:shadow-none print:border-none print:bg-transparent">
        <div className="flex justify-between items-center mb-8 border-b border-border pb-4 print:hidden">
          <h2 className="text-xl font-display font-bold text-heading">{title}</h2>
          <div className="flex items-center space-x-3">
             <button onClick={handleShare} className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/5 transition-all outline-none" title="Share current calculation">
               <Share2 className="h-4 w-4" />
             </button>
             <label className="text-[10px] font-bold text-hint uppercase tracking-widest hidden sm:inline-block">Region</label>
             <select 
               value={globalCode}
               onChange={(e) => {
                 const selected = SUPPORTED_CURRENCIES.find(c => c.code === e.target.value);
                 if (selected) setGlobalCurrency(selected.symbol, selected.code);
               }}
               className="bg-slate-50 border border-border rounded-lg px-2 py-1.5 text-xs font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
             >
               {SUPPORTED_CURRENCIES.map(c => (
                 <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
               ))}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 print:hidden">
          {inputs.map((input) => {
            if (input.condition && values[input.condition.field] !== input.condition.value) {
              return null;
            }
            return (
            <div key={input.name} className="flex flex-col space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-heading uppercase tracking-wider">{input.label}</label>
                <div className="flex items-center space-x-2">
                  {input.type === 'number' && results.length > 0 && (
                     <button 
                       onClick={() => setTargetMode({ inputName: input.name, targetResultLabel: results[0]?.label || '', targetValue: '' })}
                       className="text-hint hover:text-primary transition-colors flex items-center space-x-1" 
                       title="Goal seek - Find required input to hit target"
                     >
                       <Target className="h-4 w-4" />
                     </button>
                  )}
                  {input.unit && <span className="text-[10px] font-bold text-hint">{input.unit === '$' ? globalSymbol : input.unit}</span>}
                </div>
              </div>
              
              {targetMode?.inputName === input.name ? (
                 <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-primary uppercase">Goal Seek Mode</span>
                       <button onClick={() => setTargetMode(null)} className="text-slate-400 hover:text-red-500">
                         <X className="h-4 w-4" />
                       </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-hint uppercase">Target Result</label>
                        <select 
                          className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm mt-1 focus:border-primary outline-none"
                          value={targetMode.targetResultLabel}
                          onChange={(e) => setTargetMode({ ...targetMode, targetResultLabel: e.target.value })}
                        >
                          {results.filter(r => !r.chartData && (typeof r.value !== 'string' || !isNaN(parseFloat(String(r.value).replace(/[^0-9.-]+/g,""))))).map(r => (
                             <option key={r.label} value={r.label}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-hint uppercase">Desired Value</label>
                        <input 
                          type="number" 
                          className="input-field mt-1" 
                          placeholder="e.g. 400"
                          value={targetMode.targetValue}
                          onChange={(e) => setTargetMode({ ...targetMode, targetValue: e.target.value })}
                        />
                      </div>
                      <button onClick={handleGoalSeek} className="btn-primary w-full py-2 text-sm">Calculate Required {input.label}</button>
                    </div>
                 </div>
              ) : input.type === 'number' && (
                <>
                  <input
                    type="number"
                    value={Number.isNaN(values[input.name]) ? '' : (values[input.name] ?? '')}
                    onChange={(e) => handleInputChange(input.name, e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder={input.placeholder}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    className={cn("input-field", errors[input.name] ? 'border-red-500 focus:ring-red-500/20' : '')}
                  />
                  {/* Slider Control for standard ranges */}
                  {input.min !== undefined && input.max !== undefined && (
                    <input 
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step || ((input.max - input.min) / 100)}
                      value={Number.isNaN(values[input.name]) ? input.min : (values[input.name] ?? input.min)}
                      onChange={(e) => handleInputChange(input.name, e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  )}
                  {errors[input.name] && <span className="text-[10px] text-red-500 font-bold">{errors[input.name]}</span>}
                </>
              )}
              {input.type === 'select' && (
                 <select 
                   value={values[input.name]}
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                   className="input-field appearance-none"
                 >
                   {input.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                 </select>
              )}
              {input.type === 'date' && (
                 <input
                   type="date"
                   value={values[input.name]}
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                   className="input-field"
                 />
              )}
              {input.type === 'text' && (
                 <input
                   type="text"
                   value={values[input.name]}
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                   className="input-field"
                 />
              )}
            </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-10 print:hidden">
          <button type="button" onClick={handleReset} className="btn-secondary w-full flex items-center justify-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset Forms</span>
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-light-blue/30 lg:bg-primary/5 rounded-xl p-4 sm:p-6 border border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500 print:bg-transparent print:border-none print:p-0">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Results</h3>
              <div className="flex space-x-2">
                <button onClick={handleExportPDF} className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all outline-none" title="Export to PDF">
                  <FileText className="h-4 w-4" />
                </button>
                <button onClick={handleDownloadCSV} className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all outline-none" title="Download CSV">
                  <Download className="h-4 w-4" />
                </button>
                <button onClick={handlePrint} className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all outline-none" title="Print format">
                  <Printer className="h-4 w-4" />
                </button>
                <button onClick={handleCopy} className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all outline-none" title="Copy to clipboard">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 print:grid-cols-2">
              {results.map((res, idx) => (
                <div key={idx} className={cn("flex flex-col", res.isPrimary && !res.chartData ? "sm:col-span-2 items-center text-center" : "", res.chartData ? "sm:col-span-2" : "")}>
                  <div className={cn("flex flex-col", res.isPrimary && !res.chartData ? "items-center" : "")}>
                    <span className="text-xs text-body font-medium mb-1">{res.label}</span>
                    <span className={cn(
                      "font-display font-black tracking-tight",
                      res.isPrimary ? "text-4xl text-primary print:text-5xl" : "text-xl text-heading"
                    )}>
                      {res.value}
                    </span>
                    {res.helpText && <p className="text-[10px] text-hint mt-1 font-semibold">{res.helpText}</p>}
                    {res.explanation && <p className="text-sm text-body mt-3 leading-relaxed max-w-prose text-left">{res.explanation}</p>}
                  </div>
                  {res.chartData && (
                    <div className="calcwise-chart-capture w-full bg-white p-4 rounded-xl mt-4">
                      <ChartRenderer data={res.chartData} type={res.chartType} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {children && <div className="mt-8 pt-8 border-t border-primary/10">{children}</div>}
            
            <div className="flex justify-center sm:justify-start items-center mt-8 pt-6 border-t border-primary/10 print:hidden">
                <button onClick={handleSaveScenario} className="flex items-center space-x-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-lg transition-all outline-none group border border-primary/10 hover:border-primary/30">
                   <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                   <span>Save & compare</span>
                </button>
            </div>
          </div>
        )}
      </div>

      {savedScenarios.length > 0 && (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 mt-16 pt-8 border-t border-border/50 print:break-before-page">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-display font-bold text-heading flex items-center gap-2">
              <SplitSquareHorizontal className="h-6 w-6 text-primary" />
              Compare Saved Options
            </h3>
            <button onClick={handleClearScenarios} className="text-[10px] sm:text-xs text-hint hover:text-red-500 font-bold uppercase tracking-widest transition-colors flex items-center gap-1 outline-none px-2 py-1 rounded-md hover:bg-red-50/50 border border-transparent hover:border-red-100 print:hidden">
              <Trash2 className="h-3 w-3" /> <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-border">
              <table className="w-full text-left border-collapse min-w-[600px] print:min-w-full">
                 <thead>
                    <tr className="bg-slate-50 border-b border-border">
                       <th className="p-4 font-bold text-[10px] text-hint uppercase tracking-widest border-r border-border/50 bg-slate-100/50 w-1/4">Variable</th>
                       {savedScenarios.map(scen => (
                          <th key={scen.id} className="p-4 font-bold text-sm text-heading min-w-[150px]">
                             <div className="flex items-center justify-between gap-4">
                                <span>{scen.name}</span>
                                <button onClick={() => handleRemoveScenario(scen.id)} className="text-hint hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors print:hidden" title="Remove option">
                                   <Trash2 className="h-3.5 w-3.5" />
                                </button>
                             </div>
                          </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border text-sm">
                    <tr><td colSpan={savedScenarios.length + 1} className="bg-light-blue/20 p-2 px-4 font-bold text-[10px] text-primary uppercase tracking-widest">Inputs</td></tr>
                    {inputs.filter(i => i.type !== 'hidden').map(input => (
                       <tr key={input.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 py-3 font-medium text-body border-r border-border/50 bg-slate-50/30">{input.label}</td>
                          {savedScenarios.map(scen => (
                             <td key={scen.id} className="p-4 py-3 text-heading">
                                {scen.values[input.name]} <span className="text-[10px] text-hint ml-1">{input.unit ? (input.unit === '$' ? globalSymbol : input.unit) : ''}</span>
                             </td>
                          ))}
                       </tr>
                    ))}

                    <tr><td colSpan={savedScenarios.length + 1} className="bg-light-blue/20 p-2 px-4 font-bold text-[10px] text-primary uppercase tracking-widest mt-2 border-t border-border">Results</td></tr>
                    {savedScenarios[0]?.results.map((res, i) => (
                        <tr key={res.label} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 py-3 font-medium text-body border-r border-border/50 bg-slate-50/30">{res.label}</td>
                            {savedScenarios.map(scen => (
                               <td key={scen.id} className={cn("p-4 py-3 font-bold", scen.results[i]?.isPrimary ? "text-primary text-base" : "text-heading")}>
                                  {scen.results[i]?.value || '-'}
                               </td>
                            ))}
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


