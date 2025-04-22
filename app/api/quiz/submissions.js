import { getQuizSubmissions } from '../../utils/db'; // Mock function to fetch data


export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: 'Quiz ID is required' });

  try {
    const submissions = await getQuizSubmissions(id);
    res.status(200).json({ submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
}
