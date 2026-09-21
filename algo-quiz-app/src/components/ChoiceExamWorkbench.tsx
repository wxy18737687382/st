import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Building2,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuiz } from '../context/QuizContext';
import { MathMarkdown } from './MathMarkdown';

export const ChoiceExamWorkbench: React.FC = () => {
  const {
    currentQuestion,
    questions,
    nextQuestion,
    prevQuestion,
    setCurrentQuestionId,
    progress,
    toggleFavorite,
    submitChoiceAnswer,
  } = useQuiz();

  // All choice questions
  const choiceQuestions = React.useMemo(() => {
    return questions.filter(q => q.type === 'choice');
  }, [questions]);

  const currentChoiceIndex = React.useMemo(() => {
    if (!currentQuestion) return 0;
    return choiceQuestions.findIndex(q => q.id === currentQuestion.id);
  }, [choiceQuestions, currentQuestion]);

  const selectedKey = currentQuestion ? progress.choiceAnswers[currentQuestion.id] : undefined;
  const [hasAnswered, setHasAnswered] = useState(!!selectedKey);
  const [sheetFilter, setSheetFilter] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (currentQuestion) {
      setHasAnswered(!!progress.choiceAnswers[currentQuestion.id]);
    }
  }, [currentQuestion, progress.choiceAnswers]);

  // Keyboard shortcut listener: A/B/C/D to select, J/K to prev/next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && currentQuestion && !hasAnswered) {
        e.preventDefault();
        handleSelectOption(key);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        nextQuestion();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        prevQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, hasAnswered, nextQuestion, prevQuestion]);

  if (!currentQuestion || currentQuestion.type !== 'choice') return null;

  const isFavorite = progress.favorites.includes(currentQuestion.id);
  const correctKey = currentQuestion.correctAnswer?.trim().toUpperCase();

  const handleSelectOption = (key: string) => {
    if (hasAnswered) return;
    const isCorrect = submitChoiceAnswer(currentQuestion.id, key);
    setHasAnswered(true);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  const handleRetry = () => {
    setHasAnswered(false);
  };

  // Choice statistics
  const choiceStats = React.useMemo(() => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    choiceQuestions.forEach(q => {
      const ans = progress.choiceAnswers[q.id];
      if (ans) {
        answered++;
        if (ans.toUpperCase() === q.correctAnswer?.trim().toUpperCase()) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { answered, correct, wrong, accuracy, total: choiceQuestions.length };
  }, [choiceQuestions, progress.choiceAnswers]);

  // Filtered sheet list
  const sheetList = choiceQuestions.filter(q => {
    const ans = progress.choiceAnswers[q.id];
    if (sheetFilter === 'wrong') {
      return ans && ans.toUpperCase() !== q.correctAnswer?.trim().toUpperCase();
    }
    if (sheetFilter === 'unanswered') {
      return !ans;
    }
    return true;
  });

  const renderAnswerSheet = (isDrawer = false) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sheet Header & Stats */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-[#222] border-b border-slate-200 dark:border-[#333] space-y-2.5 sm:space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              选择题答题卡
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              已答 {choiceStats.answered} / {choiceStats.total}
            </span>
            {isDrawer && (
              <button
                onClick={() => setIsMobileSheetOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#333] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
            <div className="text-slate-400 text-[10px]">正确</div>
            <div className="text-emerald-500 font-bold font-mono text-sm mt-0.5">
              {choiceStats.correct}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
            <div className="text-slate-400 text-[10px]">错误</div>
            <div className="text-rose-500 font-bold font-mono text-sm mt-0.5">
              {choiceStats.wrong}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
            <div className="text-slate-400 text-[10px]">正确率</div>
            <div className="text-indigo-500 font-bold font-mono text-sm mt-0.5">
              {choiceStats.accuracy}%
            </div>
          </div>
        </div>

        {/* Sheet Filters */}
        <div className="flex gap-1 pt-1 text-xs">
          {(['all', 'wrong', 'unanswered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSheetFilter(f)}
              className={`flex-1 py-1 rounded-md text-[11px] font-medium transition ${
                sheetFilter === f
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-white dark:bg-[#333] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? '全部' : f === 'wrong' ? '错题本' : '未作答'}
            </button>
          ))}
        </div>
      </div>

      {/* Numbers Matrix Grid */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
          {sheetList.map((q, idx) => {
            const ans = progress.choiceAnswers[q.id];
            const isCur = q.id === currentQuestion.id;
            const isCorrect = ans && ans.toUpperCase() === q.correctAnswer?.trim().toUpperCase();
            const isWrong = ans && !isCorrect;

            let btnStyle =
              'bg-slate-100 dark:bg-[#202020] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#333] hover:bg-slate-200';

            if (isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
            }

            if (isCur) {
              btnStyle += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#262626]';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionId(q.id);
                  if (isDrawer) setIsMobileSheetOpen(false);
                }}
                className={`h-8 rounded-lg text-xs font-mono transition border flex items-center justify-center ${btnStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {sheetList.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            当前分类下暂无题目
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-50 dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-200">
      {/* Choice Exam Workspace Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-2 sm:p-3 overflow-hidden max-w-7xl w-full mx-auto">
        {/* MAIN COLUMN (8 cols): Question Stem, Option Cards, Answer & Analysis */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#262626] rounded-2xl border border-slate-200 dark:border-[#333] shadow-xs overflow-hidden min-h-0">
          {/* Header Bar */}
          <div className="h-12 bg-slate-50 dark:bg-[#222] border-b border-slate-200 dark:border-[#333] flex items-center justify-between px-3 sm:px-4 text-xs select-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> 单选
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[90px] xs:max-w-[140px] sm:max-w-none">
                {currentQuestion.category}
              </span>
              <span className="text-slate-400 hidden sm:inline">/</span>
              <span className="text-slate-400 hidden sm:inline">{currentQuestion.subcategory}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Answer Sheet Trigger Button (< lg) */}
              <button
                onClick={() => setIsMobileSheetOpen(true)}
                className="lg:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 text-[11px]"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>答题卡 ({choiceStats.answered}/{choiceStats.total})</span>
              </button>

              <span className="text-slate-400 font-mono hidden sm:inline">
                第 <strong className="text-slate-800 dark:text-white">{currentChoiceIndex + 1}</strong> / {choiceQuestions.length} 题
              </span>
              <button
                onClick={() => toggleFavorite(currentQuestion.id)}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#333] text-slate-400 hover:text-amber-500 transition"
                title={isFavorite ? '已收藏' : '收藏此题'}
              >
                {isFavorite ? (
                  <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Question Stem & Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7 custom-scrollbar space-y-5 sm:space-y-6">
            {/* Title / Question Stem */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-3 h-3" /> 正确率 {currentQuestion.acceptanceRate || '65.2%'}
                </span>
                {currentQuestion.companyTags && (
                  <span className="flex items-center gap-1 text-slate-400 ml-2">
                    <Building2 className="w-3 h-3" /> 高频：{currentQuestion.companyTags.slice(0, 2).join(' / ')}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-relaxed">
                <MathMarkdown content={currentQuestion.title.replace(/^【选择题】/, '')} />
              </h2>
            </div>

            {/* Option Cards A, B, C, D */}
            <div className="space-y-3">
              {currentQuestion.options?.map(opt => {
                const isChosen = selectedKey === opt.key;
                const isThisCorrect = opt.key === correctKey;

                let cardClasses =
                  'bg-slate-50 dark:bg-[#202020] border-slate-200 dark:border-[#333] hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-100/80 dark:hover:bg-[#282828]';
                let circleClasses = 'bg-white dark:bg-[#333] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#444]';

                if (hasAnswered) {
                  if (isThisCorrect) {
                    cardClasses =
                      'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200';
                    circleClasses = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else if (isChosen && !isThisCorrect) {
                    cardClasses =
                      'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 text-rose-900 dark:text-rose-200 animate-shake';
                    circleClasses = 'bg-rose-600 text-white border-rose-600 font-bold';
                  } else {
                    cardClasses = 'opacity-40 bg-slate-50 dark:bg-[#202020] border-slate-200 dark:border-[#333]';
                  }
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3.5 shadow-xs select-none ${cardClasses}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${circleClasses}`}
                    >
                      {opt.key}
                    </div>

                    <div className="flex-1 leading-relaxed pt-0.5">
                      <MathMarkdown content={opt.text} />
                    </div>

                    {hasAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isChosen && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer & Explanation Reveal */}
            {hasAnswered && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#202020] border border-slate-200 dark:border-[#333] shadow-sm space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2e2e2e]">
                  <div className="flex items-center gap-3">
                    {selectedKey === correctKey ? (
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-[#00b8a3]">
                        <CheckCircle2 className="w-5 h-5" /> 回答正确！
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="w-5 h-5" /> 回答错误，已自动收录错题本
                      </span>
                    )}

                    <div className="text-xs text-slate-500">
                      正确答案：
                      <span className="font-mono font-black text-sm text-emerald-500 ml-1">
                        {correctKey}
                      </span>
                      {selectedKey && (
                        <span className="ml-2">
                          你的选择：
                          <span
                            className={`font-mono font-bold ${
                              selectedKey === correctKey ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {selectedKey}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333] rounded-md transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 重做
                  </button>
                </div>

                {/* Explanation text */}
                {currentQuestion.explanation && (
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#ffa116]" /> 权威真题深度解析
                    </h5>
                    <MathMarkdown content={currentQuestion.explanation} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="h-14 bg-slate-50 dark:bg-[#222] border-t border-slate-200 dark:border-[#333] flex items-center justify-between px-3 sm:px-4 select-none shrink-0">
            <button
              onClick={prevQuestion}
              className="flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-[#3a3a3a] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#333] transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" /> <span>上一题</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>第 <strong className="text-slate-800 dark:text-white">{currentChoiceIndex + 1}</strong> / {choiceQuestions.length} 题</span>
            </div>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              <span>下一题</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SIDEBAR COLUMN (4 cols): 答题卡 (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col bg-white dark:bg-[#262626] rounded-2xl border border-slate-200 dark:border-[#333] shadow-xs overflow-hidden min-h-0">
          {renderAnswerSheet(false)}
        </div>
      </div>

      {/* Mobile Drawer (Bottom Sheet Modal for Answer Sheet) */}
      {isMobileSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileSheetOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#262626] rounded-t-3xl border-t border-slate-200 dark:border-[#333] max-h-[82vh] h-[550px] flex flex-col overflow-hidden shadow-2xl z-10 animate-slideUp">
            {renderAnswerSheet(true)}
          </div>
        </div>
      )}
    </div>
  );
};
