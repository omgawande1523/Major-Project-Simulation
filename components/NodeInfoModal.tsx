'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Layers, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { NodeInfoDetail } from '../data/nodeInfoData';

interface NodeInfoModalProps {
  nodeInfo: NodeInfoDetail | null;
  onClose: () => void;
  isDarkMode: boolean;
}

export const NodeInfoModal: React.FC<NodeInfoModalProps> = ({
  nodeInfo,
  onClose,
  isDarkMode,
}) => {
  if (!nodeInfo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-lg rounded-2xl p-5 shadow-2xl border z-10 space-y-4 max-h-[85vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-slate-900 text-slate-100 border-slate-800'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {/* Top Header */}
          <div className="flex items-start justify-between border-b pb-3 border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600'}`}>
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold tracking-tight">{nodeInfo.name}</h2>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                    isDarkMode
                      ? 'bg-blue-900/60 text-blue-300 border-blue-700'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {nodeInfo.badge}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {nodeInfo.roleSummary}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {nodeInfo.description}
          </p>

          {/* Tech Stack Pill */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
            isDarkMode
              ? 'bg-slate-950/80 border-slate-800 text-cyan-400'
              : 'bg-slate-50 border-slate-200 text-blue-700'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Technology Stack:</span>
            <span className="font-semibold">{nodeInfo.techStack}</span>
          </div>

          {/* Inputs & Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-blue-500" /> Data Input:
              </span>
              <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{nodeInfo.inputs}</p>
            </div>

            <div className={`p-2.5 rounded-xl border space-y-1 ${
              isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Output Payload:
              </span>
              <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{nodeInfo.outputs}</p>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Responsibilities:</h4>
            <ul className="space-y-1 text-xs">
              {nodeInfo.keyResponsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
