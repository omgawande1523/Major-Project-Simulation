import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'How the AI Agent Answers a Query | Offline Agentic RAG Simulation',
  description: 'Interactive visual demonstration of offline agentic RAG and Text-to-SQL query resolution architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
