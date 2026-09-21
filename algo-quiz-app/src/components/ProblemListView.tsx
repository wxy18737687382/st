import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const ProblemListView: React.FC = () => {
  const {
    filteredQuestions,
    setCurrentQuestionId,
    setMode,
    progress,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    clearFilters,
    stats,
  } = useQuiz();

  const handleSelectProblem = (id: string) => {
    setCurrentQuestionId(id);
    setMode('workbench');
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-3 sm:px-6 space-y-4 animate-fadeIn">
      {/* Top Banner Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-[#262626] rounded-2xl border border-slate-200 dark:border-[#333] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b8a3] to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg">
            LC
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              算法岗题库大厅 · LeetCode & 笔试全真
            </h2>
            <p className="text-xs text-slate-400">
              共收录 {stats.total} 道真题，包含 143 道必考选择题与 36 个手撕算子
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">已解答通过</span>
            <span className="text-emerald-500 font-bold text-base">
              {stats.mastered} <span className="text-xs font-normal text-slate-400">/ {stats.total}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">错题待消</span>
            <span className="text-rose-500 font-bold text-base">{stats.wrong}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#262626] rounded-xl border border-slate-200 dark:border-[#333] text-xs">
        {/* Left Filter Pills - Scrollable on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {/* Difficulty Filter */}
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap shrink-0 ${
                selectedDifficulty === diff
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-[#333] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3d3d3d]'
              }`}
            >
              {diff === 'All' ? '全部难度' : diff === 'Easy' ? '简单' : diff === 'Medium' ? '中等' : '困难'}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-[#444] mx-1 shrink-0"></div>

          {/* Type Filter */}
          <button
            onClick={() => setSelectedType(selectedType === 'choice' ? 'All' : 'choice')}
            className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap shrink-0 ${
              selectedType === 'choice'
                ? 'bg-[#ffa116] text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-[#333] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            选择题 (143题)
          </button>

          <button
            onClick={() => setSelectedType(selectedType === 'code' ? 'All' : 'code')}
            className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap shrink-0 ${
              selectedType === 'code'
                ? 'bg-[#00b8a3] text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-[#333] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            手撕算子 (36题)
          </button>

          <button
            onClick={() => setSelectedType(selectedType === 'algorithm' ? 'All' : 'algorithm')}
            className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap shrink-0 ${
              selectedType === 'algorithm'
                ? 'bg-blue-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-[#333] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            力扣编程算法
          </button>
        </div>

        {/* Search & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索题目、考点、公司..."
              className="w-full bg-slate-100 dark:bg-[#1f1f1f] text-xs pl-8 pr-3 py-1.5 rounded-lg border-0 focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>
          {(selectedDifficulty !== 'All' || selectedType !== 'All' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-rose-500"
            >
              重置
            </button>
          )}
        </div>
      </div>

      {/* LeetCode Problem Table */}
      <div className="bg-white dark:bg-[#262626] rounded-2xl border border-slate-200 dark:border-[#333] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#202020] text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-[#333] text-[11px]">
              <tr>
                <th className="py-3 px-2 sm:px-4 w-10 sm:w-12 text-center">状态</th>
                <th className="py-3 px-2 sm:px-4">题目</th>
                <th className="py-3 px-3 w-20 text-center hidden sm:table-cell">题解</th>
                <th className="py-3 px-4 w-28 hidden sm:table-cell">通过率</th>
                <th className="py-3 px-2 sm:px-4 w-20 sm:w-24 text-right sm:text-left">难度</th>
                <th className="py-3 px-4 hidden md:table-cell">专题分类</th>
                <th className="py-3 px-4 hidden lg:table-cell">高频大厂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2e2e2e]">
              {filteredQuestions.map(q => {
                const isMastered = progress.status[q.id] === 'mastered';
                const isWrong = progress.status[q.id] === 'wrong';

                return (
                  <tr
                    key={q.id}
                    onClick={() => handleSelectProblem(q.id)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors group"
                  >
                    {/* Status Checkbox */}
                    <td className="py-3 px-2 sm:px-4 text-center">
                      {isMastered ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00b8a3] mx-auto" />
                      ) : isWrong ? (
                        <XCircle className="w-4 h-4 text-rose-500 mx-auto" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-[#444] mx-auto opacity-40"></div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-2 sm:px-4 font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#00b8a3] transition-colors">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-slate-400 font-mono text-[11px] shrink-0">#{q.qid}</span>
                        <span className="truncate max-w-[170px] xs:max-w-xs sm:max-w-md">{q.title}</span>
                      </div>
                    </td>

                    {/* Solutions Icon */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center justify-center text-slate-400 group-hover:text-[#ffa116]">
                        <BookOpen className="w-3.5 h-3.5" />
                      </span>
                    </td>

                    {/* Acceptance */}
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px] hidden sm:table-cell">
                      {q.acceptanceRate || '54.2%'}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-2 sm:px-4 font-bold text-[11px] text-right sm:text-left">
                      <span
                        className={
                          q.difficulty === 'Easy'
                            ? 'text-[#00b8a3]'
                            : q.difficulty === 'Medium'
                            ? 'text-[#ffc01e]'
                            : 'text-[#ff375f]'
                        }
                      >
                        {q.difficulty === 'Easy' ? '简单' : q.difficulty === 'Medium' ? '中等' : '困难'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 hidden md:table-cell truncate max-w-xs text-[11px]">
                      {q.category}
                    </td>

                    {/* Company Tags */}
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {q.companyTags?.slice(0, 2).map((co, cidx) => (
                          <span
                            key={cidx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#333] text-slate-500 dark:text-slate-400 text-[10px]"
                          >
                            {co}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-xs">
            未找到匹配的题目，请尝试清除搜索条件
          </div>
        )}
      </div>
    </div>
  );
};
