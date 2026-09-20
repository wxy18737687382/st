import React, { useRef } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  History,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const StatsDashboard: React.FC = () => {
  const {
    stats,
    progress,
    resetAllProgress,
    exportProgressJson,
    importProgressJson,
    setSelectedStatus,
    setMode,
  } = useQuiz();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = exportProgressJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algo_quiz_progress_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importProgressJson(content);
      if (success) {
        alert('学习数据导入成功！');
      } else {
        alert('文件格式错误，导入失败。');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('警告：此操作将清空所有刷题记录、错题本与笔记！确定继续吗？')) {
      resetAllProgress();
      alert('已重置所有刷题数据。');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            学习进度与复习雷达
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">算法岗备考数据中心</h2>
          <p className="text-sm opacity-90 mt-1 max-w-xl">
            覆盖高频 LeetCode、大模型训练微调、深度学习理论、经典手撕算子与系统设计。坚持每天精刷 10-20 题，笔试面试稳操胜券！
          </p>
        </div>

        {/* Big circular / stat card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center shrink-0 min-w-[160px]">
          <span className="text-xs uppercase font-bold opacity-80">综合掌握率</span>
          <div className="text-4xl sm:text-5xl font-black mt-1 font-mono">
            {stats.masteryPercentage}%
          </div>
          <span className="text-xs opacity-75 mt-1 block">
            已掌握 {stats.mastered} / {stats.total} 题
          </span>
        </div>
      </div>

      {/* 4 Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Mastered */}
        <div
          onClick={() => {
            setSelectedStatus('mastered');
            setMode('practice');
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-emerald-500 transition"
        >
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-bold uppercase">已熟练掌握</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {stats.mastered}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">点击筛选已掌握题目 →</span>
        </div>

        {/* Vague */}
        <div
          onClick={() => {
            setSelectedStatus('vague');
            setMode('practice');
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-amber-500 transition"
        >
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold uppercase">生疏/待复习</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {stats.vague}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">点击复习模糊题目 →</span>
        </div>

        {/* Wrong */}
        <div
          onClick={() => {
            setSelectedStatus('wrong');
            setMode('practice');
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-rose-500 transition"
        >
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-bold uppercase">错题本</span>
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {stats.wrong}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">点击攻克错题薄弱点 →</span>
        </div>

        {/* Unseen */}
        <div
          onClick={() => {
            setSelectedStatus('unseen');
            setMode('practice');
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-indigo-500 transition"
        >
          <div className="flex items-center justify-between text-indigo-500 mb-2">
            <span className="text-xs font-bold uppercase">未探索题目</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {stats.unseen}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">剩余待刷题数</span>
        </div>
      </div>

      {/* Category Mastery Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          各专业专题掌握率剖析
        </h3>

        <div className="space-y-3">
          {Object.entries(stats.categoryStats).map(([cat, cstat]) => {
            const pct = Math.round((cstat.mastered / (cstat.total || 1)) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {cat.replace(/^[一二三四五六七八九十]+、/, '')}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">
                      {cstat.mastered} / {cstat.total}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam History */}
      {progress.examHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            模拟考试战绩记录
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">日期时间</th>
                  <th className="py-2.5 px-3">考察范围</th>
                  <th className="py-2.5 px-3">题量</th>
                  <th className="py-2.5 px-3">用时</th>
                  <th className="py-2.5 px-3">得分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {progress.examHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">{item.category === 'All' ? '综合摸底' : item.category}</td>
                    <td className="py-2.5 px-3">{item.totalQuestions} 道</td>
                    <td className="py-2.5 px-3 font-mono">
                      {Math.floor(item.timeSpentSeconds / 60)}分{item.timeSpentSeconds % 60}秒
                    </td>
                    <td className="py-2.5 px-3 font-bold font-mono">
                      <span
                        className={
                          item.score >= 80
                            ? 'text-emerald-500'
                            : item.score >= 60
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }
                      >
                        {item.score} 分
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Backup and Data Actions */}
      <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            学习进度数据云端/本地管理
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            导出备份文件可以在任何电脑或手机浏览器间迁移你的刷题记录与手写草稿
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            导出进度 JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 transition shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            导入已有备份
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-600 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置进度
          </button>
        </div>
      </div>
    </div>
  );
};
