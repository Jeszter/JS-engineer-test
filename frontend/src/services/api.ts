import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizService = {
  createQuiz: async (data: any) => {
    const response = await api.post('/quizzes', data);
    return response.data;
  },

  getQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getQuizById: async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  deleteQuiz: async (id: string) => {
    await api.delete(`/quizzes/${id}`);
  },
};