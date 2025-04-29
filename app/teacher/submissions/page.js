'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('/api/submission/all');
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Student Submissions</h1>
          {submissions.length === 0 && (
            <p className="text-gray-700 mt-4 text-lg">No submissions yet.</p>
          )}
        </div>

        {submissions.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                <h2 className="text-xl font-semibold text-gray-900">{submission.studentName}</h2>
                <p className="text-gray-700 mt-1 mb-4">
                  Quiz: <span className="italic">{submission.quizId?.title || 'Deleted Quiz'}</span>
                </p>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Answers:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.answers.map((ans, idx) => (
                      <li key={idx}>Q{idx + 1}: Option {ans + 1}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
