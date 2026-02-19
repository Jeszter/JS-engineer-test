import { z } from 'zod';

const questionOptionSchema = z.object({
    id: z.string(),
    text: z.string().min(1, 'Option text is required'),
    isCorrect: z.boolean(),
});

const questionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    options: z.array(questionOptionSchema).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
    order: z.number().int().min(0),
}).refine((data) => {
    if (data.type === 'CHECKBOX') {
        return data.options && data.options.length > 0;
    }
    return true;
}, {
    message: 'Checkbox questions must have options',
    path: ['options'],
});

export const quizSchema = z.object({
    title: z.string().min(1, 'Quiz title is required'),
    questions: z.array(questionSchema).min(1, 'Quiz must have at least one question'),
});