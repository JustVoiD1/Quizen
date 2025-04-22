import connectMongo from "@/config/db";
import Submission from "@/models/Submission";


export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    try {
      const { studentName, quizId, answers } = req.body;
      const submission = await Submission.create({ studentName, quizId, answers });
      res.status(201).json({ success: true, submission });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
