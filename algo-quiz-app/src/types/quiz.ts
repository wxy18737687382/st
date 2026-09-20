export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 'algorithm' | 'theory' | 'code' | 'math' | 'system' | 'sql' | 'logic' | 'choice';

export type MasteryStatus = 'unseen' | 'vague' | 'mastered' | 'wrong';

export interface ChoiceOption {
  key: string;
  text: string;
}

export interface SubmissionRecord {
  id: string;
  timestamp: number;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
  runtime: string;
  memory: string;
  code?: string;
  language: string;
}

export interface Question {
  id: string;
  qid: number;
  title: string;
  category: string;
  subcategory: string;
  type: QuestionType;
  difficulty: Difficulty;
  tags: string[];
  code?: string;
  codeTemplate?: string;
  keyPoints?: string[];
  standardAnswer?: string;
  leetcodeId?: number;
  leetcodeUrl?: string;
  options?: ChoiceOption[];
  correctAnswer?: string;
  explanation?: string;
  acceptanceRate?: string;
  companyTags?: string[];
}

export interface UserProgress {
  status: Record<string, MasteryStatus>; // questionId -> status
  favorites: string[];                  // array of questionIds
  userNotes: Record<string, string>;     // questionId -> personal note
  scratchCode: Record<string, string>;   // questionId -> user draft code
  lastVisitedId?: string;
  examHistory: ExamResult[];
  submissions: Record<string, SubmissionRecord[]>; // questionId -> list of submissions
  choiceAnswers: Record<string, string>; // questionId -> chosen option ('A', 'B', etc.)
}

export interface ExamResult {
  id: string;
  timestamp: number;
  totalQuestions: number;
  score: number;
  timeSpentSeconds: number;
  category: string;
  questionIds: string[];
  answers: Record<string, MasteryStatus>;
}

export type StudyMode = 'workbench' | 'problems' | 'practice' | 'flashcard' | 'exam' | 'stats' | 'code-sandbox';

export type PlatformMode = 'auto' | 'pc' | 'mobile';
