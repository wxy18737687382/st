import React from 'react';
import { List, BookOpen, Code2, GraduationCap, BarChart3 } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import type { StudyMode } from '../types/quiz';

interface MobileBottomNavProps {
  onOpenExamModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenExamModal }) => {
  const { mode, setMode } = useQuiz();

  const navItems: { mode: StudyMode | 'exam'; label: string; icon: React.ReactNode }[] = [
    { mode: 'problems', label: '题库', icon: <List className="w-5 h-5" /> },
    { mode: 'workbench', label: '做题', icon: <BookOpen className="w-5 h-5" /> },
    { mode: 'code-sandbox', label: '手撕', icon: <Code2 className="w-5 h-5" /> },
    { mode: 'exam', label: '模考', icon: <GraduationCap className="w-5 h-5" /> },
    { mode: 'stats', label: '战绩', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur border-t border-slate-200 dark:border-[#333] pb-[var(--sab,0px)]">
      <div className="grid grid-cols-5 h-14">
        {navItems.map(item => {
          const isActive =
            mode === item.mode ||
            (item.mode === 'workbench' && (mode === 'workbench' || mode === 'practice'));
          return (
            <button
              key={item.mode}
              onClick={() => {
                if (item.mode === 'exam') {
                  onOpenExamModal();
                } else {
                  setMode(item.mode as StudyMode);
                }
              }}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-[#00b8a3] font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
