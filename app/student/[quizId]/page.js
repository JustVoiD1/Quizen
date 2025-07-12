'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';



export default function StudentQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [studentName, setStudentName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (quizId) {
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
        <p className="text-lg text-gray-800">Loading...</p>
      </div>
    );
  }

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSubmission = window.confirm("Are you sure you want to submit your answers?")
    if(!confirmSubmission) return;
    
    try {
      await axios.post('/api/submission/create', {
        quizId,
        studentName,
        answers,
      });
      alert('Answers submitted successfully!');
      router.push("/student");

    } catch (err) {
      console.error(err);
      alert('Failed to submit answers.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">{quiz.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border text-blue-800 font-bold border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />

          {quiz.questions.map((q, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded p-4 bg-gray-50 shadow-sm"
            >
              <p className="font-semibold text-gray-800 mb-2">{q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <label
                    key={oIdx}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      checked={answers[idx] === oIdx}
                      onChange={() => handleAnswerChange(idx, oIdx)}
                      required
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            onSubmit={handleSubmit}
            className="w-full py-3 bg-green-500 text-white rounded-lg text-lg font-semibold transition duration-300 hover:bg-green-600 hover:shadow-md"
          >
            Submit Answers
          </button>
        </form>
      </div>
    </div>
  );
}
