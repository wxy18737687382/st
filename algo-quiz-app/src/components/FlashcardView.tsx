import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, AlertCircle, XCircle, ArrowLeft, ArrowRight, RotateCw, Sparkles, Bookmark } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { MathMarkdown } from './MathMarkdown';
import { CodePlayground } from './CodePlayground';

export const FlashcardView: React.FC = () => {
  const {
    currentQuestion,
    currentIndex,
    filteredQuestions,
    nextQuestion,
    prevQuestion,
    setMasteryStatus,
    toggleFavorite,
    progress,
  } = useQuiz();

  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset flip when question changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const isFavorite = progress.favorites.includes(currentQuestion.id);

  // Handle touch swipe for mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextQuestion();
    } else if (isRightSwipe) {
      prevQuestion();
    }
  };

  const handleRate = (status: 'mastered' | 'vague' | 'wrong') => {
    setMasteryStatus(currentQuestion.id, status);
    nextQuestion();
  };

  return (
    <div
      className="max-w-3xl mx-auto py-4 px-2 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-2">
        <span className="font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          卡片速记模式 · {currentQuestion.category}
        </span>
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
          {currentIndex + 1} / {filteredQuestions.length}
        </span>
      </div>

      {/* Main Flashcard */}
      <div
        className={`min-h-[420px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md flex flex-col justify-between transition-all duration-300 ${
          isFlipped ? 'ring-2 ring-emerald-500/20' : ''
        }`}
      >
        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentQuestion.difficulty}
              </span>
              <span className="text-slate-400 font-medium">
                {currentQuestion.subcategory}
              </span>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(currentQuestion.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-amber-500 transition"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Front Content: Question Title */}
          <div className="mt-5">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
              <MathMarkdown content={currentQuestion.title} />
            </h2>

            {currentQuestion.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentQuestion.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back Content (Revealed upon flip) */}
        {isFlipped ? (
          <div className="my-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fadeIn">
            {/* Key Points */}
            {currentQuestion.keyPoints && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
                  核心得分点
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                  {currentQuestion.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code if available */}
            {currentQuestion.code && (
              <div className="max-h-64 overflow-y-auto rounded-lg">
                <CodePlayground code={currentQuestion.code} questionId={currentQuestion.id} />
              </div>
            )}

            {/* Standard Answer */}
            {currentQuestion.standardAnswer && (
              <div className="max-h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs sm:text-sm">
                <MathMarkdown content={currentQuestion.standardAnswer} />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => setIsFlipped(true)}
            className="my-10 py-12 flex flex-col items-center justify-center cursor-pointer rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 transition-all text-slate-400 hover:text-emerald-600"
          >
            <RotateCw className="w-8 h-8 mb-2 animate-spin-slow opacity-60" />
            <p className="text-sm font-semibold">点击此处翻转卡片，查看解析</p>
            <p className="text-xs opacity-70 mt-1">（移动端支持左右滑动手势切题）</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={prevQuestion}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 上一题
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> {isFlipped ? '收起答案' : '翻转卡片'}
            </button>
            <button
              onClick={nextQuestion}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 sm:hidden"
            >
              下一题 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rating Buttons (auto advances on rating) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => handleRate('wrong')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> 没记住
            </button>
            <button
              onClick={() => handleRate('vague')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-200 dark:border-amber-800 text-xs font-bold transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" /> 模糊
            </button>
            <button
              onClick={() => handleRate('mastered')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> 牢固掌握
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
