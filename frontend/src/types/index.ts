export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  options?: any[];
  correctAnswer?: string | string[];
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuizDto {
  title: string;
  questions: Omit<Question, 'id'>[];
}