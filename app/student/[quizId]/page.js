'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // <-- for params in App Router
import axios from 'axios';

export default function StudentQuizPage() {
  const { quizId } = useParams(); // get quizId from useParams()
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (quizId) { // important to check
          const res = await axios.get(`/api/quiz/${quizId}`);
          setQuiz(res.data.quiz);
          setAnswers(new Array(res.data.quiz.questions.length).fill(null));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <div>Loading...</div>;

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/submission/create', {
        quizId,
        studentName,
        answers,
      });
      alert('Answers submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit answers.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded mb-6"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />

        {quiz.questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded space-y-2">
            <p className="font-semibold">{q.text}</p>
            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question-${idx}`}
                  checked={answers[idx] === oIdx}
                  onChange={() => handleAnswerChange(idx, oIdx)}
                  required
                />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        ))}

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}
