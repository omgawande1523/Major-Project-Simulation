'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StepDetail } from '../types/simulation';

interface LiveReasoningPanelProps {
  allSteps: StepDetail[];
  currentStepIndex: number;
  isComplete: boolean;
  isDarkMode?: boolean;
}

export const LiveReasoningPanel: React.FC<LiveReasoningPanelProps> = ({
  allSteps,
  currentStepIndex,
  isComplete,
  isDarkMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStepIndex]);

  if (currentStepIndex < 0 && !isComplete) {
    return (
      <div className={`w-full h-full rounded-xl p-3 border font-mono text-xs flex items-center justify-center gap-2 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-500 border-slate-800'
          : 'bg-slate-900 text-slate-400 border-slate-800'
      }`}>
        <AlertCircle className="w-4 h-4 shrink-0 text-cyan-400" />
        <span className="text-[11px] text-center">Click "Fire Query" above to start the agentic trajectory. All steps will accumulate here.</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full rounded-xl p-3 border flex flex-col justify-between font-mono shadow-md overflow-hidden text-[11px] ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 border-slate-800'
          : 'bg-slate-900 text-slate-100 border-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-200">
            Trajectory Inspection Log ({allSteps.length} Steps)
          </span>
        </div>
        <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 font-semibold uppercase shrink-0">
          {isComplete ? 'ALL STEPS RESOLVED' : `STEP ${Math.min(currentStepIndex + 1, allSteps.length)} OF ${allSteps.length}`}
        </span>
      </div>

      {/* Scrollable Accumulated Steps List */}
      <div ref={containerRef} className="my-1.5 overflow-y-auto pr-1 flex-1 space-y-2.5">
        {allSteps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isVisited = idx <= currentStepIndex || isComplete;
          const isPending = idx > currentStepIndex && !isComplete;
          const payload = step.payloadSummary;

          if (isPending) return null; // Only show revealed steps up to current execution

          return (
            <motion.div
              key={step.nodeId + idx}
              ref={isActive ? activeItemRef : undefined}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-2.5 rounded-lg border text-[10px] space-y-1.5 transition-all ${
                isActive
                  ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/70 border-slate-800 opacity-80'
              }`}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-cyan-400 font-mono">#{idx + 1}</span>
                  <span className="font-bold text-slate-200 font-sans text-[11px]">{step.title}</span>
                  {isVisited && !isActive && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  )}
                </div>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-semibold uppercase">
                  {step.badge}
                </span>
              </div>

              {/* Caption */}
              <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                {step.caption}
              </p>

              {/* Code Snippet */}
              {payload?.codeSnippet && (
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[9px] text-emerald-400 font-mono overflow-x-auto">
                  <pre>{payload.codeSnippet}</pre>
                </div>
              )}

              {/* Metrics */}
              {payload?.metrics && (
                <div className="grid grid-cols-2 gap-1 font-sans">
                  {payload.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-slate-900/80 p-1 rounded border border-slate-800">
                      <p className="text-[8px] text-slate-400 uppercase">{m.label}</p>
                      <p className="text-[10px] font-bold text-cyan-300 truncate">{m.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Vector Docs */}
              {payload?.retrievedDocs && (
                <div className="space-y-1 font-sans">
                  {payload.retrievedDocs.map((doc, dIdx) => (
                    <div key={dIdx} className="bg-slate-900 p-1 rounded border border-slate-800 text-[9px]">
                      <div className="flex items-center justify-between text-cyan-300 font-bold">
                        <span className="truncate">{doc.title}</span>
                        <span className="text-emerald-400 text-[8px] shrink-0 ml-1">{doc.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
