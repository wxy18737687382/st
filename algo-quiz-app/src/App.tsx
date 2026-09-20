import React, { useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { LeetCodeNavbar } from './components/LeetCodeNavbar';
import { LeetCodeWorkbench } from './components/LeetCodeWorkbench';
import { ProblemListView } from './components/ProblemListView';
import { FlashcardView } from './components/FlashcardView';
import { CodeSandboxView } from './components/CodeSandboxView';
import { StatsDashboard } from './components/StatsDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MockExamModal } from './components/MockExamModal';

const MainLayout: React.FC = () => {
  const { mode } = useQuiz();
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-14 md:pb-0 select-none">
      {/* Official LeetCode Style Top Navbar */}
      <LeetCodeNavbar onOpenExamModal={() => setIsExamModalOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {mode === 'workbench' && <LeetCodeWorkbench />}
        {mode === 'problems' && (
          <div className="flex-1 overflow-y-auto">
            <ProblemListView />
          </div>
        )}
        {mode === 'flashcard' && (
          <div className="flex-1 overflow-y-auto">
            <FlashcardView />
          </div>
        )}
        {mode === 'code-sandbox' && (
          <div className="flex-1 overflow-y-auto">
            <CodeSandboxView />
          </div>
        )}
        {mode === 'stats' && (
          <div className="flex-1 overflow-y-auto">
            <StatsDashboard />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation for Phone View */}
      <MobileBottomNav onOpenExamModal={() => setIsExamModalOpen(true)} />

      {/* Mock Exam Modal */}
      <MockExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <MainLayout />
    </QuizProvider>
  );
}
