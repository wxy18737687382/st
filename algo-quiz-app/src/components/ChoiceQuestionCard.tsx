import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuiz } from '../context/QuizContext';
import type { Question } from '../types/quiz';
import { MathMarkdown } from './MathMarkdown';

interface ChoiceQuestionCardProps {
  question: Question;
}

export const ChoiceQuestionCard: React.FC<ChoiceQuestionCardProps> = ({ question }) => {
  const { progress, submitChoiceAnswer } = useQuiz();

  const selectedKey = progress.choiceAnswers[question.id];
  const [hasAnswered, setHasAnswered] = useState(!!selectedKey);

  useEffect(() => {
    setHasAnswered(!!progress.choiceAnswers[question.id]);
  }, [question.id, progress.choiceAnswers]);

  const handleSelectOption = (key: string) => {
    if (hasAnswered) return; // already answered
    const isCorrect = submitChoiceAnswer(question.id, key);
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

  const correctKey = question.correctAnswer?.trim().toUpperCase();

  return (
    <div className="space-y-5 my-4">
      {/* Options List */}
      <div className="space-y-2.5">
        {question.options?.map(opt => {
          const isChosen = selectedKey === opt.key;
          const isThisCorrect = opt.key === correctKey;

          let optionStyle = 'bg-slate-50 dark:bg-[#262626] border-slate-200 dark:border-[#333] hover:border-emerald-500/50';
          let badgeStyle = 'bg-slate-200 dark:bg-[#333] text-slate-700 dark:text-slate-300';

          if (hasAnswered) {
            if (isThisCorrect) {
              optionStyle = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 text-emerald-900 dark:text-emerald-200';
              badgeStyle = 'bg-emerald-600 text-white font-bold';
            } else if (isChosen && !isThisCorrect) {
              optionStyle = 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500 text-rose-900 dark:text-rose-200 animate-shake';
              badgeStyle = 'bg-rose-600 text-white font-bold';
            } else {
              optionStyle = 'opacity-50 bg-slate-50 dark:bg-[#262626] border-slate-200 dark:border-[#333]';
            }
          }

          return (
            <div
              key={opt.key}
              onClick={() => handleSelectOption(opt.key)}
              className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 shadow-xs ${optionStyle}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${badgeStyle}`}>
                {opt.key}
              </span>
              <div className="flex-1 leading-relaxed">
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
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#222] border border-slate-200 dark:border-[#333] shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2e2e2e]">
            <div className="flex items-center gap-2">
              {selectedKey === correctKey ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-[#00b8a3]">
                  <CheckCircle2 className="w-4 h-4" /> 回答正确！
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4" /> 回答错误，已收录错题本
                </span>
              )}
              <span className="text-xs text-slate-400">· 正确答案：<strong className="text-emerald-500 font-mono text-sm">{correctKey}</strong></span>
            </div>

            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3 h-3" /> 重答
            </button>
          </div>

          {/* Explanation text */}
          {question.explanation && (
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ffa116]" /> 权威解析与答题要点
              </h5>
              <MathMarkdown content={question.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
