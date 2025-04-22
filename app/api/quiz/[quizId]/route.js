import connectMongo from '@/config/db';
import Quiz from '@/models/Quiz';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  await connectMongo();
  const { quizId } = context.params;  // ✅ Correct

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to fetch quiz' }, { status: 500 });
  }
}
