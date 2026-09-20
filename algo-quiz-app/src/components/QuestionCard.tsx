import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, ExternalLink, Tag, Layers } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { MathMarkdown } from './MathMarkdown';
import { AnswerSection } from './AnswerSection';

export const QuestionCard: React.FC = () => {
  const {
    currentQuestion,
    currentIndex,
    filteredQuestions,
    nextQuestion,
    prevQuestion,
    randomQuestion,
    setMasteryStatus,
  } = useQuiz();

  // Keyboard shortcut listener (J/K next/prev, M mastered, Space show answer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in textarea/input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        nextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        prevQuestion();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        randomQuestion();
      } else if (e.key.toLowerCase() === 'm' && currentQuestion) {
        e.preventDefault();
        setMasteryStatus(currentQuestion.id, 'mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextQuestion, prevQuestion, randomQuestion, currentQuestion, setMasteryStatus]);

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <Layers className="w-12 h-12 mb-3 text-slate-300" />
        <p className="text-base font-medium">当前筛选条件下暂无题目</p>
        <p className="text-xs mt-1 text-slate-500">请尝试清除或更改顶部的分类与筛选条件</p>
      </div>
    );
  }

  // Difficulty badge colors
  const diffBadge = {
    Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  }[currentQuestion.difficulty || 'Medium'];

  const typeNames: Record<string, string> = {
    algorithm: 'LeetCode 算法',
    theory: '理论简答',
    code: '手撕代码',
    math: '数学/概率推导',
    system: '系统架构设计',
    sql: 'SQL 数据库',
    logic: '经典逻辑智力题',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all">
      {/* Top Header: Metadata and navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Difficulty */}
          <span className={`px-2.5 py-0.5 rounded-full font-bold border ${diffBadge}`}>
            {currentQuestion.difficulty}
          </span>

          {/* Type Badge */}
          <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {typeNames[currentQuestion.type] || currentQuestion.type}
          </span>

          {/* Category & Subcategory breadcrumbs */}
          <span className="text-slate-400 hidden sm:inline">/</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
            {currentQuestion.category}
          </span>
          <span className="text-slate-400 hidden sm:inline">›</span>
          <span className="text-slate-500 dark:text-slate-500 hidden sm:inline">
            {currentQuestion.subcategory}
          </span>
        </div>

        {/* Question Counter & Quick Navigator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-200">{currentIndex + 1}</span> / {filteredQuestions.length}
          </span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={prevQuestion}
              title="上一题 (J / ←)"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={randomQuestion}
              title="随机抽一题 (R)"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextQuestion}
              title="下一题 (K / →)"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Title & Content */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
            <MathMarkdown content={currentQuestion.title} />
          </h2>

          {/* LeetCode out-link if available */}
          {currentQuestion.leetcodeId && (
            <a
              href={`https://leetcode.cn/problems/`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors font-medium border border-amber-500/20"
              title="在力扣打开此题"
            >
              <span>力扣 #{currentQuestion.leetcodeId}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {currentQuestion.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Answer, key points, and marking section */}
      <AnswerSection questionId={currentQuestion.id} />

      {/* Bottom shortcut helper for PC / Desktop */}
      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
        <div className="hidden md:flex items-center gap-4">
          <span>快捷键: <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">J</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">K</kbd> 上/下一题</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Space</kbd> 答案展开</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">M</kbd> 标记已掌握</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">R</kbd> 随机抽题</span>
        </div>
        <div className="text-right w-full md:w-auto">
          <span>校招/社招算法岗题库 · 596题极速刷通</span>
        </div>
      </div>
    </div>
  );
};
