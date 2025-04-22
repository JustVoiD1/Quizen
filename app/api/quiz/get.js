import connectMongo from "@/config/db";
import Quiz from "@/models/Quiz";


export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }
      res.status(200).json({ success: true, quiz });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
