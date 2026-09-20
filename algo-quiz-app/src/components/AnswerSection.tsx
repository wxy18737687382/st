import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, XCircle, Bookmark, BookmarkCheck, FileText } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { MathMarkdown } from './MathMarkdown';
import { CodePlayground } from './CodePlayground';

interface AnswerSectionProps {
  questionId: string;
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({ questionId }) => {
  const { currentQuestion, progress, setMasteryStatus, toggleFavorite, saveUserNote } = useQuiz();
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteContent, setNoteContent] = useState(progress.userNotes[questionId] || '');

  if (!currentQuestion) return null;

  const currentStatus = progress.status[questionId] || 'unseen';
  const isFavorite = progress.favorites.includes(questionId);

  const handleNoteSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteContent(val);
    saveUserNote(questionId, val);
  };

  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Answer */}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
              showAnswer
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnswer ? '折叠参考答案 (Space)' : '查看标准参考答案 (Space)'}</span>
          </button>

          {/* Toggle Favorite */}
          <button
            onClick={() => toggleFavorite(questionId)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="收藏此题"
          >
            {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFavorite ? '已收藏' : '收藏'}</span>
          </button>

          {/* Personal Note */}
          <button
            onClick={() => setShowNoteEditor(!showNoteEditor)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              showNoteEditor || progress.userNotes[questionId]
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="答题笔记"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">笔记</span>
            {progress.userNotes[questionId] && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
          </button>
        </div>

        {/* Mastery Status Marking */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 px-2 hidden md:inline">状态:</span>

          <button
            onClick={() => setMasteryStatus(questionId, 'mastered')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentStatus === 'mastered'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            已掌握
          </button>

          <button
            onClick={() => setMasteryStatus(questionId, 'vague')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentStatus === 'vague'
                ? 'bg-amber-500 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            生疏
          </button>

          <button
            onClick={() => setMasteryStatus(questionId, 'wrong')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentStatus === 'wrong'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            加入错题
          </button>
        </div>
      </div>

      {/* Note Editor Drawer */}
      {showNoteEditor && (
        <div className="mt-3 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> 我的备考笔记与心得 (自动保存)
            </span>
            <button
              onClick={() => setShowNoteEditor(false)}
              className="text-xs text-indigo-500 hover:text-indigo-700"
            >
              收起
            </button>
          </div>
          <textarea
            value={noteContent}
            onChange={handleNoteSave}
            placeholder="写下你自己的理解、踩过的坑或面试被追问的场景..."
            className="w-full h-24 p-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          />
        </div>
      )}

      {/* Key Points (Always visible or toggleable) */}
      {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            速记核心要点 (背题模式重点)
          </h4>
          <ul className="space-y-1.5">
            {currentQuestion.keyPoints.map((pt, idx) => (
              <li key={idx} className="text-sm text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hand-written Code Sandbox (if present) */}
      {currentQuestion.code && (
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">手撕算子代码参考与沙盒</h4>
          <CodePlayground code={currentQuestion.code} questionId={questionId} />
        </div>
      )}

      {/* Expanded Standard Answer */}
      {showAnswer && currentQuestion.standardAnswer && (
        <div className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              全真标准解析与面试官回答逻辑
            </h4>
            <span className="text-xs text-slate-400">已结合 2025-2026 大厂真题整理</span>
          </div>
          <MathMarkdown content={currentQuestion.standardAnswer} />
        </div>
      )}
    </div>
  );
};
