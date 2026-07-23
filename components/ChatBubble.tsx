'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, ShieldCheck, FileText, Database } from 'lucide-react';
import { PresetQuery } from '../types/simulation';

interface ChatBubbleProps {
  query: string;
  finalAnswer: PresetQuery['finalAnswer'];
  isComplete: boolean;
  isDarkMode?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  query,
  finalAnswer,
  isComplete,
  isDarkMode = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isComplete) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Typing effect animation
    setIsTyping(true);
    let index = 0;
    const fullText = finalAnswer.text;
    const speed = 10;

    const timer = setInterval(() => {
      index += 4;
      if (index >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(timer);
      } else {
        setDisplayedText(fullText.slice(0, index));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isComplete, finalAnswer]);

  if (!isComplete && !displayedText) {
    return (
      <div className={`w-full h-full border rounded-xl p-4 shadow-2xs flex items-center justify-center text-xs ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-500'
          : 'bg-white border-slate-200 text-slate-400'
      }`}>
        Final Answer Output Will Appear Here
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full border rounded-xl p-3 shadow-2xs flex flex-col justify-between overflow-hidden ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-1.5 shrink-0 ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <h3 className="text-xs font-bold">Final System Output</h3>
        </div>

        <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
          isDarkMode
            ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
            : 'text-emerald-700 bg-emerald-50 border-emerald-200'
        }`}>
          <ShieldCheck className="w-3 h-3" />
          <span>{finalAnswer.stats.privacyStatus}</span>
        </div>
      </div>

      {/* Answer Body Scrollable */}
      <div className="my-1.5 overflow-y-auto pr-1 flex-1 space-y-2">
        {/* User Prompt Pill */}
        <div className="flex items-center justify-end gap-1.5">
          <div className={`rounded-lg px-2.5 py-1 text-[11px] font-medium truncate max-w-[85%] ${
            isDarkMode ? 'bg-cyan-600 text-slate-950 font-bold' : 'bg-blue-600 text-white'
          }`}>
            {query}
          </div>
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>

        {/* Answer Streaming Box */}
        <div className={`border rounded-lg p-2.5 text-[11px] leading-relaxed space-y-2 ${
          isDarkMode
            ? 'bg-slate-950 border-slate-800 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="whitespace-pre-wrap font-sans">
            {displayedText}
            {isTyping && (
              <span className={`inline-block w-1 h-3 ml-1 animate-pulse align-middle ${
                isDarkMode ? 'bg-cyan-400' : 'bg-blue-600'
              }`} />
            )}
          </div>

          {/* Sources Provenance */}
          {!isTyping && finalAnswer.sources && finalAnswer.sources.length > 0 && (
            <div className={`pt-1.5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200/80'}`}>
              <div className="flex flex-wrap gap-1">
                {finalAnswer.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {src.type === 'SQL Table' ? (
                      <Database className="w-2.5 h-2.5 text-purple-400" />
                    ) : (
                      <FileText className="w-2.5 h-2.5 text-amber-400" />
                    )}
                    <span>{src.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
