import React from 'react';
import { Terminal, CheckCircle2, Bookmark } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { CodePlayground } from './CodePlayground';
import { MathMarkdown } from './MathMarkdown';

export const CodeSandboxView: React.FC = () => {
  const {
    questions,
    currentQuestion,
    setCurrentQuestionId,
    progress,
    toggleFavorite,
    setMasteryStatus,
  } = useQuiz();

  // All questions with code snippets
  const codeQuestions = React.useMemo(() => {
    return questions.filter(q => !!q.code);
  }, [questions]);

  const activeQuestion = (currentQuestion && currentQuestion.code) ? currentQuestion : codeQuestions[0];

  if (codeQuestions.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Banner */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold">算法岗高频手撕算子与数据结构工作台</h2>
            <p className="text-xs text-slate-400">
              收录 36+ 经典核心算子（Attention、RoPE、KV Cache、NMS、LayerNorm、Dijkstra 等）Python 标准实现
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800">
          <span>共收录 {codeQuestions.length} 个经典算子</span>
        </div>
      </div>

      {/* Grid: Left Operators List, Right Code & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 36 Code questions */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 max-h-[750px] overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider mb-1">
            选择手撕算子 ({codeQuestions.length})
          </div>

          <div className="space-y-1">
            {codeQuestions.map(q => {
              const isSelected = activeQuestion?.id === q.id;
              const isMastered = progress.status[q.id] === 'mastered';

              return (
                <div
                  key={q.id}
                  onClick={() => setCurrentQuestionId(q.id)}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs transition flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex-1 truncate">
                    <span className="block truncate">{q.title.replace(/^\d+\.\s+/, '')}</span>
                    <span
                      className={`text-[10px] mt-0.5 inline-block ${
                        isSelected ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {q.subcategory}
                    </span>
                  </div>

                  {isMastered && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-white' : 'text-emerald-500'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor & Details */}
        <div className="lg:col-span-8 space-y-4">
          {activeQuestion && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {activeQuestion.subcategory}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeQuestion.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(activeQuestion.id)}
                    className="p-1.5 rounded-lg border text-xs text-slate-500 hover:text-amber-500 transition"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        progress.favorites.includes(activeQuestion.id)
                          ? 'fill-amber-500 text-amber-500'
                          : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setMasteryStatus(activeQuestion.id, 'mastered')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    标记已掌握
                  </button>
                </div>
              </div>

              {/* Standard Code Playground */}
              {activeQuestion.code && (
                <div className="mt-4">
                  <CodePlayground
                    code={activeQuestion.code}
                    questionId={activeQuestion.id}
                  />
                </div>
              )}

              {/* Standard Answer & Formula Notes */}
              {activeQuestion.standardAnswer && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs sm:text-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    算子数学原理与实现要点
                  </h4>
                  <MathMarkdown content={activeQuestion.standardAnswer} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
