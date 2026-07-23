'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  RefreshCw, 
  Search, 
  Code2, 
  Compass, 
  Bot, 
  Cpu, 
  Sparkles, 
  MessageSquare,
  CheckCircle2,
  Info,
  Clock,
  ShieldCheck as ShieldCheckIcon,
  AlertTriangle
} from 'lucide-react';
import { NodeId } from '../types/simulation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface FlowNodeProps {
  id: NodeId;
  title: string;
  subtitle: string;
  badge?: string;
  isActive: boolean;
  isVisited: boolean;
  isWaiting?: boolean;
  isVerificationCorrection?: boolean; // Verification agent found a claim to correct
  isUnusedInTrajectory?: boolean; // For SQL-only or RAG-only queries to keep unused path fully dimmed
  caption?: string;
  onInfoClick?: (e: React.MouseEvent) => void;
  isDarkMode?: boolean;
}

const ICON_MAP: Record<NodeId, React.ReactNode> = {
  'college-db': <Database className="w-3.5 h-3.5" />,
  'sync-worker': <RefreshCw className="w-3.5 h-3.5" />,
  'vector-store': <Search className="w-3.5 h-3.5" />,
  'sql-layer': <Code2 className="w-3.5 h-3.5" />,
  'router-agent': <Compass className="w-3.5 h-3.5" />,
  'sql-agent': <Bot className="w-3.5 h-3.5" />,
  'rag-agent': <Bot className="w-3.5 h-3.5" />,
  'local-llm': <Cpu className="w-3.5 h-3.5" />,
  'synthesis-agent': <Sparkles className="w-3.5 h-3.5" />,
  'verification-agent': <ShieldCheckIcon className="w-3.5 h-3.5" />,
  'chat-ui': <MessageSquare className="w-3.5 h-3.5" />,
};

export const FlowNode: React.FC<FlowNodeProps> = ({
  id,
  title,
  subtitle,
  badge,
  isActive,
  isVisited,
  isWaiting = false,
  isVerificationCorrection = false,
  isUnusedInTrajectory = false,
  caption,
  onInfoClick,
  isDarkMode = false,
}) => {
  const icon = ICON_MAP[id];

  return (
    <motion.div
      id={`node-${id}`}
      animate={{
        scale: isActive
          ? isVerificationCorrection
            ? [1.06, 1.12, 1.06]
            : id === 'verification-agent'
            ? [1.06, 1.1, 1.06]
            : 1.06
          : isWaiting ? 1.03 : 1,
        y: isActive ? -3 : 0,
      }}
      transition={{
        duration: isActive && id === 'verification-agent' ? 0.6 : 0.25,
        ease: 'easeOut',
        scale: isActive && id === 'verification-agent'
          ? { duration: 0.6, repeat: isVerificationCorrection ? 2 : 1, ease: 'easeInOut' }
          : undefined,
      }}
      className={cn(
        'relative rounded-xl border p-2.5 transition-all duration-300 select-none w-[155px] sm:w-[170px] shrink-0 z-10',
        isUnusedInTrajectory
          ? isDarkMode
            ? 'border-slate-800/40 bg-slate-950/30 text-slate-600 opacity-35 grayscale'
            : 'border-slate-200/50 bg-slate-100/40 text-slate-400 opacity-40 grayscale'
          : isDarkMode
          ? isActive
            ? id === 'verification-agent'
              ? isVerificationCorrection
                ? 'border-amber-400 bg-amber-950/40 text-amber-100 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/30'
                : 'border-emerald-400 bg-emerald-950/40 text-emerald-100 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/30'
              : 'border-cyan-400 bg-slate-900/90 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
            : isWaiting
            ? 'border-amber-400 bg-amber-950/30 text-amber-200 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/10'
            : isVisited
            ? 'border-slate-700 bg-slate-900/70 text-slate-200 shadow-2xs'
            : 'border-slate-800 bg-slate-950/80 text-slate-400 opacity-85 hover:border-slate-700'
          : isActive
          ? id === 'verification-agent'
            ? isVerificationCorrection
              ? 'border-amber-500 bg-amber-50/40 text-amber-900 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/10'
              : 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-400/40 shadow-md shadow-emerald-500/10'
            : 'border-blue-600 bg-blue-50/20 text-slate-900 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10'
          : isWaiting
          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/10'
          : isVisited
          ? 'border-slate-300 bg-slate-50/60 text-slate-800 shadow-2xs'
          : 'border-slate-200 bg-white text-slate-900 opacity-90 hover:border-slate-300'
      )}
    >
      {/* Header: Icon + Badge + Info Button */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'p-1 rounded-md transition-colors',
              isUnusedInTrajectory
                ? 'bg-slate-800/40 text-slate-600'
                : isDarkMode
                ? isActive
                  ? id === 'verification-agent'
                    ? isVerificationCorrection
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-cyan-500 text-slate-950 font-bold'
                  : isWaiting
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : isVisited
                  ? 'bg-slate-800 text-cyan-400'
                  : 'bg-slate-850 text-slate-500'
                : isActive
                ? id === 'verification-agent'
                  ? isVerificationCorrection
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                  : 'bg-blue-600 text-white'
                : isWaiting
                ? 'bg-amber-500 text-white'
                : isVisited
                ? 'bg-slate-200 text-slate-700'
                : 'bg-slate-100 text-slate-500'
            )}
          >
            {icon}
          </div>

          {badge && (
            <span
              className={cn(
                'text-[8px] font-bold tracking-wider uppercase px-1 py-0.2 rounded border',
                isUnusedInTrajectory
                  ? 'bg-slate-900/40 text-slate-600 border-slate-800/40'
                  : isDarkMode
                  ? isActive
                    ? id === 'verification-agent'
                      ? isVerificationCorrection
                        ? 'bg-amber-950 text-amber-300 border-amber-700 font-extrabold'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700 font-extrabold'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-700 font-extrabold'
                    : isWaiting
                    ? 'bg-amber-950 text-amber-300 border-amber-700 font-extrabold'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                  : isActive
                  ? id === 'verification-agent'
                    ? isVerificationCorrection
                      ? 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold'
                    : 'bg-blue-100 text-blue-800 border-blue-300 font-extrabold'
                  : isWaiting
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              )}
            >
              {isWaiting ? 'WAITING FOR STREAMS' : id === 'verification-agent' && isActive ? (isVerificationCorrection ? '⚠ CORRECTING' : '✓ VERIFIED') : badge}
            </span>
          )}
        </div>

        {/* Info Button */}
        {onInfoClick && (
          <button
            type="button"
            onClick={onInfoClick}
            className={cn(
              'p-1 rounded-md transition-colors hover:scale-110 active:scale-95',
              isDarkMode
                ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
            )}
            title={`View role details for ${title}`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-1">
          <h3
            className={cn(
              'text-xs font-bold tracking-tight truncate',
              isUnusedInTrajectory
                ? 'text-slate-600 line-through decoration-slate-600/40'
                : isActive
                ? isDarkMode
                  ? id === 'verification-agent'
                    ? isVerificationCorrection
                      ? 'text-amber-200 font-extrabold'
                      : 'text-emerald-200 font-extrabold'
                    : 'text-cyan-200 font-extrabold'
                  : id === 'verification-agent'
                  ? isVerificationCorrection
                    ? 'text-amber-900 font-extrabold'
                    : 'text-emerald-900 font-extrabold'
                  : 'text-blue-950 font-extrabold'
                : isWaiting
                ? 'text-amber-300 font-bold'
                : isDarkMode
                ? 'text-slate-200'
                : 'text-slate-900'
            )}
          >
            {title}
          </h3>
          {isVisited && !isActive && !isUnusedInTrajectory && (
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          )}
          {isWaiting && (
            <Clock className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
          )}
        </div>
        <p className={cn('text-[10px] truncate mt-0.5', isUnusedInTrajectory ? 'text-slate-600' : isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
          {subtitle}
        </p>
      </div>

      {/* Active Caption Callout Box */}
      {isActive && caption && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'mt-2 p-1.5 rounded text-[10px] leading-tight shadow-xs font-medium border',
            id === 'verification-agent'
              ? isVerificationCorrection
                ? isDarkMode
                  ? 'bg-amber-950 text-amber-200 border-amber-700'
                  : 'bg-amber-500 text-white border-amber-600'
                : isDarkMode
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
                : 'bg-emerald-600 text-white border-emerald-700'
              : isDarkMode
              ? 'bg-cyan-950 text-cyan-200 border-cyan-700'
              : 'bg-blue-600 text-white border-blue-700'
          )}
        >
          <div className="flex items-start gap-1">
            {id === 'verification-agent' ? (
              isVerificationCorrection ? (
                <AlertTriangle className="w-3 h-3 text-amber-300 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0 mt-0.5" />
              )
            ) : (
              <span
                className={cn(
                  'inline-block w-1.5 h-1.5 rounded-full animate-ping mt-0.5 shrink-0',
                  isDarkMode ? 'bg-cyan-400' : 'bg-white'
                )}
              />
            )}
            <span className="line-clamp-2">{caption}</span>
          </div>
        </motion.div>
      )}

      {/* Glowing Indicator Dot */}
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              id === 'verification-agent'
                ? isVerificationCorrection
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
                : isDarkMode ? 'bg-cyan-400' : 'bg-blue-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2.5 w-2.5',
              id === 'verification-agent'
                ? isVerificationCorrection
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
                : isDarkMode ? 'bg-cyan-400' : 'bg-blue-600'
            )}
          />
        </span>
      )}
    </motion.div>
  );
};
