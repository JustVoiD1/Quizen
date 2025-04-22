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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Student Submissions</h1>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{submission.studentName}</h2>
              <p className="text-gray-600 mb-2">Quiz: {submission.quizId?.title || 'Deleted Quiz'}</p>
              <div>
                <h3 className="font-semibold">Answers:</h3>
                <ul className="list-disc list-inside">
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
  );
}
