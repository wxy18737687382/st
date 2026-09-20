import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Lightbulb,
  History,
  Edit3,
  Bookmark,
  BookmarkCheck,
  Play,
  Send,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Building2,
  TrendingUp,
  Award,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuiz } from '../context/QuizContext';
import { MathMarkdown } from './MathMarkdown';
import { ChoiceExamWorkbench } from './ChoiceExamWorkbench';

export const LeetCodeWorkbench: React.FC = () => {
  const {
    currentQuestion,
    nextQuestion,
    progress,
    toggleFavorite,
    saveUserNote,
    saveScratchCode,
    setMasteryStatus,
    addSubmission,
  } = useQuiz();

  // If choice question, immediately render dedicated ChoiceExamWorkbench
  if (currentQuestion && currentQuestion.type === 'choice') {
    return <ChoiceExamWorkbench />;
  }

  // Tabs
  const [activeTab, setActiveTab] = useState<'desc' | 'solution' | 'submissions' | 'notes'>('desc');
  const [language, setLanguage] = useState<'python3' | 'pytorch' | 'sql' | 'cpp'>('python3');
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'case1' | 'case2' | 'result'>('case1');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Editor code
  const [editorCode, setEditorCode] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load code template or saved draft when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    const draft = progress.scratchCode[currentQuestion.id];
    if (draft) {
      setEditorCode(draft);
    } else if (currentQuestion.code) {
      setEditorCode(currentQuestion.code);
    } else if (currentQuestion.codeTemplate) {
      setEditorCode(currentQuestion.codeTemplate);
    } else {
      setEditorCode(
        `class Solution:\n    def solve(self):\n        # 在此编写针对【${currentQuestion.title}】的解题代码\n        pass\n`
      );
    }
    setActiveTab('desc');
    setConsoleOutput('');
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const isFavorite = progress.favorites.includes(currentQuestion.id);
  const submissions = progress.submissions[currentQuestion.id] || [];

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = editorCode.substring(0, start) + '    ' + editorCode.substring(end);
      setEditorCode(newCode);
      saveScratchCode(currentQuestion.id, newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorCode(val);
    saveScratchCode(currentQuestion.id, val);
  };

  const handleResetCode = () => {
    if (confirm('确定重置代码为初始模板吗？')) {
      const initial =
        currentQuestion.code ||
        currentQuestion.codeTemplate ||
        `class Solution:\n    def solve(self):\n        pass\n`;
      setEditorCode(initial);
      saveScratchCode(currentQuestion.id, initial);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Code simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setIsConsoleOpen(true);
    setConsoleTab('result');
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(
        `✓ 测试用例全部通过！\n输入: [2, 7, 11, 15], target = 9\n输出: [0, 1]\n预期结果: [0, 1]\n\n执行时间: 24 ms\n内存消耗: 16.4 MB`
      );
    }, 600);
  };

  // Submit Code simulation
  const handleSubmitCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const runtime = `${Math.floor(Math.random() * 20 + 25)} ms`;
      const memory = `${(16.1 + Math.random()).toFixed(1)} MB`;
      const record = {
        id: `sub-${Date.now()}`,
        timestamp: Date.now(),
        status: 'Accepted' as const,
        runtime,
        memory,
        code: editorCode,
        language,
      };
      addSubmission(currentQuestion.id, record);
      setMasteryStatus(currentQuestion.id, 'mastered');
      setLatestSubmission(record);
      setShowAcceptedModal(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 800);
  };

  // Difficulty badge styling
  const diffBadgeColor = {
    Easy: 'text-[#00b8a3] bg-[#00b8a3]/10 border-[#00b8a3]/20',
    Medium: 'text-[#ffc01e] bg-[#ffc01e]/10 border-[#ffc01e]/20',
    Hard: 'text-[#ff375f] bg-[#ff375f]/10 border-[#ff375f]/20',
  }[currentQuestion.difficulty || 'Medium'];

  const linesCount = editorCode.split('\n').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-200">
      {/* Top WorkBench Split Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* LEFT PANEL: Problem Description, Solutions, Submissions, Notes */}
        <div className="lg:col-span-6 flex flex-col bg-white dark:bg-[#262626] rounded-xl border border-slate-200 dark:border-[#333] shadow-xs overflow-hidden">
          {/* Left Panel Tabs */}
          <div className="h-10 bg-slate-50 dark:bg-[#222] border-b border-slate-200 dark:border-[#333] flex items-center px-2 gap-1 text-xs select-none">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'desc'
                  ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>题目描述</span>
            </button>

            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'solution'
                  ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#ffa116]" />
              <span>题解 / 考点</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <History className="w-3.5 h-3.5 text-emerald-500" />
              <span>提交记录</span>
              {submissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] flex items-center justify-center font-bold">
                  {submissions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>答题笔记</span>
            </button>

            {/* Favorite button */}
            <div className="ml-auto flex items-center pr-1">
              <button
                onClick={() => toggleFavorite(currentQuestion.id)}
                className="p-1 rounded text-slate-400 hover:text-amber-500 transition"
                title={isFavorite ? '取消收藏' : '收藏此题'}
              >
                {isFavorite ? (
                  <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Left Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar text-xs sm:text-sm leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                {/* Problem Header: Title, difficulty badge, acceptance, tags */}
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
                    <MathMarkdown content={currentQuestion.title} />
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                    {/* Difficulty Pill */}
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border ${diffBadgeColor}`}>
                      {currentQuestion.difficulty === 'Easy' ? '简单' : currentQuestion.difficulty === 'Medium' ? '中等' : '困难'}
                    </span>

                    {/* Acceptance Rate */}
                    <span className="flex items-center gap-1 text-slate-400">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      通过率 {currentQuestion.acceptanceRate || '52.4%'}
                    </span>

                    {/* LeetCode outlink if present */}
                    {currentQuestion.leetcodeId && (
                      <a
                        href={`https://leetcode.cn/problems/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        力扣 #{currentQuestion.leetcodeId}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Company Tags */}
                  {currentQuestion.companyTags && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                        <Building2 className="w-3 h-3" /> 高频考察：
                      </span>
                      {currentQuestion.companyTags.map((co, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#333] text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                  <div className="mt-4 space-y-4 text-slate-800 dark:text-slate-200">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#222] border border-slate-200/80 dark:border-[#333]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        考察范围与要求
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        本题归属于专题 <strong>{currentQuestion.category}</strong> › <strong>{currentQuestion.subcategory}</strong>。
                        在校招与社招面试中，通常要求现场给出最优时间复杂度与空间复杂度，并能清晰阐述边界判断。
                      </p>
                    </div>

                    {currentQuestion.keyPoints && (
                      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
                          核心考点提示
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
                  </div>
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#333]">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-[#ffa116]" />
                    官方深度解析与复杂度分析
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">标准解法</span>
                </div>

                {currentQuestion.standardAnswer ? (
                  <MathMarkdown content={currentQuestion.standardAnswer} />
                ) : (
                  <p className="text-xs text-slate-400">暂无解析</p>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                  历史提交记录 ({submissions.length})
                </h3>
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    暂无提交记录，在右侧代码区编写后点击“提交”测试你的解法！
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-[#333]">
                    {submissions.map((sub, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#00b8a3]">{sub.status}</span>
                          <span className="text-slate-400">({sub.language})</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-slate-400">
                          <span>用时: {sub.runtime}</span>
                          <span>内存: {sub.memory}</span>
                          <span className="text-[10px]">
                            {new Date(sub.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  我的答题笔记 (自动云端/本地保存)
                </h3>
                <textarea
                  value={progress.userNotes[currentQuestion.id] || ''}
                  onChange={e => saveUserNote(currentQuestion.id, e.target.value)}
                  placeholder="在此记录本题的思考过程、面试技巧或易踩坑点..."
                  className="w-full h-80 p-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-xs sm:text-sm focus:outline-none focus:border-emerald-500 resize-y"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Testing Console */}
        <div className="lg:col-span-6 flex flex-col bg-white dark:bg-[#262626] rounded-xl border border-slate-200 dark:border-[#333] shadow-xs overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-10 bg-slate-50 dark:bg-[#222] border-b border-slate-200 dark:border-[#333] flex items-center justify-between px-3 text-xs select-none">
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="bg-slate-100 dark:bg-[#2d2d2d] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#3a3a3a] focus:outline-none font-mono"
              >
                <option value="python3">Python3</option>
                <option value="pytorch">PyTorch</option>
                <option value="sql">MySQL / SQL</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetCode}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333] transition"
                title="重置代码"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#333] transition"
                title="复制代码"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? '已复制' : '复制'}</span>
              </button>
            </div>
          </div>

          {/* Monaco / Code Editor Body */}
          <div className="flex-1 relative flex bg-[#1e1e1e] text-slate-100 font-mono text-xs overflow-hidden">
            {/* Line numbers gutter */}
            <div className="w-10 bg-[#1e1e1e] text-[#6e7681] text-right pr-2 select-none py-3 font-mono text-xs border-r border-[#333] opacity-60">
              {Array.from({ length: Math.max(linesCount, 18) }, (_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              ref={textareaRef}
              value={editorCode}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 bg-transparent text-[#9cdcfe] p-3 font-mono text-xs leading-5 resize-none focus:outline-none whitespace-pre overflow-auto custom-scrollbar"
            />
          </div>

          {/* Bottom Console Drawer */}
          {isConsoleOpen && (
            <div className="h-44 bg-slate-50 dark:bg-[#202020] border-t border-slate-200 dark:border-[#333] flex flex-col">
              {/* Console Header Tabs */}
              <div className="h-8 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#333] flex items-center justify-between px-3 text-xs select-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleTab('case1')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition ${
                      consoleTab === 'case1'
                        ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Case 1
                  </button>

                  <button
                    onClick={() => setConsoleTab('case2')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition ${
                      consoleTab === 'case2'
                        ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Case 2
                  </button>

                  <button
                    onClick={() => setConsoleTab('result')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition ${
                      consoleTab === 'result'
                        ? 'bg-white dark:bg-[#2d2d2d] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    执行结果
                  </button>
                </div>

                <button
                  onClick={() => setIsConsoleOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Console Content */}
              <div className="flex-1 p-3 overflow-y-auto text-xs font-mono custom-scrollbar text-slate-700 dark:text-slate-300">
                {consoleTab === 'case1' && (
                  <div className="space-y-1">
                    <div className="text-slate-400 text-[11px]">输入参数 (Input):</div>
                    <div className="p-2 bg-white dark:bg-[#1a1a1a] rounded border border-slate-200 dark:border-[#333]">
                      nums = [2, 7, 11, 15], target = 9
                    </div>
                  </div>
                )}
                {consoleTab === 'case2' && (
                  <div className="space-y-1">
                    <div className="text-slate-400 text-[11px]">输入参数 (Input):</div>
                    <div className="p-2 bg-white dark:bg-[#1a1a1a] rounded border border-slate-200 dark:border-[#333]">
                      nums = [3, 2, 4], target = 6
                    </div>
                  </div>
                )}
                {consoleTab === 'result' && (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-[#ffa116]">
                        <div className="w-3 h-3 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
                        <span>评测运行中 (Judging)...</span>
                      </div>
                    ) : consoleOutput ? (
                      <pre className="whitespace-pre-wrap text-emerald-600 dark:text-[#00b8a3]">
                        {consoleOutput}
                      </pre>
                    ) : (
                      <div className="text-slate-400">请点击右下角“运行”或“提交”执行代码</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editor Action Footer: Run & Submit */}
          <div className="h-12 bg-slate-50 dark:bg-[#222] border-t border-slate-200 dark:border-[#333] flex items-center justify-between px-3 select-none">
            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>控制台</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-[#333] hover:bg-slate-300 dark:hover:bg-[#3d3d3d] text-slate-800 dark:text-slate-200 transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>运行代码</span>
              </button>

              {/* LeetCode Classic Green Submit Button */}
              <button
                onClick={handleSubmitCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-xs font-bold bg-[#2db55d] hover:bg-[#22994b] text-white shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>提交</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode Official Accepted Modal */}
      {showAcceptedModal && latestSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-[#3a3a3a] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-[#00b8a3]/20 text-[#00b8a3] flex items-center justify-center mx-auto ring-4 ring-[#00b8a3]/30">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#00b8a3] tracking-tight">通过 (Accepted)</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                代码执行完成 · 全部测试用例通过
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 bg-slate-50 dark:bg-[#1f1f1f] rounded-xl border border-slate-200 dark:border-[#333]">
                <div className="text-[11px] text-slate-400">执行用时</div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {latestSubmission.runtime}
                </div>
                <div className="text-[10px] text-emerald-500 mt-0.5">击败 93.42% 的用户</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#1f1f1f] rounded-xl border border-slate-200 dark:border-[#333]">
                <div className="text-[11px] text-slate-400">消耗内存</div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {latestSubmission.memory}
                </div>
                <div className="text-[10px] text-emerald-500 mt-0.5">击败 88.15% 的用户</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAcceptedModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-[#3a3a3a] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#333] transition"
              >
                查看代码与详情
              </button>
              <button
                onClick={() => {
                  setShowAcceptedModal(false);
                  nextQuestion();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#00b8a3] hover:bg-[#00a390] text-slate-950 font-bold text-xs shadow-md transition"
              >
                下一题 (Next) →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
