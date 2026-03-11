export interface Option {
  id: string;
  text: string;
  image?: string;
}

export interface Question {
  id: number;
  questionText: string;
  questionImage: string | null;
  options: Option[];
  correctOptionId: string;
  explanationText: string;
  explanationImage: string | null;
}

export type ScreenState = "landing" | "exam" | "result";

export interface ExamState {
  userName: string;
  startTime: number | null;
  endTime: number | null;
  answers: Record<number, string>; // questionId -> optionId
}
