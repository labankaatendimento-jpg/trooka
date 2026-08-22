'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { IphoneModel } from '@/lib/mockData';
import { dbService } from '@/services/dbService';

interface DeviceSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: IphoneModel) => void;
  excludeFutureModels?: boolean;
}

export default function DeviceSearchSheet({
  isOpen,
  onClose,
  onSelect,
  excludeFutureModels = true,
}: DeviceSearchSheetProps) {
  const [search, setSearch] = useState('');
  const [models, setModels] = useState<IphoneModel[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load models
    dbService.getIphoneModels().then(data => {
      if (excludeFutureModels) {
        // Exclude iPhone 17 models
        setModels(data.filter(m => !m.modelo.includes('iPhone 17')));
      } else {
        setModels(data);
      }
    });
  }, [excludeFutureModels]);

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredModels = models.filter(m => {
    const query = search.toLowerCase();
    return (
      m.modelo.toLowerCase().includes(query) ||
      m.armazenamento.toLowerCase().includes(query)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-neutral-950 border-t border-neutral-800 rounded-t-3xl z-50 flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-3 cursor-pointer" onClick={onClose}>
              <div className="w-10 h-1 bg-neutral-700 rounded-full" />
            </div>

            {/* Header / Search Input */}
            <div className="px-5 pb-4 border-b border-neutral-900 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Pesquisar iPhone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-neutral-900 text-neutral-100 pl-10 pr-10 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-[16px] md:text-sm transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-sm font-medium text-neutral-400 hover:text-white px-2 py-1 transition-colors"
              >
                Fechar
              </button>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 search-results-scroll min-h-[300px]">
              {filteredModels.length > 0 ? (
                <div className="space-y-1 py-2">
                  {filteredModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => onSelect(model)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-neutral-900 active:bg-neutral-900/80 text-left transition-all group"
                    >
                      <div>
                        <span className="text-neutral-200 group-hover:text-white font-medium text-[15px] transition-colors">
                          {model.modelo}
                        </span>
                        <span className="ml-2 text-xs text-neutral-500 bg-neutral-900 group-hover:bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-800 transition-colors">
                          {model.armazenamento}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4 text-purple-500" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-neutral-500 text-sm">Nenhum modelo encontrado.</p>
                  <p className="text-neutral-600 text-xs mt-1">Tente pesquisar algo diferente, ex: "iPhone 13"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
