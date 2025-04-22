'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TeacherSubmissionsPage() {
  const router = useRouter();
  const { quizId } = router.query; // Get quizId from URL
  const [submissions, setSubmissions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (quizId) {
      axios
        .get(`/api/quiz/submissions?id=${quizId}`)
        .then((res) => setSubmissions(res.data.submissions))
        .catch((err) => console.error(err));
    }
  }, [quizId]);

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...correctAnswers];
    newAnswers[index] = e.target.value;
    setCorrectAnswers(newAnswers);
  };

  const handleGrade = (studentIndex) => {
    const studentSubmission = submissions[studentIndex];
    const score = studentSubmission.answers.reduce((total, answer, index) => {
      return total + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    alert(`Student: ${studentSubmission.studentName} \nScore: ${score}/${correctAnswers.length}`);
  };

  const handleFinalGrade = () => {
    setGrading(true);
    // Send the correct answers to grade all submissions
    axios
      .post(`/api/quiz/check`, { studentAnswers: submissions.map(s => s.answers), correctAnswers })
      .then((res) => {
        alert('Grading Complete!');
        setGrading(false);
      })
      .catch((err) => {
        console.error(err);
        setGrading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Student Submissions</h1>

      <div className="space-y-8">
        {submissions.length === 0 && <div>No submissions yet!</div>}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Enter Correct Answers</h2>
          {submissions.length > 0 && (
            <div>
              {submissions[0].answers.map((_, idx) => (
                <div key={idx} className="mb-4">
                  <label className="block">Correct Answer for Question {idx + 1}</label>
                  <input
                    type="text"
                    className="p-3 border rounded w-full"
                    value={correctAnswers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e)}
                    placeholder={`Correct answer for Q${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {submissions.map((submission, idx) => (
          <div key={idx} className="border p-4 rounded-md shadow-sm mb-4">
            <h3 className="font-semibold text-lg">{submission.studentName}</h3>

            {submission.answers.map((answer, qIdx) => (
              <div key={qIdx} className="mb-2">
                <strong>Q{qIdx + 1}: </strong>
                <span>{answer}</span>
              </div>
            ))}

            <button
              onClick={() => handleGrade(idx)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Grade Submission
            </button>
          </div>
        ))}

        <button
          onClick={handleFinalGrade}
          disabled={grading}
          className={`px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 ${grading ? 'opacity-50' : ''}`}
        >
          {grading ? 'Grading...' : 'Grade All Submissions'}
        </button>
      </div>
    </div>
  );
}
