export type NodeId = 
  | 'college-db'
  | 'sync-worker'
  | 'vector-store'
  | 'sql-layer'
  | 'router-agent'
  | 'sql-agent'
  | 'rag-agent'
  | 'synthesis-agent'
  | 'verification-agent'
  | 'local-llm'
  | 'chat-ui';

export type RouteType = 'SQL_ONLY' | 'RAG_ONLY' | 'HYBRID';

export interface TransitionPath {
  from: NodeId;
  to: NodeId;
}

export interface StepDetail {
  nodeId: NodeId;
  activeNodeIds?: NodeId[];
  activeTransitions?: TransitionPath[];
  title: string;
  caption: string;
  routerCaption?: string; // Floating caption near router node for parallel execution
  badge?: string;
  isParallel?: boolean;
  isWaiting?: boolean; // Synthesis waiting state
  isVerificationCorrection?: boolean; // Verification agent found an issue and is correcting
  logs?: string[];
  payloadSummary?: {
    type: 'sql' | 'rag' | 'router' | 'llm' | 'synthesis' | 'sync' | 'verification';
    codeSnippet?: string;
    metrics?: Array<{ label: string; value: string }>;
    retrievedDocs?: Array<{ title: string; score: string; text: string }>;
  };
}

export interface PresetQuery {
  id: string;
  question: string;
  category: string;
  routeType: RouteType;
  description: string;
  steps: StepDetail[];
  finalAnswer: {
    text: string;
    sources: Array<{ title: string; type: 'SQL Table' | 'Vector DB' }>;
    stats: {
      totalTime: string;
      privacyStatus: string;
      modelUsed: string;
    };
  };
}
