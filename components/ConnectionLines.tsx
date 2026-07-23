'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NodeId, TransitionPath } from '../types/simulation';

interface ConnectionLinesProps {
  activeTransitions?: TransitionPath[];
  isAnimating: boolean;
  isDarkMode?: boolean;
}

const STATIC_CONNECTIONS: Array<[NodeId, NodeId]> = [
  ['college-db', 'sync-worker'],
  ['sync-worker', 'vector-store'],
  ['college-db', 'sql-layer'],
  ['router-agent', 'sql-agent'],
  ['router-agent', 'rag-agent'],
  ['sql-agent', 'sql-layer'],
  ['sql-layer', 'college-db'],
  ['college-db', 'local-llm'],
  ['rag-agent', 'vector-store'],
  ['vector-store', 'local-llm'],
  ['sql-agent', 'local-llm'],
  ['rag-agent', 'local-llm'],
  ['local-llm', 'synthesis-agent'],
  ['synthesis-agent', 'chat-ui'],
];

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  activeTransitions = [],
  isAnimating,
  isDarkMode = false,
}) => {
  const [activePathsD, setActivePathsD] = useState<string[]>([]);
  const [staticPaths, setStaticPaths] = useState<string[]>([]);

  useEffect(() => {
    const updateCoords = () => {
      const containerEl = document.getElementById('diagram-container');
      if (!containerEl) return;

      const containerRect = containerEl.getBoundingClientRect();

      // Compute static wire paths
      const paths: string[] = [];
      STATIC_CONNECTIONS.forEach(([fromId, toId]) => {
        const fromEl = document.getElementById(`node-${fromId}`);
        const toEl = document.getElementById(`node-${toId}`);
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
          const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
          const x2 = toRect.left + toRect.width / 2 - containerRect.left;
          const y2 = toRect.top + toRect.height / 2 - containerRect.top;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          paths.push(`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`);
        }
      });
      setStaticPaths(paths);

      // Compute active step transition paths (supports single or parallel multi-paths!)
      if (activeTransitions && activeTransitions.length > 0) {
        const activeDList: string[] = [];
        activeTransitions.forEach(({ from, to }) => {
          const fromEl = document.getElementById(`node-${from}`);
          const toEl = document.getElementById(`node-${to}`);
          if (fromEl && toEl) {
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
            const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
            const x2 = toRect.left + toRect.width / 2 - containerRect.left;
            const y2 = toRect.top + toRect.height / 2 - containerRect.top;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            activeDList.push(`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`);
          }
        });
        setActivePathsD(activeDList);
      } else {
        setActivePathsD([]);
      }
    };

    updateCoords();
    window.addEventListener('resize', updateCoords);
    return () => window.removeEventListener('resize', updateCoords);
  }, [activeTransitions]);

  const strokeColor = isDarkMode ? '#00f0ff' : '#2563eb';
  const staticWireColor = isDarkMode ? '#334155' : '#cbd5e1';

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      <defs>
        {/* Directional Arrowhead Markers */}
        <marker
          id="arrowhead-static"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={staticWireColor} />
        </marker>

        <marker
          id="arrowhead-active"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={strokeColor} />
        </marker>
      </defs>

      {/* Background Static Network Wires with Directional Arrow Markers */}
      {staticPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={staticWireColor}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd="url(#arrowhead-static)"
          opacity={isDarkMode ? 0.4 : 0.6}
        />
      ))}

      {/* Active Step Transition Paths (Parallel Support!) */}
      {activePathsD.map((pathD, pIdx) => (
        <g key={pIdx}>
          {/* Outer Glow Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#arrowhead-active)"
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Solid Core Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd="url(#arrowhead-active)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Multiple Data Packet Bubbles - LOOPS INFINITELY EVEN WHEN PAUSED! */}
          {isAnimating && (
            <>
              {/* Data Bubble 1 */}
              <motion.g
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                style={{ offsetPath: `path('${pathD}')` }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <circle
                  r="5"
                  fill={isDarkMode ? '#22d3ee' : '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </motion.g>

              {/* Data Bubble 2 (Mid Stream) */}
              <motion.g
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                style={{ offsetPath: `path('${pathD}')` }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <circle
                  r="4"
                  fill={strokeColor}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </motion.g>

              {/* Data Bubble 3 (Tail Stream) */}
              <motion.g
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                style={{ offsetPath: `path('${pathD}')` }}
                transition={{
                  duration: 1.5,
                  delay: 1.0,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <circle
                  r="3.5"
                  fill={strokeColor}
                  opacity="0.8"
                />
              </motion.g>
            </>
          )}
        </g>
      ))}
    </svg>
  );
};
