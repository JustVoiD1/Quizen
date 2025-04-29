'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quiz/all');
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      }
      finally{
        setIsLoading(false)
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Available Quizzes</h1>
        {isLoading ? (<p className='text-center text-gray-700 text-lg'>
          Loading Quizzes
        </p> ) : quizzes.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">No quizzes available.</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Link
                key={quiz._id}
                href={`/student/${quiz._id}`}
                className="block p-5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-shadow hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800">{quiz.title}</h2>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
