'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updated = questions.filter((_, idx) => idx !== index);
      setQuestions(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/quiz/create', { title, questions });
      alert('Quiz Created Successfully!');
      
      // Redirect to teacher dashboard
      router.push('/teacher');
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create a New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <input
            type="text"
            placeholder="Quiz Title"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {questions.map((q, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-5 shadow-sm bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-semibold text-gray-700">Question {idx + 1}</label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm shadow-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Question Text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
                value={q.text}
                onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                required
              />

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      checked={q.correctAnswer === oIdx}
                      onChange={() => handleQuestionChange(idx, 'correctAnswer', oIdx)}
                    />
                    <input
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm"
            >
              ➕ Add Question
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
            >
              ✅ Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
