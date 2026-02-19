'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { quizService } from '@/services/api';
import { FiArrowLeft } from 'react-icons/fi';

interface Question {
    id: string;
    text: string;
    type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
    options?: { id: string; text: string; isCorrect: boolean }[];
    correctAnswer?: string | string[];
}

interface Quiz {
    id: string;
    title: string;
    questions: Question[];
}

export default function TakeQuizPage() {
    const params = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuiz();
    }, [params.id]);

    const loadQuiz = async () => {
        try {
            const data = await quizService.getQuizById(params.id as string);
            setQuiz(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: string, value: any) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleCheckboxAnswer = (questionId: string, optionId: string, checked: boolean) => {
        const currentAnswers = answers[questionId] || [];
        if (checked) {
            setAnswers({ ...answers, [questionId]: [...currentAnswers, optionId] });
        } else {
            setAnswers({ ...answers, [questionId]: currentAnswers.filter((id: string) => id !== optionId) });
        }
    };

    const checkAnswer = (question: Question, userAnswer: any): boolean => {
        if (!userAnswer) return false;

        switch (question.type) {
            case 'BOOLEAN':
                return userAnswer === question.correctAnswer;
            case 'INPUT':
                return userAnswer.toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
            case 'CHECKBOX':
                const correctOptions = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id) || [];
                const userOptions = userAnswer || [];
                return correctOptions.length === userOptions.length &&
                    correctOptions.every(id => userOptions.includes(id));
            default:
                return false;
        }
    };

    const handleSubmit = () => {
        if (!quiz) return;

        let correct = 0;
        quiz.questions.forEach(q => {
            if (checkAnswer(q, answers[q.id])) {
                correct++;
            }
        });

        setScore({ correct, total: quiz.questions.length });
        setShowResults(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
                <Link href="/quizzes" className="text-indigo-600 hover:text-indigo-700">
                    Back to Quizzes
                </Link>
            </div>
        );
    }

    if (showResults) {
        const percentage = Math.round((score.correct / score.total) * 100);

        return (
            <div className="max-w-2xl mx-auto">
                <div className="card">
                    <h1 className="text-3xl font-bold gradient-text mb-2">{quiz.title} - Results</h1>
                    <div className="text-5xl font-bold text-indigo-600 mb-4">
                        {score.correct}/{score.total}
                    </div>
                    <p className="text-xl text-gray-600 mb-6">
                        You scored {percentage}% - {percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
                    </p>

                    <div className="space-y-4 mb-6">
                        {quiz.questions.map((q, idx) => {
                            const isCorrect = checkAnswer(q, answers[q.id]);
                            return (
                                <div key={q.id} className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className="font-medium mb-2">Question {idx + 1}: {q.text}</p>
                                    <p className="text-sm">
                                        Your answer: {JSON.stringify(answers[q.id])}
                                        {!isCorrect && (
                                            <span className="block text-green-600 mt-1">
                                                Correct answer: {JSON.stringify(q.correctAnswer)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex space-x-4">
                        <Link href="/quizzes" className="flex-1 btn-secondary text-center">
                            Back to Quizzes
                        </Link>
                        <button
                            onClick={() => {
                                setAnswers({});
                                setShowResults(false);
                            }}
                            className="flex-1 btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/quizzes" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
                <FiArrowLeft className="mr-2" />
                Back to Quizzes
            </Link>

            <div className="card mb-6">
                <h1 className="text-3xl font-bold gradient-text mb-1">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.questions.length} questions</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {quiz.questions.map((q, idx) => (
                    <div key={q.id} className="card mb-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {idx + 1}. {q.text}
                        </h3>

                        {q.type === 'INPUT' && (
                            <input
                                type="text"
                                value={answers[q.id] || ''}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                className="input-field"
                                placeholder="Type your answer..."
                            />
                        )}

                        {q.type === 'BOOLEAN' && (
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value="true"
                                        checked={answers[q.id] === 'true'}
                                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <span className="text-lg">True</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value="false"
                                        checked={answers[q.id] === 'false'}
                                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                                        className="w-4 h-4 text-indigo-600"
                                    />
                                    <span className="text-lg">False</span>
                                </label>
                            </div>
                        )}

                        {q.type === 'CHECKBOX' && q.options && (
                            <div className="space-y-2">
                                {q.options.map((opt) => (
                                    <label key={opt.id} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={(answers[q.id] || []).includes(opt.id)}
                                            onChange={(e) => handleCheckboxAnswer(q.id, opt.id, e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded"
                                        />
                                        <span className="text-gray-700">{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full btn-primary"
                >
                    Submit Answers
                </button>
            </form>
        </div>
    );
}