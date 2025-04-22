export default async function handler(req, res) {
    const { studentAnswers, correctAnswers } = req.body;
  
    if (!studentAnswers || !correctAnswers) {
      return res.status(400).json({ message: 'Invalid data' });
    }
  
    const scores = studentAnswers.map((answers) => {
      return answers.reduce((total, answer, index) => {
        return total + (answer === correctAnswers[index] ? 1 : 0);
      }, 0);
    });
  
    res.status(200).json({ scores });
  }
  