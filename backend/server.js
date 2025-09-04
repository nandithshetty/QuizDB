import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Get quizzes by difficulty
app.get("/quizzes/:difficulty", (req, res) => {
  const { difficulty } = req.params;
  db.all("SELECT * FROM quizzes WHERE difficulty = ?", [difficulty], (err, quizzes) => {
    if (err) return res.status(500).json({ error: err.message });

    const promises = quizzes.map((quiz) => {
      return new Promise((resolve, reject) => {
        db.all("SELECT * FROM questions WHERE quiz_id = ?", [quiz.id], (err, questions) => {
          if (err) reject(err);
          quiz.questions = questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: JSON.parse(q.options),
            correct: q.correct
          }));
          resolve(quiz);
        });
      });
    });

    Promise.all(promises)
      .then((results) => res.json(results))
      .catch((error) => res.status(500).json({ error: error.message }));
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
