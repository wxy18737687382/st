import React, { useState, useEffect } from 'react';
import { X, Clock, Play, CheckCircle2, Award, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuiz } from '../context/QuizContext';
import type { Question, MasteryStatus } from '../types/quiz';
import { MathMarkdown } from './MathMarkdown';
import { CodePlayground } from './CodePlayground';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MockExamModal: React.FC<MockExamModalProps> = ({ isOpen, onClose }) => {
  const { questions, setMasteryStatus, saveExamResult } = useQuiz();

  // Setup state
  const [examCategory, setExamCategory] = useState<string>('All');
  const [examCount, setExamCount] = useState<number>(15);
  const [examMinutes, setExamMinutes] = useState<number>(30);

  // Active exam state
  const [isExamActive, setIsExamActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, MasteryStatus>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isExamActive || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, isSubmitted, timeLeft]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(questions.map(q => q.category)));

  const handleStartExam = () => {
    let pool = questions;
    if (examCategory !== 'All') {
      pool = questions.filter(q => q.category === examCategory);
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(examCount, shuffled.length));

    setExamQuestions(selected);
    setCurrentExamIndex(0);
    setTimeLeft(examMinutes * 60);
    setUserAnswers({});
    setIsSubmitted(false);
    setIsExamActive(true);
  };

  const handleSelectAnswer = (qId: string, status: MasteryStatus) => {
    setUserAnswers(prev => ({ ...prev, [qId]: status }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    // Count score (mastered = 100%, vague = 50%, wrong/unseen = 0)
    let scoreTotal = 0;
    examQuestions.forEach(q => {
      const st = userAnswers[q.id];
      if (st === 'mastered') scoreTotal += 100;
      else if (st === 'vague') scoreTotal += 50;
      // also sync to global mastery
      if (st) setMasteryStatus(q.id, st);
    });

    const finalScore = Math.round(scoreTotal / (examQuestions.length || 1));

    saveExamResult({
      id: `exam-${Date.now()}`,
      timestamp: Date.now(),
      totalQuestions: examQuestions.length,
      score: finalScore,
      timeSpentSeconds: examMinutes * 60 - timeLeft,
      category: examCategory,
      questionIds: examQuestions.map(q => q.id),
      answers: userAnswers,
    });

    if (finalScore >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentExamIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {isExamActive ? (isSubmitted ? '模考成绩单' : '笔试全真全流程模拟') : '开启全真模拟笔试'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {isExamActive && !isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* 1. Setup Phase */}
          {!isExamActive && (
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                  选择考察模块
                </label>
                <select
                  value={examCategory}
                  onChange={e => setExamCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm"
                >
                  <option value="All">全部综合全真摸底 (450+ 混合)</option>
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                  模拟抽题数量
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 25].map(cnt => (
                    <button
                      key={cnt}
                      onClick={() => setExamCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        examCount === cnt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cnt} 道题
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                  考试倒计时
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setExamMinutes(mins)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        examMinutes === mins
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {mins} 分钟
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartExam}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition"
                >
                  <Play className="w-4 h-4" />
                  开始模考
                </button>
              </div>
            </div>
          )}

          {/* 2. Active Exam Phase */}
          {isExamActive && !isSubmitted && currentQ && (
            <div className="space-y-6">
              {/* Question progress tracker */}
              <div className="flex flex-wrap gap-1.5">
                {examQuestions.map((q, idx) => {
                  const answered = !!userAnswers[q.id];
                  const isCur = idx === currentExamIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentExamIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                        isCur
                          ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 bg-emerald-600 text-white'
                          : answered
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs mb-3 text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    第 {currentExamIndex + 1} / {examQuestions.length} 题
                  </span>
                  <span>·</span>
                  <span>{currentQ.difficulty}</span>
                  <span>·</span>
                  <span>{currentQ.category}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  <MathMarkdown content={currentQ.title} />
                </h3>

                {currentQ.code && (
                  <div className="my-3">
                    <CodePlayground code={currentQ.code} questionId={currentQ.id} />
                  </div>
                )}

                {/* Self-Rating options during mock exam */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 mb-2">
                    在脑中作答或草稿后，评估本题作答把握：
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSelectAnswer(currentQ.id, 'mastered')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        userAnswers[currentQ.id] === 'mastered'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      完全掌握 (拿满分)
                    </button>

                    <button
                      onClick={() => handleSelectAnswer(currentQ.id, 'vague')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        userAnswers[currentQ.id] === 'vague'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      基本知道但有遗漏
                    </button>

                    <button
                      onClick={() => handleSelectAnswer(currentQ.id, 'wrong')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        userAnswers[currentQ.id] === 'wrong'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <X className="w-4 h-4 text-rose-500" />
                      生疏 / 不会
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentExamIndex === 0}
                  onClick={() => setCurrentExamIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold disabled:opacity-40"
                >
                  上一题
                </button>

                {currentExamIndex < examQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentExamIndex(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
                  >
                    下一题 <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                  >
                    交卷并生成报告
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. Submitted Result Phase */}
          {isSubmitted && (
            <div className="text-center py-6 space-y-6">
              <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                <Award className="w-12 h-12" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                  模拟考试已完成
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  总用时：{formatTime(examMinutes * 60 - timeLeft)} · 共 {examQuestions.length} 道题
                </p>
              </div>

              {/* Questions review list */}
              <div className="mt-6 text-left space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase">
                  题目作答核对与标准解析：
                </h5>
                {examQuestions.map((q, idx) => {
                  const ans = userAnswers[q.id];
                  return (
                    <details
                      key={q.id}
                      className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <summary className="font-semibold cursor-pointer flex items-center justify-between">
                        <span>
                          {idx + 1}. {q.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ans === 'mastered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ans === 'vague'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {ans === 'mastered' ? '已掌握' : ans === 'vague' ? '模糊' : '错题'}
                        </span>
                      </summary>
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        {q.standardAnswer && <MathMarkdown content={q.standardAnswer} />}
                        {q.code && <CodePlayground code={q.code} questionId={q.id} />}
                      </div>
                    </details>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setIsExamActive(false)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 再测一次
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
                >
                  返回继续刷题
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
