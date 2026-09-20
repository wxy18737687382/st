import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  Question,
  UserProgress,
  MasteryStatus,
  StudyMode,
  Difficulty,
  QuestionType,
  PlatformMode,
  ExamResult,
  SubmissionRecord,
} from '../types/quiz';
import rawQuestions from '../data/questions.json';

interface QuizContextType {
  questions: Question[];
  currentQuestion: Question | null;
  currentIndex: number;
  filteredQuestions: Question[];

  // Navigation
  setCurrentQuestionId: (id: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  randomQuestion: () => void;

  // Filters
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  selectedDifficulty: Difficulty | 'All';
  setSelectedDifficulty: (diff: Difficulty | 'All') => void;
  selectedType: QuestionType | 'All';
  setSelectedType: (type: QuestionType | 'All') => void;
  selectedStatus: MasteryStatus | 'All' | 'favorite';
  setSelectedStatus: (status: MasteryStatus | 'All' | 'favorite') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // User Progress & Actions
  progress: UserProgress;
  setMasteryStatus: (id: string, status: MasteryStatus) => void;
  toggleFavorite: (id: string) => void;
  saveUserNote: (id: string, note: string) => void;
  saveScratchCode: (id: string, code: string) => void;
  saveExamResult: (result: ExamResult) => void;
  addSubmission: (id: string, record: SubmissionRecord) => void;
  submitChoiceAnswer: (id: string, choiceKey: string) => boolean;
  resetAllProgress: () => void;
  exportProgressJson: () => string;
  importProgressJson: (jsonStr: string) => boolean;

  // App Modes & Layout
  mode: StudyMode;
  setMode: (mode: StudyMode) => void;
  platformMode: PlatformMode;
  setPlatformMode: (p: PlatformMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Timer
  timerSeconds: number;
  isTimerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;

  // Stats
  stats: {
    total: number;
    mastered: number;
    vague: number;
    wrong: number;
    unseen: number;
    favorites: number;
    masteryPercentage: number;
    categoryStats: Record<string, { total: number; mastered: number; wrong: number }>;
  };
}

const STORAGE_KEY = 'algo_quiz_user_progress_v2';
const THEME_KEY = 'algo_quiz_theme';

const initialProgress: UserProgress = {
  status: {},
  favorites: [],
  userNotes: {},
  scratchCode: {},
  examHistory: [],
  submissions: {},
  choiceAnswers: {},
};

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const questions: Question[] = useMemo(() => rawQuestions as Question[], []);

  // Persistent progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialProgress,
          ...parsed,
          submissions: parsed.submissions || {},
          choiceAnswers: parsed.choiceAnswers || {},
        };
      }
      return initialProgress;
    } catch {
      return initialProgress;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return true; // Default to dark mode like LeetCode dark!
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // App Modes (default 'workbench' for LeetCode official problem view)
  const [mode, setMode] = useState<StudyMode>('workbench');
  const [platformMode, setPlatformMode] = useState<PlatformMode>('auto');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedType, setSelectedType] = useState<QuestionType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<MasteryStatus | 'All' | 'favorite'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(r => !r);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'All' && q.subcategory !== selectedSubcategory) return false;
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'All' && q.type !== selectedType) return false;

      const currentStatus = progress.status[q.id] || 'unseen';
      if (selectedStatus === 'favorite') {
        if (!progress.favorites.includes(q.id)) return false;
      } else if (selectedStatus !== 'All') {
        if (currentStatus !== selectedStatus) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = q.title.toLowerCase().includes(query);
        const inTags = q.tags.some(t => t.toLowerCase().includes(query));
        const inCode = q.code ? q.code.toLowerCase().includes(query) : false;
        const inAnswer = q.standardAnswer ? q.standardAnswer.toLowerCase().includes(query) : false;
        const inExpl = q.explanation ? q.explanation.toLowerCase().includes(query) : false;
        if (!inTitle && !inTags && !inCode && !inAnswer && !inExpl) return false;
      }

      return true;
    });
  }, [questions, selectedCategory, selectedSubcategory, selectedDifficulty, selectedType, selectedStatus, searchQuery, progress]);

  // Current Question
  const [currentId, setCurrentId] = useState<string>(() => {
    return progress.lastVisitedId || (questions[0] ? questions[0].id : '');
  });

  const currentQuestion = useMemo(() => {
    return questions.find(q => q.id === currentId) || filteredQuestions[0] || questions[0] || null;
  }, [questions, currentId, filteredQuestions]);

  const currentIndex = useMemo(() => {
    if (!currentQuestion) return -1;
    return filteredQuestions.findIndex(q => q.id === currentQuestion.id);
  }, [filteredQuestions, currentQuestion]);

  const setCurrentQuestionId = (id: string) => {
    setCurrentId(id);
    setProgress(prev => ({ ...prev, lastVisitedId: id }));
  };

  const nextQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredQuestions.length;
    setCurrentQuestionId(filteredQuestions[nextIdx].id);
  };

  const prevQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
    setCurrentQuestionId(filteredQuestions[prevIdx].id);
  };

  const randomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randIdx = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestionId(filteredQuestions[randIdx].id);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  // Progress actions
  const setMasteryStatus = (id: string, status: MasteryStatus) => {
    setProgress(prev => ({
      ...prev,
      status: { ...prev.status, [id]: status },
    }));
  };

  const toggleFavorite = (id: string) => {
    setProgress(prev => {
      const exists = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: exists ? prev.favorites.filter(fid => fid !== id) : [...prev.favorites, id],
      };
    });
  };

  const saveUserNote = (id: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      userNotes: { ...prev.userNotes, [id]: note },
    }));
  };

  const saveScratchCode = (id: string, code: string) => {
    setProgress(prev => ({
      ...prev,
      scratchCode: { ...prev.scratchCode, [id]: code },
    }));
  };

  const saveExamResult = (result: ExamResult) => {
    setProgress(prev => ({
      ...prev,
      examHistory: [result, ...prev.examHistory],
    }));
  };

  const addSubmission = (id: string, record: SubmissionRecord) => {
    setProgress(prev => ({
      ...prev,
      submissions: {
        ...prev.submissions,
        [id]: [record, ...(prev.submissions[id] || [])],
      },
    }));
  };

  const submitChoiceAnswer = (id: string, choiceKey: string): boolean => {
    const q = questions.find(item => item.id === id);
    if (!q || !q.correctAnswer) return false;

    const isCorrect = q.correctAnswer.trim().toUpperCase() === choiceKey.trim().toUpperCase();
    setProgress(prev => ({
      ...prev,
      choiceAnswers: { ...prev.choiceAnswers, [id]: choiceKey },
      status: {
        ...prev.status,
        [id]: isCorrect ? 'mastered' : 'wrong',
      },
    }));
    return isCorrect;
  };

  const resetAllProgress = () => {
    setProgress(initialProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportProgressJson = () => {
    return JSON.stringify(progress, null, 2);
  };

  const importProgressJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data && typeof data === 'object') {
        setProgress({
          ...initialProgress,
          ...data,
        });
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = questions.length;
    let mastered = 0;
    let vague = 0;
    let wrong = 0;
    const catStats: Record<string, { total: number; mastered: number; wrong: number }> = {};

    questions.forEach(q => {
      if (!catStats[q.category]) {
        catStats[q.category] = { total: 0, mastered: 0, wrong: 0 };
      }
      catStats[q.category].total += 1;

      const st = progress.status[q.id];
      if (st === 'mastered') {
        mastered += 1;
        catStats[q.category].mastered += 1;
      } else if (st === 'vague') {
        vague += 1;
      } else if (st === 'wrong') {
        wrong += 1;
        catStats[q.category].wrong += 1;
      }
    });

    const unseen = total - mastered - vague - wrong;
    const masteryPercentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return {
      total,
      mastered,
      vague,
      wrong,
      unseen,
      favorites: progress.favorites.length,
      masteryPercentage,
      categoryStats: catStats,
    };
  }, [questions, progress]);

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentQuestion,
        currentIndex,
        filteredQuestions,
        setCurrentQuestionId,
        nextQuestion,
        prevQuestion,
        randomQuestion,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedDifficulty,
        setSelectedDifficulty,
        selectedType,
        setSelectedType,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        clearFilters,
        progress,
        setMasteryStatus,
        toggleFavorite,
        saveUserNote,
        saveScratchCode,
        saveExamResult,
        addSubmission,
        submitChoiceAnswer,
        resetAllProgress,
        exportProgressJson,
        importProgressJson,
        mode,
        setMode,
        platformMode,
        setPlatformMode,
        isDarkMode,
        toggleDarkMode,
        timerSeconds,
        isTimerRunning,
        toggleTimer,
        resetTimer,
        stats,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
