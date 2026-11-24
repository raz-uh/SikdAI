import React, { useState } from 'react';
import { QUICK_CHEATSHEETS } from '../data/cdcData';
import { FileText, Atom, Calculator, Feather, Search, Copy, Check } from 'lucide-react';

export const CheatsheetModal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            नेपाल CDC सूत्र तथा मुख्य नियमहरू (Formula & Cheat Sheets)
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            कक्षा १-१० का लागि विज्ञान, गणित र नेपाली व्याकरणका मुख्य सूत्रहरू
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="सूत्र वा नियम खोज्नुहोस्..."
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 w-full sm:w-60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUICK_CHEATSHEETS.map((sheet, sIdx) => {
          const filteredItems = sheet.items.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.formula.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (searchTerm && filteredItems.length === 0) return null;

          return (
            <div key={sIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                {sheet.subjectId === 'science' && <Atom className="w-4 h-4 text-emerald-600" />}
                {sheet.subjectId === 'math' && <Calculator className="w-4 h-4 text-blue-600" />}
                {sheet.subjectId === 'nepali' && <Feather className="w-4 h-4 text-rose-600" />}
                <span>{sheet.titleNp}</span>
              </div>

              <div className="space-y-2.5">
                {filteredItems.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isCopied = copiedIndex === key;

                  return (
                    <div
                      key={iIdx}
                      className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs relative group hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        <button
                          onClick={() => handleCopy(`${item.name}: ${item.formula}`, key)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title="प्रतिलिपि गर्नुहोस्"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50/60 p-1.5 rounded border border-emerald-100/80">
                        {item.formula}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
