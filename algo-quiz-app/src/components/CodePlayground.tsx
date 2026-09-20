import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import { Copy, Check, Code, Edit3, RotateCcw, Columns } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

interface CodePlaygroundProps {
  code: string;
  questionId: string;
  language?: string;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  code,
  questionId,
  language = 'python',
}) => {
  const { progress, saveScratchCode } = useQuiz();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'scratch' | 'diff'>('standard');
  const [userCode, setUserCode] = useState<string>(progress.scratchCode[questionId] || '');

  useEffect(() => {
    setUserCode(progress.scratchCode[questionId] || '');
  }, [questionId, progress.scratchCode]);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, userCode, activeTab]);

  const handleCopy = () => {
    const textToCopy = activeTab === 'scratch' ? userCode : code;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserCode(val);
    saveScratchCode(questionId, val);
  };

  const handleResetDraft = () => {
    if (confirm('确定清空当前题目的手写草稿吗？')) {
      setUserCode('');
      saveScratchCode(questionId, '');
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-[#1d1f21] shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>

          <button
            onClick={() => setActiveTab('standard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'standard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            标准实现
          </button>

          <button
            onClick={() => setActiveTab('scratch')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'scratch'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            手撕草稿
            {userCode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'diff'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            双栏对照
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'scratch' && (
            <button
              onClick={handleResetDraft}
              title="清空草稿"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制代码</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-0 text-sm font-mono">
        {activeTab === 'standard' && (
          <div className="overflow-x-auto max-h-[500px] p-4 text-[13px] leading-relaxed">
            <pre className="!bg-transparent !p-0 !m-0">
              <code className={`language-${language}`}>{code}</code>
            </pre>
          </div>
        )}

        {activeTab === 'scratch' && (
          <div className="p-3">
            <textarea
              value={userCode}
              onChange={handleUserCodeChange}
              placeholder="# 在这里尝试手写代码 (支持 Python / 算子实现)&#10;# 您的草稿将自动保存在本地..."
              className="w-full h-80 bg-slate-900/90 text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 resize-y leading-relaxed"
              spellCheck={false}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-slate-400 px-1">
              <span>共 {userCode.split('\n').length} 行代码</span>
              <span className="text-emerald-400">✓ 已自动保存到本地</span>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700 max-h-[500px] overflow-y-auto">
            {/* Standard code */}
            <div className="p-4 overflow-x-auto">
              <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                <Check className="w-3 h-3" /> 标准高频参考实现
              </div>
              <pre className="!bg-transparent !p-0 !m-0 text-xs leading-relaxed">
                <code className={`language-${language}`}>{code}</code>
              </pre>
            </div>
            {/* User code */}
            <div className="p-4 flex flex-col">
              <div className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 我的草稿 (可实时编辑)
              </div>
              <textarea
                value={userCode}
                onChange={handleUserCodeChange}
                placeholder="# 边看边手撕..."
                className="w-full flex-1 min-h-[300px] bg-slate-900/80 text-emerald-300 font-mono text-xs p-3 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
