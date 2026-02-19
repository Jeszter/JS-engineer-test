'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizService } from '@/services/api';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  order: number;
  booleanCorrect?: 'true' | 'false';
  inputCorrect?: string;
  options?: QuestionOption[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    text: '',
    type: 'INPUT',
    order: 0,
    inputCorrect: '',
    options: []
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      type: 'INPUT',
      order: questions.length,
      inputCorrect: '',
      options: []
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = {...updated[index], [field]: value};
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options!.push({
      id: Date.now().toString(),
      text: '',
      isCorrect: false
    });
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options![optionIndex] = {
        ...updated[questionIndex].options![optionIndex],
        [field]: value
      };
    }
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options = updated[questionIndex].options!.filter((_, i) => i !== optionIndex);
    }
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    const validQuestions = questions.filter(q => q.text.trim() !== '');
    if (validQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    for (const q of validQuestions) {
      if (q.type === 'BOOLEAN' && !q.booleanCorrect) {
        alert(`Please select correct answer (True/False) for question: "${q.text}"`);
        return;
      }
      if (q.type === 'INPUT' && !q.inputCorrect?.trim()) {
        alert(`Please enter correct answer for question: "${q.text}"`);
        return;
      }
      if (q.type === 'CHECKBOX') {
        const hasCorrect = q.options?.some(opt => opt.isCorrect);
        if (!hasCorrect) {
          alert(`Please mark at least one correct option for question: "${q.text}"`);
          return;
        }
        const hasEmptyOption = q.options?.some(opt => !opt.text.trim());
        if (hasEmptyOption) {
          alert(`Please fill in all option texts for question: "${q.text}"`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const quizData = {
        title: title.trim(),
        questions: validQuestions.map((q, idx) => {
          const baseQuestion = {
            text: q.text,
            type: q.type,
            order: idx
          };

          switch (q.type) {
            case 'BOOLEAN':
              return {
                ...baseQuestion,
                correctAnswer: q.booleanCorrect
              };
            case 'INPUT':
              return {
                ...baseQuestion,
                correctAnswer: q.inputCorrect?.trim()
              };
            case 'CHECKBOX':
              return {
                ...baseQuestion,
                options: q.options?.map(opt => ({
                  id: opt.id,
                  text: opt.text,
                  isCorrect: opt.isCorrect
                })),
                correctAnswer: q.options
                    ?.filter(opt => opt.isCorrect)
                    .map(opt => opt.id)
              };
            default:
              return baseQuestion;
          }
        })
      };

      console.log('📤 Sending:', quizData);
      await quizService.createQuiz(quizData);
      router.push('/quizzes');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(error.response?.data?.error || 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto fade-in">
        <h1 className="text-3xl font-bold gradient-text mb-6">
          Create New Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <label className="block text-sm font-medium text-[#605550] mb-2">
              Quiz Title
            </label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter quiz title..."
                required
            />
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
                <div key={index} className="card relative">
                  {questions.length > 1 && (
                      <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="absolute top-4 right-4 text-[#95867B] hover:text-[#605550] transition-colors"
                      >
                        <FiTrash2 size={18}/>
                      </button>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#605550] mb-2">
                      Question {index + 1}
                    </label>
                    <input
                        type="text"
                        value={q.text}
                        onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                        className="input-field"
                        placeholder="Enter your question"
                        required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#605550] mb-2">
                      Question Type
                    </label>
                    <select
                        value={q.type}
                        onChange={(e) => {
                          const newType = e.target.value as 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
                          const updated = [...questions];
                          updated[index] = {
                            text: q.text,
                            type: newType,
                            order: q.order,
                            booleanCorrect: newType === 'BOOLEAN' ? 'true' : undefined,
                            inputCorrect: newType === 'INPUT' ? '' : undefined,
                            options: newType === 'CHECKBOX' ? [] : undefined
                          };
                          setQuestions(updated);
                        }}
                        className="input-field"
                    >
                      <option value="INPUT">Text Input</option>
                      <option value="BOOLEAN">True/False</option>
                      <option value="CHECKBOX">Checkbox</option>
                    </select>
                  </div>

                  {q.type === 'BOOLEAN' && (
                      <div className="bg-[#DDC5B1]/20 rounded-lg p-4 border border-[#95867B]/20">
                        <label className="block text-sm font-medium text-[#605550] mb-3">
                          Correct Answer
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={`boolean-${index}`}
                                value="true"
                                checked={q.booleanCorrect === 'true'}
                                onChange={(e) => updateQuestion(index, 'booleanCorrect', e.target.value as 'true')}
                                className="w-4 h-4 text-[#605550] accent-[#605550]"
                            />
                            <span className="text-[#605550]">True</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={`boolean-${index}`}
                                value="false"
                                checked={q.booleanCorrect === 'false'}
                                onChange={(e) => updateQuestion(index, 'booleanCorrect', e.target.value as 'false')}
                                className="w-4 h-4 text-[#605550] accent-[#605550]"
                            />
                            <span className="text-[#605550]">False</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {q.type === 'INPUT' && (
                      <div className="bg-[#DDC5B1]/20 rounded-lg p-4 border border-[#95867B]/20">
                        <label className="block text-sm font-medium text-[#605550] mb-2">
                          Correct Answer
                        </label>
                        <input
                            type="text"
                            value={q.inputCorrect || ''}
                            onChange={(e) => updateQuestion(index, 'inputCorrect', e.target.value)}
                            className="input-field"
                            placeholder="Enter the correct answer"
                        />
                      </div>
                  )}

                  {q.type === 'CHECKBOX' && (
                      <div className="bg-[#DDC5B1]/20 rounded-lg p-4 border border-[#95867B]/20">
                        <label className="block text-sm font-medium text-[#605550] mb-3">
                          Options (check correct ones)
                        </label>

                        {q.options?.map((opt, optIndex) => (
                            <div key={opt.id} className="flex items-center space-x-3 mb-3">
                              <input
                                  type="checkbox"
                                  checked={opt.isCorrect}
                                  onChange={(e) => updateOption(index, optIndex, 'isCorrect', e.target.checked)}
                                  className="w-4 h-4 text-[#605550] accent-[#605550] rounded"
                              />
                              <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => updateOption(index, optIndex, 'text', e.target.value)}
                                  className="flex-1 input-field"
                                  placeholder={`Option ${optIndex + 1}`}
                              />
                              <button
                                  type="button"
                                  onClick={() => removeOption(index, optIndex)}
                                  className="text-[#95867B] hover:text-[#605550]"
                              >
                                <FiTrash2 size={16}/>
                              </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => addOption(index)}
                            className="mt-2 text-sm text-[#605550] hover:text-[#95867B] flex items-center space-x-1"
                        >
                          <FiPlus size={16}/>
                          <span>Add Option</span>
                        </button>
                      </div>
                  )}
                </div>
            ))}

            <button
                type="button"
                onClick={addQuestion}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <FiPlus size={18}/>
              <span>Add Question</span>
            </button>
          </div>

          <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>
  );
}