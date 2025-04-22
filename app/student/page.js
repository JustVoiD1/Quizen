'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quiz/all');
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Link
            key={quiz._id}
            href={`/student/${quiz._id}`}
            className="block p-4 border rounded shadow hover:bg-gray-100 transition"
          >
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
