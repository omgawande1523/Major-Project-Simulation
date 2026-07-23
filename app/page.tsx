'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SAMPLE_QUERIES } from '../data/sampleQueries';
import { NODE_INFO_DATA, NodeInfoDetail } from '../data/nodeInfoData';
import { PresetQuery, NodeId, StepDetail, TransitionPath } from '../types/simulation';
import { FlowNode } from '../components/FlowNode';
import { QueryInput } from '../components/QueryInput';
import { ChatBubble } from '../components/ChatBubble';
import { LiveReasoningPanel } from '../components/LiveReasoningPanel';
import { ConnectionLines } from '../components/ConnectionLines';
import { NodeInfoModal } from '../components/NodeInfoModal';
import { ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';

export default function SimulationPage() {
  const [selectedPreset, setSelectedPreset] = useState<PresetQuery>(SAMPLE_QUERIES[0]);
  const [queryText, setQueryText] = useState(SAMPLE_QUERIES[0].question);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [stepDelay, setStepDelay] = useState<number>(2000); // 2000ms presentation speed

  // Dark Mode State (default: true for dark presentation theme)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Info Modal State
  const [activeInfoModal, setActiveInfoModal] = useState<NodeInfoDetail | null>(null);

  // Visited node tracking
  const [visitedNodes, setVisitedNodes] = useState<Set<NodeId>>(new Set());

  // Connection animation tracking (supports parallel multi-paths!)
  const [activeTransitions, setActiveTransitions] = useState<TransitionPath[]>([]);
  const [isPacketAnimating, setIsPacketAnimating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Preset Switching
  const handleSelectPreset = (preset: PresetQuery) => {
    if (isRunning) return;
    setSelectedPreset(preset);
    setQueryText(preset.question);
    resetSimulation();
  };

  // Reset Simulation
  const resetSimulation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentStepIndex(-1);
    setVisitedNodes(new Set());
    setActiveTransitions([]);
    setIsPacketAnimating(false);
  };

  // Start/Fire Simulation
  const handleFireQuery = () => {
    if (isRunning || !queryText.trim()) return;
    resetSimulation();
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
  };

  // Toggle Pause / Resume
  const handlePauseToggle = () => {
    if (!isRunning || isComplete) return;
    setIsPaused((prev) => !prev);
  };

  // Step Execution Loop
  useEffect(() => {
    if (!isRunning || currentStepIndex < 0 || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const steps = selectedPreset.steps;
    if (currentStepIndex >= steps.length) {
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(true);
      setActiveTransitions([]);
      setIsPacketAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIndex];
    
    // Mark active node(s) as visited
    const activeNodes = currentStep.activeNodeIds || [currentStep.nodeId];
    setVisitedNodes((prev) => {
      const nextSet = new Set(prev);
      activeNodes.forEach((n) => nextSet.add(n));
      return nextSet;
    });

    // Set active transition path(s) for SVG lines and continuous traveling data bubbles
    if (currentStep.activeTransitions && currentStep.activeTransitions.length > 0) {
      setActiveTransitions(currentStep.activeTransitions);
      setIsPacketAnimating(true);
    } else {
      setActiveTransitions([]);
      setIsPacketAnimating(false);
    }

    // Schedule next step with presentation delay
    timerRef.current = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, stepDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, isPaused, currentStepIndex, selectedPreset, stepDelay]);

  const activeStep: StepDetail | undefined =
    currentStepIndex >= 0 && currentStepIndex < selectedPreset.steps.length
      ? selectedPreset.steps[currentStepIndex]
      : undefined;

  const activeNodeIds = activeStep
    ? activeStep.activeNodeIds || [activeStep.nodeId]
    : [];

  const isNodeActive = (id: NodeId) => activeNodeIds.includes(id);

  // Compute unused nodes for single-path queries when trajectory is running/complete
  const unusedNodeIds: NodeId[] = (() => {
    if (currentStepIndex < 0) return [];
    if (selectedPreset.routeType === 'SQL_ONLY') {
      return ['rag-agent', 'vector-store', 'sync-worker'];
    }
    if (selectedPreset.routeType === 'RAG_ONLY') {
      return ['sql-agent', 'sql-layer', 'college-db'];
    }
    return [];
  })();

  const isNodeUnused = (id: NodeId) => unusedNodeIds.includes(id);

  const isParallelActive = selectedPreset.routeType === 'HYBRID' && activeStep?.isParallel;

  return (
    <main
      className={`h-screen max-h-screen w-screen overflow-hidden p-3 flex flex-col gap-2 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 bg-grid-pattern-dark'
          : 'bg-slate-50 text-slate-900 bg-grid-pattern'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`rounded-xl px-3 py-2 flex items-center justify-between shrink-0 shadow-2xs border transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded">
            DEMO
          </span>
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
            How the AI Agent Answers a Query
          </h1>
          <span className="text-[11px] text-slate-500 hidden md:inline">|</span>
          <p className={`text-[11px] hidden md:inline ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Interactive offline agentic RAG and Text-to-SQL architecture
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${
            isDarkMode
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            100% Offline
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border hidden sm:inline-flex ${
            isDarkMode
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            <Cpu className="w-3 h-3 text-cyan-400" />
            Local LLM
          </span>
        </div>
      </header>

      {/* Query Controller */}
      <QueryInput
        currentQuery={queryText}
        onQueryChange={setQueryText}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        onFireQuery={handleFireQuery}
        onPauseToggle={handlePauseToggle}
        onReplay={resetSimulation}
        isRunning={isRunning}
        isPaused={isPaused}
        isComplete={isComplete}
        stepDelay={stepDelay}
        onStepDelayChange={setStepDelay}
        currentStepIndex={currentStepIndex}
        totalSteps={selectedPreset.steps.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Single-Frame Dashboard Content */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3">
        {/* Left Side: Topology Diagram (62% width) */}
        <section
          className={`flex-1 md:w-[62%] rounded-xl p-3 shadow-2xs relative flex flex-col justify-between overflow-hidden border transition-colors ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-1.5 shrink-0 ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                System Workflow Topology
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Parallel Execution Header Indicator (Clean & Zero Overlap!) */}
              {isParallelActive && (
                <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  Running SQL & RAG Agents in Parallel
                </span>
              )}
              
              <span className={`text-[10px] flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${isDarkMode ? 'bg-cyan-400' : 'bg-blue-600'}`} /> Active Trajectory
              </span>
            </div>
          </div>

          {/* Topology Canvas */}
          <div id="diagram-container" className="relative flex-1 flex flex-col justify-between py-3">
            {/* SVG Directional Lines & Parallel Traveling Data Bubbles Overlay */}
            <ConnectionLines
              activeTransitions={activeTransitions}
              isAnimating={isPacketAnimating}
              isDarkMode={isDarkMode}
            />

            {/* TIER 1: Storage & Ingestion */}
            <div className="flex items-center justify-between gap-1 z-10">
              <FlowNode
                id="college-db"
                title="1. College DB"
                subtitle="MySQL DB"
                badge="STORE"
                isActive={isNodeActive('college-db')}
                isVisited={visitedNodes.has('college-db')}
                isUnusedInTrajectory={isNodeUnused('college-db')}
                caption={isNodeActive('college-db') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['college-db'])}
                isDarkMode={isDarkMode}
              />
              <FlowNode
                id="sync-worker"
                title="2. Sync Worker"
                subtitle="ETL & Embeddings"
                badge="SYNC"
                isActive={isNodeActive('sync-worker')}
                isVisited={visitedNodes.has('sync-worker')}
                isUnusedInTrajectory={isNodeUnused('sync-worker')}
                caption={isNodeActive('sync-worker') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['sync-worker'])}
                isDarkMode={isDarkMode}
              />
              <FlowNode
                id="vector-store"
                title="3. Vector Store"
                subtitle="ChromaDB / FAISS"
                badge="VECTOR DB"
                isActive={isNodeActive('vector-store')}
                isVisited={visitedNodes.has('vector-store')}
                isUnusedInTrajectory={isNodeUnused('vector-store')}
                caption={isNodeActive('vector-store') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['vector-store'])}
                isDarkMode={isDarkMode}
              />
              <FlowNode
                id="sql-layer"
                title="4. SQL Layer"
                subtitle="Schema Validator"
                badge="SECURITY"
                isActive={isNodeActive('sql-layer')}
                isVisited={visitedNodes.has('sql-layer')}
                isUnusedInTrajectory={isNodeUnused('sql-layer')}
                caption={isNodeActive('sql-layer') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['sql-layer'])}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* TIER 2: Router Agent Entrypoint (Clean Node Card Only - Zero Overlapping Pills!) */}
            <div className="relative flex justify-center z-20 my-1">
              <FlowNode
                id="router-agent"
                title="5. Router Agent"
                subtitle="Intent Classifier"
                badge="ROUTER"
                isActive={isNodeActive('router-agent')}
                isVisited={visitedNodes.has('router-agent')}
                caption={isNodeActive('router-agent') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['router-agent'])}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* TIER 3: Specialized Branch Agents (Parallel Side-by-Side) */}
            <div className="flex items-center justify-around z-10">
              <FlowNode
                id="sql-agent"
                title="6a. SQL Agent"
                subtitle="Structured Specialist"
                badge="SQL AGENT"
                isActive={isNodeActive('sql-agent')}
                isVisited={visitedNodes.has('sql-agent')}
                isUnusedInTrajectory={isNodeUnused('sql-agent')}
                caption={isNodeActive('sql-agent') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['sql-agent'])}
                isDarkMode={isDarkMode}
              />
              <FlowNode
                id="rag-agent"
                title="6b. RAG Agent"
                subtitle="Semantic Specialist"
                badge="RAG AGENT"
                isActive={isNodeActive('rag-agent')}
                isVisited={visitedNodes.has('rag-agent')}
                isUnusedInTrajectory={isNodeUnused('rag-agent')}
                caption={isNodeActive('rag-agent') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['rag-agent'])}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* TIER 4: Local Engine & Synthesis (with Synthesis Waiting State!) */}
            <div className="flex items-center justify-around z-10">
              <FlowNode
                id="local-llm"
                title="8. Local LLM"
                subtitle="Quantized Llama-3"
                badge="LLM ENGINE"
                isActive={isNodeActive('local-llm')}
                isVisited={visitedNodes.has('local-llm')}
                caption={isNodeActive('local-llm') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['local-llm'])}
                isDarkMode={isDarkMode}
              />
              <FlowNode
                id="synthesis-agent"
                title="7. Synthesis Agent"
                subtitle="Response Fusion"
                badge="FUSION"
                isActive={isNodeActive('synthesis-agent')}
                isVisited={visitedNodes.has('synthesis-agent')}
                isWaiting={isNodeActive('synthesis-agent') && activeStep?.isWaiting}
                caption={isNodeActive('synthesis-agent') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['synthesis-agent'])}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* TIER 5: Verification Agent */}
            <div className="flex justify-center z-10">
              <FlowNode
                id="verification-agent"
                title="9. Verification Agent"
                subtitle="Fact-Check Layer"
                badge="VERIFY"
                isActive={isNodeActive('verification-agent')}
                isVisited={visitedNodes.has('verification-agent')}
                isVerificationCorrection={isNodeActive('verification-agent') && !!activeStep?.isVerificationCorrection}
                caption={isNodeActive('verification-agent') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['verification-agent'])}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* TIER 6: Output Channel */}
            <div className="flex justify-center z-10">
              <FlowNode
                id="chat-ui"
                title="10. Chat UI"
                subtitle="Output Interface"
                badge="OUTPUT"
                isActive={isNodeActive('chat-ui')}
                isVisited={visitedNodes.has('chat-ui')}
                caption={isNodeActive('chat-ui') ? activeStep?.caption : undefined}
                onInfoClick={() => setActiveInfoModal(NODE_INFO_DATA['chat-ui'])}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Right Side: Technical Inspection & Output Split (38% width) */}
        <section className="md:w-[38%] flex flex-col gap-2 shrink-0 min-h-0">
          {/* Top Half: Real-time Inspection Log (Accumulated Scrollable List!) */}
          <div className="h-[48%] min-h-0">
            <LiveReasoningPanel
              allSteps={selectedPreset.steps}
              currentStepIndex={currentStepIndex}
              isComplete={isComplete}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Bottom Half: Chat Bubble Answer Output */}
          <div className="h-[52%] min-h-0">
            <ChatBubble
              query={queryText}
              finalAnswer={selectedPreset.finalAnswer}
              isComplete={isComplete}
              isDarkMode={isDarkMode}
            />
          </div>
        </section>
      </div>

      {/* Node Role Info Modal Popover */}
      <NodeInfoModal
        nodeInfo={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
        isDarkMode={isDarkMode}
      />
    </main>
  );
}
