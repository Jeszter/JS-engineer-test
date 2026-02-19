'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { quizService } from '@/services/api';
import { FiEye, FiTrash2, FiPlus } from 'react-icons/fi';

interface Quiz {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete quiz');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-[#605550]">Loading...</div>
        </div>
    );
  }

  return (
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold gradient-text">My Quizzes</h1>
          <Link href="/create" className="btn-primary flex items-center space-x-2">
            <FiPlus size={18} />
            <span>New Quiz</span>
          </Link>
        </div>

        {quizzes.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-[#605550] mb-4">No quizzes yet</p>
              <Link href="/create" className="btn-primary inline-block">
                Create Your First Quiz
              </Link>
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                  <div key={quiz.id} className="card">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-[#605550]">{quiz.title}</h2>
                      <button
                          onClick={() => handleDelete(quiz.id)}
                          className="text-[#95867B] hover:text-[#605550] transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <p className="text-sm text-[#95867B] mb-4">
                      {quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'}
                    </p>

                    <div className="flex space-x-3">
                      <Link
                          href={`/quizzes/${quiz.id}`}
                          className="flex-1 btn-secondary text-center text-sm py-2"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}