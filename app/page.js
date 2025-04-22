export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
        <div className="text-center max-w-lg p-8 rounded-lg bg-white shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Welcome to the Quiz App</h1>
          <p className="text-lg mb-8 text-gray-700">
            Start by creating a quiz as a teacher or take a quiz as a student!
          </p>
          <div className="space-y-4">
            <a
              href="/teacher/"
              className="block w-full py-3 px-6 text-center bg-blue-500 text-white rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
            >
              Teacher Dashboard
            </a>
            <a
              href="/student/"
              className="block w-full py-3 px-6 text-center bg-green-500 text-white rounded-lg text-lg font-semibold transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
            >
              Student Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
