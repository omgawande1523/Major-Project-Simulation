'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Zap, Sun, Moon } from 'lucide-react';
import { PresetQuery } from '../types/simulation';
import { SAMPLE_QUERIES } from '../data/sampleQueries';

interface QueryInputProps {
  currentQuery: string;
  onQueryChange: (q: string) => void;
  selectedPreset: PresetQuery;
  onSelectPreset: (preset: PresetQuery) => void;
  onFireQuery: () => void;
  onPauseToggle: () => void;
  onReplay: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  stepDelay: number;
  onStepDelayChange: (delay: number) => void;
  currentStepIndex: number;
  totalSteps: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  currentQuery,
  onQueryChange,
  selectedPreset,
  onSelectPreset,
  onFireQuery,
  onPauseToggle,
  onReplay,
  isRunning,
  isPaused,
  isComplete,
  stepDelay,
  onStepDelayChange,
  currentStepIndex,
  totalSteps,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div
      className={`w-full rounded-xl p-2.5 shadow-2xs space-y-2 shrink-0 border transition-colors ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Row: Presets & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Preset Selector Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className={`text-[10px] font-bold uppercase mr-1 shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Scenarios:
          </span>
          {SAMPLE_QUERIES.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                disabled={isRunning}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border ${
                  isSelected
                    ? isDarkMode
                      ? 'border-cyan-500 bg-cyan-950/80 text-cyan-200 shadow-2xs'
                      : 'border-blue-600 bg-blue-50 text-blue-900 shadow-2xs'
                    : isDarkMode
                    ? 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/60'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="mr-1.5">{preset.category.split(' ')[0]}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                    preset.routeType === 'SQL_ONLY'
                      ? 'bg-purple-900/60 text-purple-300'
                      : preset.routeType === 'RAG_ONLY'
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {preset.routeType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Speed Toggle + Dark Mode Switch + Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speed Selector */}
          <div className={`flex items-center gap-1 p-0.5 rounded-lg border text-[10px] ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => onStepDelayChange(2000)}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                stepDelay >= 1800
                  ? isDarkMode ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2000ms (Ultra Slow)
            </button>
            <button
              type="button"
              onClick={() => onStepDelayChange(1400)}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                stepDelay >= 1200 && stepDelay < 1800
                  ? isDarkMode ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1400ms (Slow)
            </button>
            <button
              type="button"
              onClick={() => onStepDelayChange(800)}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                stepDelay < 1200
                  ? isDarkMode ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              800ms (Normal)
            </button>
          </div>

          {/* Dark Mode Switch Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Status Badge */}
          <div className="text-[10px] font-bold">
            {isRunning ? (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                isPaused
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : isDarkMode
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400 animate-pulse' : isDarkMode ? 'bg-cyan-400 animate-ping' : 'bg-blue-600 animate-ping'}`} />
                {isPaused ? `PAUSED (Step ${currentStepIndex + 1}/${totalSteps})` : `Step ${currentStepIndex + 1}/${totalSteps}`}
              </span>
            ) : isComplete ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Resolved
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Input Box + Fire + Pause + Replay Buttons */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={currentQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Ask a question..."
            disabled={isRunning}
            className={`w-full h-9 px-3 text-xs border rounded-lg transition-all focus:outline-none disabled:opacity-60 ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-500/20'
            }`}
          />
        </div>

        {/* Fire Query Button */}
        <button
          type="button"
          onClick={onFireQuery}
          disabled={isRunning || !currentQuery.trim()}
          className={`h-9 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all disabled:opacity-50 active:scale-98 shrink-0 ${
            isDarkMode
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Zap className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Fire Query</span>
            </>
          )}
        </button>

        {/* Pause / Resume Button */}
        {isRunning && (
          <button
            type="button"
            onClick={onPauseToggle}
            className={`h-9 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 shrink-0 border ${
              isPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isPaused ? "Resume Simulation" : "Pause Simulation to explain step"}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>
        )}

        {(isComplete || isRunning) && (
          <button
            type="button"
            onClick={onReplay}
            disabled={isRunning}
            className={`h-9 px-2.5 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50 shrink-0 ${
              isDarkMode
                ? 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Replay Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        )}
      </div>
    </div>
  );
};
