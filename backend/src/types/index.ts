export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface CreateQuestionDto {
    text: string;
    type: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string | string[];
    order: number;
}

export interface CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[];
}

export interface QuizResponse {
    id: string;
    title: string;
    questions: QuestionResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionResponse {
    id: string;
    text: string;
    type: QuestionType;
    options?: QuestionOption[];
    correctAnswer?: string | string[];
    order: number;
}

export interface QuizListItem {
    id: string;
    title: string;
    questionCount: number;
    createdAt: Date;
}