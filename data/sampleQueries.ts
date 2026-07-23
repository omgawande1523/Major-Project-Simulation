import { PresetQuery } from '../types/simulation';

export const SAMPLE_QUERIES: PresetQuery[] = [
  {
    id: 'query-sql',
    question: 'What is the fee structure for mechanical engineering?',
    category: 'SQL Agent Only (Structured Facts)',
    routeType: 'SQL_ONLY',
    description: 'Queries relational MySQL tables for annual tuition, lab charges, and intake seats step-by-step. RAG path stays fully idle.',
    steps: [
      {
        nodeId: 'router-agent',
        activeNodeIds: ['router-agent'],
        activeTransitions: [],
        title: 'Router Agent',
        badge: 'INTENT CLASSIFIER',
        caption: 'Router classifies intent as structured financial lookup. Routing to SQL Agent.',
        logs: [
          'Intent: Structured Financial Query',
          'Confidence: 98.6%',
          'Selected Route: SQL_ONLY'
        ],
        payloadSummary: {
          type: 'router',
          metrics: [
            { label: 'Query Intent', value: 'Structured DB Lookup' },
            { label: 'Decision Time', value: '10ms' },
            { label: 'Active Route', value: 'SQL Agent Only' }
          ]
        }
      },
      {
        nodeId: 'sql-agent',
        activeNodeIds: ['sql-agent'],
        activeTransitions: [{ from: 'router-agent', to: 'sql-agent' }],
        title: 'SQL Agent',
        badge: 'TEXT-TO-SQL',
        caption: 'SQL Agent receives intent and generates parameterized SELECT statement.',
        logs: [
          'Inspecting MySQL table: college_fees',
          'Constructing safe parameterized query...'
        ],
        payloadSummary: {
          type: 'sql',
          codeSnippet: `SELECT department_name, tuition_fee_per_year, lab_charge, total_intake\nFROM college_fees\nWHERE dept_code = 'ME'\n  AND academic_year = '2025-2026';`
        }
      },
      {
        nodeId: 'sql-layer',
        activeNodeIds: ['sql-layer'],
        activeTransitions: [{ from: 'sql-agent', to: 'sql-layer' }],
        title: 'SQL Query Layer',
        badge: 'SECURITY & VALIDATION',
        caption: 'Validates MySQL AST safety rules (no DROP/UPDATE) and approves read-only token.',
        logs: [
          'AST Verification: Clean Read-Only SELECT',
          'Preparing MySQL DB query execution...'
        ],
        payloadSummary: {
          type: 'sql',
          metrics: [
            { label: 'AST Validation', value: 'Clean Read-Only' },
            { label: 'Query Latency', value: '3.8ms' }
          ]
        }
      },
      {
        nodeId: 'college-db',
        activeNodeIds: ['college-db'],
        activeTransitions: [{ from: 'sql-layer', to: 'college-db' }],
        title: 'College DB (MySQL)',
        badge: 'MYSQL STORE',
        caption: 'Executes SELECT query against MySQL tables and returns structured fee rows.',
        logs: [
          'Matched: B.Tech Mechanical Engineering',
          'Tuition: ₹95,000/yr | Lab: ₹15,000/yr | Intake: 120'
        ],
        payloadSummary: {
          type: 'sql',
          metrics: [
            { label: 'Dept', value: 'B.Tech Mechanical' },
            { label: 'Tuition Fee', value: '₹95,000 / year' },
            { label: 'Lab & Utility', value: '₹15,000 / year' },
            { label: 'Total Annual', value: '₹1,10,000 / year' }
          ]
        }
      },
      {
        nodeId: 'local-llm',
        activeNodeIds: ['local-llm'],
        activeTransitions: [{ from: 'college-db', to: 'local-llm' }],
        title: 'Local LLM Engine',
        badge: 'OFFLINE MODEL ENGINE',
        caption: 'Local Quantized Llama-3 (8B) receives MySQL rows and formats into clear human text.',
        logs: [
          'Inference running locally (0 cloud egress)',
          'Context length: 390 tokens'
        ],
        payloadSummary: {
          type: 'llm',
          metrics: [
            { label: 'Model', value: 'Llama-3-8B-Instruct Q4_K_M' },
            { label: 'Network Access', value: '0 Network Calls (Offline)' }
          ]
        }
      },
      {
        nodeId: 'synthesis-agent',
        activeNodeIds: ['synthesis-agent'],
        activeTransitions: [{ from: 'local-llm', to: 'synthesis-agent' }],
        title: 'Synthesis Agent',
        badge: 'FUSION & GROUNDING',
        caption: 'Synthesis Agent verifies numerical consistency and attaches MySQL source provenance tag.',
        logs: [
          'Fact Grounding Check: 100% matched DB result',
          'Source tag: [MySQL: college_fees]'
        ],
        payloadSummary: {
          type: 'synthesis',
          metrics: [
            { label: 'Fact Verification', value: 'Passed (No Hallucinations)' },
            { label: 'Data Provenance', value: 'MySQL: college_fees' }
          ]
        }
      },
      {
        nodeId: 'verification-agent',
        activeNodeIds: ['verification-agent'],
        activeTransitions: [{ from: 'synthesis-agent', to: 'verification-agent' }],
        title: 'Verification Agent',
        badge: 'FACT-CHECK',
        caption: 'Checking the answer against the real database/documents before showing it',
        logs: [
          'Cross-referencing fee amounts with MySQL: college_fees rows...',
          'All 4 claims verified against source data ✓'
        ],
        payloadSummary: {
          type: 'verification',
          metrics: [
            { label: 'Claims Checked', value: '4 / 4 Verified' },
            { label: 'Source Match', value: '100% — No corrections needed' },
            { label: 'Confidence', value: 'High (all values exact-match DB)' }
          ]
        }
      },
      {
        nodeId: 'chat-ui',
        activeNodeIds: ['chat-ui'],
        activeTransitions: [{ from: 'verification-agent', to: 'chat-ui' }],
        title: 'Chat UI',
        badge: 'RESPONSE INTERFACE',
        caption: 'Delivers verified fee structure breakdown in clean natural text to user interface.',
        logs: ['Render complete']
      }
    ],
    finalAnswer: {
      text: `The annual fee structure for **B.Tech in Mechanical Engineering** for the 2025–2026 academic year is as follows:\n\n• **Tuition Fee:** ₹95,000 / year\n• **Lab & Utility Charges:** ₹15,000 / year\n• **Total Annual Fee:** ₹1,10,000 / year\n• **Approved Seat Intake:** 120 seats\n\n*Note: Payments can be made in two equal term installments via the campus student portal.*`,
      sources: [
        { title: 'MySQL Table: college_fees', type: 'SQL Table' }
      ],
      stats: {
        totalTime: '0.45s',
        privacyStatus: '100% Offline (Local execution)',
        modelUsed: 'Llama-3-8B-Instruct (SQL Path Only)'
      }
    }
  },
  {
    id: 'query-rag',
    question: "What is the college's attendance policy?",
    category: 'RAG Agent Only (Unstructured Documents)',
    routeType: 'RAG_ONLY',
    description: 'Searches vector database embeddings across official college handbook PDFs step-by-step. SQL path stays fully idle.',
    steps: [
      {
        nodeId: 'sync-worker',
        activeNodeIds: ['sync-worker', 'vector-store'],
        activeTransitions: [
          { from: 'college-db', to: 'sync-worker' },
          { from: 'sync-worker', to: 'vector-store' }
        ],
        title: 'Sync Worker (ETL Background Sync)',
        badge: 'BACKGROUND SYNC',
        caption: 'Sync Worker ingests college policy PDFs and syncs vector embeddings into Vector Store.',
        logs: [
          'Syncing document: Academic_Regulations_2025.pdf',
          'Chunking & generating bge-small-en-v1.5 embeddings...'
        ],
        payloadSummary: {
          type: 'sync',
          metrics: [
            { label: 'Indexed File', value: 'Academic_Regulations_2025.pdf' },
            { label: 'Embedding Vector Size', value: '384 dim' }
          ]
        }
      },
      {
        nodeId: 'router-agent',
        activeNodeIds: ['router-agent'],
        activeTransitions: [],
        title: 'Router Agent',
        badge: 'INTENT CLASSIFIER',
        caption: "Router classifies intent as unstructured policy handbook search. Routing to RAG Agent.",
        logs: [
          'Intent: Unstructured Policy Document Query',
          'Confidence: 97.4%',
          'Selected Route: RAG_ONLY'
        ],
        payloadSummary: {
          type: 'router',
          metrics: [
            { label: 'Query Intent', value: 'Policy Handbook Search' },
            { label: 'Active Route', value: 'RAG Agent Only' }
          ]
        }
      },
      {
        nodeId: 'rag-agent',
        activeNodeIds: ['rag-agent'],
        activeTransitions: [{ from: 'router-agent', to: 'rag-agent' }],
        title: 'RAG Agent',
        badge: 'SEMANTIC RETRIEVER',
        caption: 'RAG Agent generates query vector embedding and prepares similarity search request.',
        logs: [
          'Generating query vector embedding via bge-small-en-v1.5...',
          'Target Collection: academic_rules_2025'
        ],
        payloadSummary: {
          type: 'rag',
          metrics: [
            { label: 'Embedding Model', value: 'bge-small-en-v1.5' },
            { label: 'Top-K Param', value: 'K = 3' }
          ]
        }
      },
      {
        nodeId: 'vector-store',
        activeNodeIds: ['vector-store'],
        activeTransitions: [{ from: 'rag-agent', to: 'vector-store' }],
        title: 'Vector Store',
        badge: 'CHROMA DB / FAISS',
        caption: 'Vector Store executes HNSW cosine search across indexed PDF academic handbook chunks.',
        logs: [
          'Searching 12,400 indexed vector chunks...',
          'Chunk #108 score: 0.912 (Minimum Attendance Criterion)'
        ],
        payloadSummary: {
          type: 'rag',
          retrievedDocs: [
            {
              title: 'Academic_Regulations_2025.pdf (Page 8, Sec 3.1)',
              score: '0.912 Similarity',
              text: 'A minimum of 75% attendance in theory and practical classes is compulsory to appear for end-semester examinations.'
            },
            {
              title: 'Academic_Regulations_2025.pdf (Page 9, Sec 3.4)',
              score: '0.865 Similarity',
              text: 'Condonation up to 10% (65% to 74%) may be granted on medical grounds or authorized sports participation.'
            }
          ]
        }
      },
      {
        nodeId: 'local-llm',
        activeNodeIds: ['local-llm'],
        activeTransitions: [{ from: 'vector-store', to: 'local-llm' }],
        title: 'Local LLM Engine',
        badge: 'OFFLINE MODEL ENGINE',
        caption: 'Vector Store streams top PDF context chunks directly into Local LLM Engine.',
        logs: [
          'Injecting 2 document context chunks into prompt...',
          'Generating concise policy summary...'
        ],
        payloadSummary: {
          type: 'llm',
          metrics: [
            { label: 'Retrieved Context', value: '780 tokens' },
            { label: 'Local Latency', value: '142ms' }
          ]
        }
      },
      {
        nodeId: 'synthesis-agent',
        activeNodeIds: ['synthesis-agent'],
        activeTransitions: [{ from: 'local-llm', to: 'synthesis-agent' }],
        title: 'Synthesis Agent',
        badge: 'FUSION & GROUNDING',
        caption: 'Local LLM passes summary to Synthesis Agent to verify citation page numbers.',
        logs: [
          'Cross-referencing citations with PDF chunk IDs...',
          'Output ready'
        ]
      },
      {
        nodeId: 'verification-agent',
        activeNodeIds: ['verification-agent'],
        activeTransitions: [{ from: 'synthesis-agent', to: 'verification-agent' }],
        title: 'Verification Agent',
        badge: 'FACT-CHECK',
        isVerificationCorrection: true,
        caption: 'Found a claim not in the source data — correcting it',
        logs: [
          'Cross-referencing policy claims with PDF chunk evidence...',
          '⚠ Claim "below 65% students must repeat the course during summer term" — NOT found in retrieved chunks!',
          'Correction: Replacing unsupported consequence with verified text from Section 3.5'
        ],
        payloadSummary: {
          type: 'verification',
          metrics: [
            { label: 'Claims Checked', value: '3 / 3' },
            { label: 'Issues Found', value: '1 unsupported claim detected' },
            { label: 'Action Taken', value: 'Auto-corrected from Section 3.5' },
            { label: 'Confidence', value: 'High (after correction)' }
          ]
        }
      },
      {
        nodeId: 'chat-ui',
        activeNodeIds: ['chat-ui'],
        activeTransitions: [{ from: 'verification-agent', to: 'chat-ui' }],
        title: 'Chat UI',
        badge: 'RESPONSE INTERFACE',
        caption: "Displays verified and corrected attendance policy guidelines in Chat UI.",
        logs: ['Render complete (1 claim corrected by Verification Agent)']
      }
    ],
    finalAnswer: {
      text: `Based on the official **Academic Regulations Handbook (2025–2026)**:\n\n• **Minimum Attendance Rule:** Students must maintain a minimum of **75% attendance** in theory and practical classes to be eligible for end-semester exams.\n• **Medical Condonation:** Condonation of up to **10%** (allowing 65%–74%) may be granted by the Dean on valid medical grounds or official sports representation.\n• **Shortage Consequences:** Students with attendance below **65%** are detained and must repeat the course during the summer term.\n\n*Reference: Academic_Regulations_2025.pdf (Section 3.1 & Section 3.4)*`,
      sources: [
        { title: 'Academic_Regulations_2025.pdf (Page 8)', type: 'Vector DB' }
      ],
      stats: {
        totalTime: '0.58s',
        privacyStatus: '100% Offline (Zero cloud egress)',
        modelUsed: 'Llama-3-8B-Instruct (RAG Path Only)'
      }
    }
  },
  {
    id: 'query-hybrid',
    question: 'Compare my attendance percentage against the minimum required policy',
    category: 'Hybrid Parallel (SQL + RAG Dual-Path)',
    routeType: 'HYBRID',
    description: 'Runs step-by-step parallel execution: SQL Agent queries student DB while RAG Agent searches policy PDF.',
    steps: [
      {
        nodeId: 'router-agent',
        activeNodeIds: ['router-agent'],
        activeTransitions: [],
        title: 'Router Agent',
        badge: 'INTENT CLASSIFIER',
        caption: 'Router detects dual requirement: Personal student MySQL DB records + Policy Handbook PDF. Preparing parallel dispatch.',
        logs: [
          'Dual Intent Detected: Structured Student Record + Unstructured Policy Document',
          'Preparing PARALLEL DISPATCH to SQL Agent and RAG Agent'
        ],
        payloadSummary: {
          type: 'router',
          metrics: [
            { label: 'Query Intent', value: 'Comparative Multi-Domain' },
            { label: 'SQL Branch', value: 'Active (Student Attendance DB)' },
            { label: 'RAG Branch', value: 'Active (Policy Handbook PDF)' }
          ]
        }
      },
      // STEP 2: Parallel Dispatch to Branch Agents
      {
        nodeId: 'sql-agent',
        activeNodeIds: ['sql-agent', 'rag-agent'],
        activeTransitions: [
          { from: 'router-agent', to: 'sql-agent' },
          { from: 'router-agent', to: 'rag-agent' }
        ],
        title: 'SQL Agent & RAG Agent (Parallel Dispatch)',
        badge: 'PARALLEL DISPATCH',
        isParallel: true,
        caption: '⚡ PARALLEL DISPATCH: Router sends request to SQL Agent and RAG Agent simultaneously.',
        logs: [
          '[Parallel Thread A] SQL Agent inspecting student_attendance table for Roll #2024-CS-042',
          '[Parallel Thread B] RAG Agent generating vector embedding for policy threshold search'
        ],
        payloadSummary: {
          type: 'sql',
          codeSnippet: `-- Thread A (SQL Agent): MySQL Query\nSELECT student_id, total_classes, attended_classes, ROUND((attended_classes/total_classes)*100, 1) AS attendance_pct\nFROM student_attendance WHERE student_id = '2024-CS-042';\n\n-- Thread B (RAG Agent): Vector Store Payload\nCollection: academic_policies | Vector Query: "minimum required attendance percentage threshold"`
        }
      },
      // STEP 3: Branch Agents to Query / Vector Security Layers
      {
        nodeId: 'sql-layer',
        activeNodeIds: ['sql-layer', 'vector-store'],
        activeTransitions: [
          { from: 'sql-agent', to: 'sql-layer' },
          { from: 'rag-agent', to: 'vector-store' }
        ],
        title: 'SQL Layer & Vector Store (Parallel Query Prep)',
        badge: 'PARALLEL PREP',
        isParallel: true,
        caption: 'SQL Agent forwards query to SQL Layer while RAG Agent requests embeddings from Vector Store.',
        logs: [
          '[Thread A] SQL Layer verifying AST rules and read-only access token',
          '[Thread B] Vector Store searching 12,400 indexed policy document chunks'
        ]
      },
      // STEP 4: Data Retrieval from Database / Vector Store
      {
        nodeId: 'college-db',
        activeNodeIds: ['college-db', 'vector-store'],
        activeTransitions: [
          { from: 'sql-layer', to: 'college-db' },
          { from: 'vector-store', to: 'vector-store' }
        ],
        title: 'College DB & Vector Store (Parallel Data Fetch)',
        badge: 'PARALLEL RETRIEVAL',
        isParallel: true,
        caption: 'SQL Layer fetches student attendance from MySQL DB while Vector Store retrieves policy chunks.',
        logs: [
          '[Thread A Result] MySQL fetched: Roll #2024-CS-042 Attendance = 78.5% (157 / 200 classes)',
          '[Thread B Result] Vector Store fetched: Minimum required attendance = 75.0% (Academic_Regulations_2025.pdf)'
        ],
        payloadSummary: {
          type: 'rag',
          retrievedDocs: [
            {
              title: 'MySQL DB: student_attendance',
              score: 'Exact DB Record',
              text: 'Student: Roll #2024-CS-042 | Attended: 157/200 | Attendance: 78.5%'
            },
            {
              title: 'Academic_Regulations_2025.pdf',
              score: '0.932 Similarity',
              text: 'Section 3.1: Minimum required attendance threshold is 75.0%.'
            }
          ]
        }
      },
      // STEP 5: Parallel Convergence to Local LLM Engine
      {
        nodeId: 'local-llm',
        activeNodeIds: ['local-llm'],
        activeTransitions: [
          { from: 'college-db', to: 'local-llm' },
          { from: 'vector-store', to: 'local-llm' }
        ],
        title: 'Local LLM Engine (Parallel Convergence)',
        badge: 'OFFLINE MODEL ENGINE',
        caption: 'Both parallel streams (MySQL student record: 78.5% + PDF policy threshold: 75%) feed into Local LLM.',
        logs: [
          'Converging Parallel Thread A (78.5% student record) + Parallel Thread B (75.0% policy requirement)',
          'Total merged context: 980 tokens',
          'Generating comparative reasoning...'
        ],
        payloadSummary: {
          type: 'llm',
          metrics: [
            { label: 'Parallel Convergence', value: 'MySQL (78.5%) + Vector (75%)' },
            { label: 'Execution', value: '100% Offline (Local Llama-3 8B)' }
          ]
        }
      },
      // STEP 6: Local LLM to Synthesis Agent (Fusion & Stream Waiting)
      {
        nodeId: 'synthesis-agent',
        activeNodeIds: ['synthesis-agent'],
        activeTransitions: [{ from: 'local-llm', to: 'synthesis-agent' }],
        title: 'Synthesis Agent (Stream Fusion)',
        badge: 'FUSION & GROUNDING',
        isWaiting: true,
        caption: 'Synthesis Agent fuses both parallel streams, verifies math (78.5% > 75.0%), and attaches dual citations.',
        logs: [
          'Waiting for parallel input verification: Complete',
          'Mathematical comparison verified: 78.5% exceeds 75.0% by +3.5%',
          'Attaching dual citations: [MySQL: student_attendance] & [Academic_Regulations_2025.pdf]'
        ],
        payloadSummary: {
          type: 'synthesis',
          metrics: [
            { label: 'Fact Verification', value: 'Passed (+3.5% above requirement)' },
            { label: 'Dual Provenance', value: 'MySQL + Vector Store' }
          ]
        }
      },
      // STEP 7: Synthesis Agent to Verification Agent
      {
        nodeId: 'verification-agent',
        activeNodeIds: ['verification-agent'],
        activeTransitions: [{ from: 'synthesis-agent', to: 'verification-agent' }],
        title: 'Verification Agent',
        badge: 'FACT-CHECK',
        caption: 'Checking the answer against the real database/documents before showing it',
        logs: [
          'Cross-referencing attendance percentage with MySQL: student_attendance...',
          'Cross-referencing policy threshold with PDF chunk evidence...',
          'Mathematical comparison (78.5% > 75.0%) verified ✓',
          'All claims verified against dual sources ✓'
        ],
        payloadSummary: {
          type: 'verification',
          metrics: [
            { label: 'Claims Checked', value: '3 / 3 Verified' },
            { label: 'Math Verification', value: '78.5% > 75.0% confirmed' },
            { label: 'Dual Source Match', value: 'MySQL ✓ + Vector DB ✓' },
            { label: 'Confidence', value: 'High (all values exact-match)' }
          ]
        }
      },
      // STEP 8: Verification Agent to Chat UI
      {
        nodeId: 'chat-ui',
        activeNodeIds: ['chat-ui'],
        activeTransitions: [{ from: 'verification-agent', to: 'chat-ui' }],
        title: 'Chat UI',
        badge: 'RESPONSE INTERFACE',
        caption: 'Delivers verified comparative answer to Chat UI.',
        logs: ['Render complete']
      }
    ],
    finalAnswer: {
      text: `Here is the comparative breakdown of your attendance:\n\n• **Your Current Attendance:** **78.5%** *(157 out of 200 classes attended)*\n• **Minimum Required Policy:** **75.0%** *(as per Academic Regulations Section 3.1)*\n• **Status:** **Eligible for End-Semester Exams** ✅\n\n*Analysis: You are currently **+3.5% above** the minimum mandatory threshold. Maintaining your current attendance pattern will ensure continued exam eligibility.*`,
      sources: [
        { title: 'MySQL Table: student_attendance', type: 'SQL Table' },
        { title: 'Academic_Regulations_2025.pdf (Page 8)', type: 'Vector DB' }
      ],
      stats: {
        totalTime: '0.72s',
        privacyStatus: '100% Offline (Enterprise privacy compliant)',
        modelUsed: 'Llama-3-8B-Instruct (Parallel Dual-Branch RAG + SQL)'
      }
    }
  }
];
