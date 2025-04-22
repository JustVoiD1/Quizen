import React from 'react'
import Link from 'next/link';

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-teal-100">
      <div className="text-center max-w-lg p-8 rounded-lg bg-white shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Welcome to Teacher Dashboard</h1>
        <p className="text-lg mb-8 text-gray-600">
          Manage your quizzes and check student submissions easily from here.
        </p>
        <div className="space-y-4">
          <Link
            href="/teacher/create/"
            className="block py-3 px-6 text-center bg-blue-500 text-white rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl"
          >
            Create Quiz
          </Link>
          <Link
            href="/teacher/submissions/"
            className="block py-3 px-6 text-center bg-green-500 text-white rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-xl"
          >
            Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
