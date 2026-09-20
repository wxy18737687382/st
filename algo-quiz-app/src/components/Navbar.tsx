import React, { useRef } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  GraduationCap,
  Code2,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import type { Difficulty } from '../types/quiz';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenExamModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenExamModal,
}) => {
  const {
    mode,
    setMode,
    isDarkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
  } = useQuiz();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand & Sidebar toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                Algo
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                  算法岗三端刷题
                </span>
                <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-mono -mt-1">
                  2025-2026 校招/社招必备
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Study Modes */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setMode('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              刷题工作台
            </button>

            <button
              onClick={() => setMode('flashcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'flashcard'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              速记背题
            </button>

            <button
              onClick={() => setMode('code-sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'code-sandbox'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-sky-500" />
              手撕代码
            </button>

            <button
              onClick={onOpenExamModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              全真模考
            </button>

            <button
              onClick={() => setMode('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'stats'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              学习看板
            </button>
          </nav>

          {/* Right: Search, Filter & Theme */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative hidden sm:block w-44 md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索题目/考点... (/)"
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs pl-8 pr-7 py-1.5 rounded-lg border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs py-1.5 px-2 rounded-lg border border-transparent focus:outline-none hidden xl:block"
            >
              <option value="All">所有难度</option>
              <option value="Easy">简单 (Easy)</option>
              <option value="Medium">中等 (Medium)</option>
              <option value="Hard">困难 (Hard)</option>
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? '切换日间模式' : '切换夜间模式'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
