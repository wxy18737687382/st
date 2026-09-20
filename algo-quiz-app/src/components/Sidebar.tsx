import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  Brain,
  Sparkles,
  Bot,
  PieChart,
  Layers,
  HelpCircle,
  Database,
  Terminal,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    questions,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedStatus,
    setSelectedStatus,
    stats,
  } = useQuiz();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [selectedCategory]: true,
  });

  // Extract unique categories & subcategories from dataset
  const categoryTree = React.useMemo(() => {
    const tree: Record<string, { total: number; subcategories: Record<string, number> }> = {};
    questions.forEach(q => {
      if (!tree[q.category]) {
        tree[q.category] = { total: 0, subcategories: {} };
      }
      tree[q.category].total += 1;
      tree[q.category].subcategories[q.subcategory] = (tree[q.category].subcategories[q.subcategory] || 0) + 1;
    });
    return tree;
  }, [questions]);

  // Icons for major categories
  const getCategoryIcon = (cat: string) => {
    if (cat.includes('LeetCode') || cat.includes('编程')) return <Code2 className="w-4 h-4 text-sky-500" />;
    if (cat.includes('机器学习')) return <Cpu className="w-4 h-4 text-indigo-500" />;
    if (cat.includes('深度学习')) return <Brain className="w-4 h-4 text-purple-500" />;
    if (cat.includes('大模型') || cat.includes('LLM')) return <Sparkles className="w-4 h-4 text-amber-500" />;
    if (cat.includes('多模态')) return <Layers className="w-4 h-4 text-cyan-500" />;
    if (cat.includes('强化学习')) return <Bot className="w-4 h-4 text-pink-500" />;
    if (cat.includes('数学') || cat.includes('概率')) return <PieChart className="w-4 h-4 text-emerald-500" />;
    if (cat.includes('手撕代码')) return <Terminal className="w-4 h-4 text-red-500" />;
    if (cat.includes('SQL') || cat.includes('基础')) return <Database className="w-4 h-4 text-blue-500" />;
    if (cat.includes('智力') || cat.includes('逻辑')) return <HelpCircle className="w-4 h-4 text-yellow-500" />;
    return <BookOpen className="w-4 h-4 text-slate-500" />;
  };

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('All');
    setExpandedCategories(prev => ({ ...prev, [cat]: true }));
    if (onClose) onClose();
  };

  const handleSelectSub = (cat: string, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-80 shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Header: Quick status shortcuts */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          状态速查
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === 'All'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-750'
            }`}
          >
            <span>全部题目</span>
            <span className="opacity-80 font-mono">{stats.total}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('mastered')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === 'mastered'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60'
            }`}
          >
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              已掌握
            </span>
            <span className="opacity-80 font-mono">{stats.mastered}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('wrong')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === 'wrong'
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60'
            }`}
          >
            <span className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-500" />
              错题本
            </span>
            <span className="opacity-80 font-mono">{stats.wrong}</span>
          </button>

          <button
            onClick={() => setSelectedStatus('favorite')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === 'favorite'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60'
            }`}
          >
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-500" />
              我的收藏
            </span>
            <span className="opacity-80 font-mono">{stats.favorites}</span>
          </button>
        </div>
      </div>

      {/* Categories & Subcategories Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <div className="px-2 py-1 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>专题模块</span>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-[11px] normal-case text-emerald-600 hover:underline"
          >
            查看全部
          </button>
        </div>

        {Object.entries(categoryTree).map(([cat, data]) => {
          const isSelected = selectedCategory === cat;
          const isExpanded = expandedCategories[cat];
          const catStat = stats.categoryStats[cat] || { total: data.total, mastered: 0, wrong: 0 };
          const progressPercent = Math.round((catStat.mastered / (catStat.total || 1)) * 100);

          return (
            <div key={cat} className="rounded-xl overflow-hidden">
              {/* Category Main Row */}
              <div
                className={`group flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  className="flex items-center gap-2 flex-1 truncate"
                  onClick={() => handleSelectCategory(cat)}
                >
                  {getCategoryIcon(cat)}
                  <span className="truncate">{cat.replace(/^[一二三四五六七八九十]+、/, '')}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {catStat.mastered}/{data.total}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleCategoryExpand(cat);
                    }}
                    className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Category Mini Progress Bar */}
              <div className="mx-2.5 my-0.5 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <div className="ml-4 pl-2 my-1 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                  {Object.entries(data.subcategories).map(([sub, count]) => {
                    const isSubSelected = isSelected && selectedSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => handleSelectSub(cat, sub)}
                        className={`w-full flex items-center justify-between px-2 py-1 text-[11px] rounded-md transition-colors text-left ${
                          isSubSelected
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{sub}</span>
                        <span className="font-mono opacity-70 ml-1 shrink-0">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Overall Stats */}
      <div className="p-3 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400 font-medium">总掌握度</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.masteryPercentage}% ({stats.mastered}/{stats.total})
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${stats.masteryPercentage}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
