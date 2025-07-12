'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [gradedSubmissions, setGradedSubmissions] = useState({});
  const [loadingGrades, setLoadingGrades] = useState({});
  const [viewMode, setViewMode] = useState('quizzes'); // 'quizzes' or 'submissions'

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

  const fetchQuizSubmissions = async (quizId, quizTitle) => {
    try {
      const res = await axios.get(`/api/quiz/submissions?id=${quizId}`);
      setQuizSubmissions(res.data.submissions);
      setSelectedQuiz({ id: quizId, title: quizTitle });
      setViewMode('submissions');
    } catch (err) {
      console.error('Error fetching quiz submissions:', err);
      alert('Failed to fetch quiz submissions');
    }
  };

  const goBackToQuizzes = () => {
    setViewMode('quizzes');
    setSelectedQuiz(null);
    setQuizSubmissions([]);
    setGradedSubmissions({});
  };

  const checkSubmission = async (submissionId, quizId) => {
    setLoadingGrades(prev => ({ ...prev, [submissionId]: true }));
    
    try {
      const res = await axios.post('/api/quiz/check', {
        quizId,
        submissionId
      });
      
      if (res.data.success) {
        setGradedSubmissions(prev => ({
          ...prev,
          [submissionId]: res.data
        }));
      }
    } catch (err) {
      console.error('Error checking submission:', err);
      alert('Failed to check submission');
    } finally {
      setLoadingGrades(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {viewMode === 'quizzes' ? 'Quiz Submissions' : `${selectedQuiz?.title} - Submissions`}
          </h1>
          
          {viewMode === 'submissions' && (
            <button
              onClick={goBackToQuizzes}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to Quizzes
            </button>
          )}
        </div>

        {viewMode === 'quizzes' && (
          <div>
            {quizzes.length === 0 ? (
              <p className="text-gray-700 mt-4 text-lg text-center">No quizzes available.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
                    onClick={() => fetchQuizSubmissions(quiz._id, quiz.title)}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {quiz.questions?.length || 0} questions
                    </p>
                    <div className="text-blue-600 font-medium">
                      Click to view submissions →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'submissions' && (
          <div>
            {quizSubmissions.length === 0 ? (
              <p className="text-gray-700 mt-4 text-lg text-center">No submissions for this quiz yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {quizSubmissions.map((submission) => {
                  const isGraded = gradedSubmissions[submission._id];
                  const isLoading = loadingGrades[submission._id];
                  
                  return (
                    <div
                      key={submission._id}
                      className="bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{submission.studentName}</h2>
                          <p className="text-gray-700 mt-1">
                            Quiz: <span className="italic">{submission.quizId?.title || selectedQuiz?.title}</span>
                          </p>
                        </div>
                        
                        <button
                          onClick={() => checkSubmission(submission._id, submission.quizId?._id || selectedQuiz.id)}
                          disabled={isLoading}
                          className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                            isLoading 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : isGraded 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isLoading ? 'Checking...' : isGraded ? 'Re-check' : 'Check & Grade'}
                        </button>
                      </div>

                      {isGraded && (
                        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-800 mb-2">📊 Results:</h3>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-800">Score: </span>
                              <span className="text-green-600 font-bold">{isGraded.score}/{isGraded.totalQuestions}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Percentage: </span>
                              <span className="text-green-600 font-bold">{isGraded.percentage}%</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">Grade: </span>
                              <span className={`font-bold ${
                                isGraded.percentage >= 90 ? 'text-green-600' :
                                isGraded.percentage >= 80 ? 'text-blue-600' :
                                isGraded.percentage >= 70 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {isGraded.percentage >= 90 ? 'A' :
                                 isGraded.percentage >= 80 ? 'B' :
                                 isGraded.percentage >= 70 ? 'C' :
                                 isGraded.percentage >= 60 ? 'D' : 'F'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Answers:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {submission.answers.map((ans, idx) => {
                            const questionResult = isGraded?.results?.[idx];
                            return (
                              <li key={idx} className={`${questionResult ? (questionResult.isCorrect ? 'text-green-600' : 'text-red-600') : ''}`}>
                                Q{idx + 1}: Option {ans + 1}
                                {questionResult && (
                                  <span className="ml-2">
                                    {questionResult.isCorrect ? '✅' : `❌ (Correct: Option ${questionResult.correctAnswer + 1})`}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
