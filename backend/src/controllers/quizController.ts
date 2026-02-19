import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateQuizDto } from '../types';
import { quizSchema } from '../validators/quizValidator';

const prisma = new PrismaClient();

export const createQuiz = async (req: Request, res: Response) => {
    try {
        console.log('📥 Received data:', JSON.stringify(req.body, null, 2));

        const validationResult = quizSchema.safeParse(req.body);

        if (!validationResult.success) {
            console.log('❌ Validation errors:', validationResult.error.errors);
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.errors
            });
        }

        const quizData: CreateQuizDto = validationResult.data;

        const quiz = await prisma.quiz.create({
            data: {
                title: quizData.title,
                questions: {
                    create: quizData.questions.map((q) => {
                        const questionData: any = {
                            text: q.text,
                            type: q.type,
                            order: q.order,
                        };

                        if (q.options) {
                            questionData.options = JSON.stringify(q.options);
                        }

                        if (q.correctAnswer) {
                            questionData.correctAnswer = JSON.stringify(q.correctAnswer);
                        }

                        return questionData;
                    }),
                },
            },
            include: {
                questions: true,
            },
        });

        console.log('✅ Quiz created:', quiz.id);
        res.status(201).json(quiz);
    } catch (error) {
        console.error('❌ Error creating quiz:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
};

export const getQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: {
                questions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const quizList = quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            questionCount: quiz.questions.length,
            createdAt: quiz.createdAt,
        }));

        res.json(quizList);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
};

export const getQuizById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const parsedQuiz = {
            ...quiz,
            questions: quiz.questions.map(q => ({
                ...q,
                options: q.options ? JSON.parse(q.options as string) : undefined,
                correctAnswer: q.correctAnswer ? JSON.parse(q.correctAnswer as string) : undefined,
            })),
        };

        res.json(parsedQuiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
};

export const deleteQuiz = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.quiz.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
};