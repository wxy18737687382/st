import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Sun,
  List,
  Terminal,
  BarChart2,
  GraduationCap,
  Search,
  HelpCircle,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

interface LeetCodeNavbarProps {
  onOpenExamModal: () => void;
}

export const LeetCodeNavbar: React.FC<LeetCodeNavbarProps> = ({ onOpenExamModal }) => {
  const {
    questions,
    currentQuestion,
    filteredQuestions,
    currentIndex,
    nextQuestion,
    prevQuestion,
    randomQuestion,
    setCurrentQuestionId,
    mode,
    setMode,
    isDarkMode,
    toggleDarkMode,
    timerSeconds,
    isTimerRunning,
    toggleTimer,
    resetTimer,
  } = useQuiz();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredDropdownList = filteredQuestions.filter(q =>
    q.title.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <header className="h-12 bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#282828] text-slate-800 dark:text-slate-200 px-3 sm:px-4 flex items-center justify-between select-none z-30 relative transition-colors">
      {/* Left: Brand + Navigation Modes */}
      <div className="flex items-center gap-3">
        {/* LeetCode Icon */}
        <div
          onClick={() => setMode('problems')}
          className="flex items-center gap-2 cursor-pointer group"
          title="返回力扣题库大厅"
        >
          <div className="w-7 h-7 rounded-lg bg-[#ffa116] flex items-center justify-center text-black font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="font-bold text-sm hidden md:inline tracking-tight text-slate-900 dark:text-white">
            LeetCode <span className="text-[#ffa116] text-xs font-mono font-normal">算法岗</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-[#333] hidden sm:block"></div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setMode('problems')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              mode === 'problems'
                ? 'bg-slate-100 dark:bg-[#282828] text-emerald-600 dark:text-[#00b8a3] font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>题库清单</span>
          </button>

          <button
            onClick={() => {
              const firstChoice = questions.find(q => q.type === 'choice');
              if (firstChoice) setCurrentQuestionId(firstChoice.id);
              setMode('workbench');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              mode === 'workbench' && currentQuestion?.type === 'choice'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-500 hover:text-indigo-500'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>选择题专区</span>
          </button>

          <button
            onClick={() => {
              const firstAlgo = questions.find(q => q.type === 'algorithm' || q.type === 'code');
              if (firstAlgo) setCurrentQuestionId(firstAlgo.id);
              setMode('workbench');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              mode === 'workbench' && currentQuestion?.type !== 'choice'
                ? 'bg-emerald-50 dark:bg-[#282828] text-[#00b8a3] font-bold border border-emerald-500/20'
                : 'text-slate-500 hover:text-emerald-500'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#00b8a3]" />
            <span>算法编程区</span>
          </button>

          <button
            onClick={onOpenExamModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-500 hover:text-rose-500 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
            <span>全真模考</span>
          </button>

          <button
            onClick={() => setMode('stats')}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              mode === 'stats'
                ? 'bg-slate-100 dark:bg-[#282828] text-emerald-600 dark:text-[#00b8a3] font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>战绩看板</span>
          </button>
        </div>
      </div>

      {/* Middle: LeetCode Question Switcher & Quick Dropdown */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={prevQuestion}
          title="上一题"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dropdown for questions */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-[#282828] hover:bg-slate-200 dark:hover:bg-[#333] transition font-medium max-w-[140px] sm:max-w-[240px] truncate"
          >
            <span className="truncate">
              {currentQuestion ? `${currentIndex + 1}. ${currentQuestion.title}` : '选择题目'}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-80 max-h-96 bg-white dark:bg-[#262626] border border-slate-200 dark:border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 animate-fadeIn">
              <div className="p-2 border-b border-slate-200 dark:border-[#3a3a3a]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={e => setDropdownSearch(e.target.value)}
                    placeholder="快速跳转题目..."
                    className="w-full pl-8 pr-3 py-1 text-xs bg-slate-100 dark:bg-[#1a1a1a] rounded-lg border-0 focus:outline-none text-slate-800 dark:text-slate-200"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-1 text-xs custom-scrollbar">
                {filteredDropdownList.slice(0, 50).map(q => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionId(q.id);
                      setMode('workbench');
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between gap-2 transition ${
                      currentQuestion?.id === q.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#00b8a3] font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{q.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        q.difficulty === 'Easy'
                          ? 'text-[#00b8a3]'
                          : q.difficulty === 'Medium'
                          ? 'text-[#ffc01e]'
                          : 'text-[#ff375f]'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={nextQuestion}
          title="下一题"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={randomQuestion}
          title="随机一题"
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-500 hover:text-slate-900 dark:hover:text-white transition hidden sm:block"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Timer & Tools */}
      <div className="flex items-center gap-2">
        {/* LeetCode Stopwatch Timer */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#262626] border border-slate-200 dark:border-[#333] text-xs font-mono">
          <button
            onClick={toggleTimer}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
            title={isTimerRunning ? '暂停计时' : '开始计时'}
          >
            {isTimerRunning ? <Pause className="w-3 h-3 text-[#ffa116]" /> : <Play className="w-3 h-3 text-[#00b8a3]" />}
          </button>
          <span className="text-slate-700 dark:text-slate-200 font-semibold">{formatTime(timerSeconds)}</span>
          <button
            onClick={resetTimer}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-0.5"
            title="重置秒表"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#282828] transition"
          title={isDarkMode ? '切换日间模式' : '切换暗黑模式'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#ffa116]" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User avatar indicator */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00b8a3] to-teal-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
          AC
        </div>
      </div>
    </header>
  );
};
