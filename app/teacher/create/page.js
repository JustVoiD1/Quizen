'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreateQuizPage() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/quiz/create', { title, questions });
      alert('Quiz Created Successfully!');
      setTitle('');
      setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input
          type="text"
          placeholder="Quiz Title"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded-md shadow-sm">
            <label className="block font-semibold mb-2">Question {idx + 1}</label>
            <input
              type="text"
              placeholder="Question Text"
              className="w-full p-2 border rounded mb-4"
              value={q.text}
              onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
              required
            />

            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center mb-2 gap-3">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={q.correctAnswer === oIdx}
                  onChange={() => handleQuestionChange(idx, 'correctAnswer', oIdx)}
                />
                <input
                  type="text"
                  placeholder={`Option ${oIdx + 1}`}
                  className="w-full p-2 border rounded"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ➕ Add Question
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
