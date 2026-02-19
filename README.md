
# Quiz Builder

Full-Stack JS engineer test assessment - the Quiz Builder

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API framework
- **TypeScript** - Type safety and better developer experience
- **SQLite** - Lightweight database
- **Prisma ORM** - Database modeling and migrations
- **Zod** - Request validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** with **Next.js 15** - UI framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Form validation
- **Axios** - API requests
- **React Icons** - Icon library

### Installation & Setup

**1. Clone repository**
```bash
git clone https://github.com/Jeszter/JS-engineer-test
cd quiz-builder
```

**2. Backend**
```bash
cd backend
npm install
npm run prisma:migrate
npm run dev
# Server runs on http://localhost:3001
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

## 📁 Project Structure

```
quiz-builder/
├── backend/          # Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── validators/
│   └── prisma/
└── frontend/         # Next.js
    ├── src/
    │   ├── app/
    │   ├── services/
    │   └── types/
    └── public/
```

<img width="2559" height="1402" alt="изображение" src="https://github.com/user-attachments/assets/9fcc2628-4994-444c-86a6-70ee200c51bc" />

<img width="2559" height="1400" alt="изображение" src="https://github.com/user-attachments/assets/476a14b1-0699-487a-9a04-012d900db53d" />

## 📌 API Endpoints

- `POST /api/quizzes` - create quiz
- `GET /api/quizzes` - list all quizzes
- `GET /api/quizzes/:id` - get quiz details
- `DELETE /api/quizzes/:id` - delete quiz

## 🎯 Question Types

- **Boolean** - True/False
- **Input** - text answer
- **Checkbox** - multiple correct options

## 📝 Example: Create a Quiz

```bash
curl -X POST http://localhost:3001/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quiz",
    "questions": [{
      "text": "What is 2+2?",
      "type": "INPUT",
      "correctAnswer": "4",
      "order": 0
    }]
  }'
```

## 🛠 Available Scripts

### Backend
```bash
npm run dev        # start development server
npm run build      # build for production
npm run prisma:studio # open database UI
```

### Frontend
```bash
npm run dev        # start development server
npm run build      # build for production
npm run lint       # run linter
```

