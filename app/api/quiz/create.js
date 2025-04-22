import connectMongo from '@/config/db';
import Quiz from '@/models/Quiz';


export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    try {
      const { title, questions } = req.body;
      const quiz = await Quiz.create({ title, questions });
      res.status(201).json({ success: true, quiz });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
