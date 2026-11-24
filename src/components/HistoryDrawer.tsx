import React from 'react';
import { SavedHistoryItem } from '../types';
import { Bookmark, Trash2, ExternalLink, Calendar, BookOpen } from 'lucide-react';

interface HistoryDrawerProps {
  savedItems: SavedHistoryItem[];
  onSelectSavedItem: (item: SavedHistoryItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  savedItems,
  onSelectSavedItem,
  onRemoveItem,
  onClearAll,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-emerald-600" />
            मेरो अध्ययन नोटबुक (My Saved Questions)
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            तपाईंले सुरक्षित गर्नुभएका मुख्य प्रश्नहरू र उत्तरहरू
          </p>
        </div>

        {savedItems.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>सबै हटाउनुहोस्</span>
          </button>
        )}
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">अहिलेसम्म कुनै प्रश्न सुरक्षित गरिएको छैन।</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            तपाईंले खोज्नुभएको प्रश्नको उत्तर आउँदा "नोटमा राख्नुस्" बटन थिचेर यहाँ पछि दोहोर्‍याउनका लागि राख्न सक्नुहुन्छ।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-xs font-bold">
                    कक्षा {item.grade} • {item.subject}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Question photo"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                      "{item.question}"
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                      {item.response.simpleAnswer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
                <button
                  onClick={() => onSelectSavedItem(item)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>पुरा उत्तर हेर्नुहोस्</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="हटाउनुहोस्"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
