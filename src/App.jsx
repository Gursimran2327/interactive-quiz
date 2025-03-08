import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        const formattedQuestions = data.results.map((q) => ({
          ...q,
          answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
        }));
        setQuestions(formattedQuestions);
        setSelectedAnswers({});
        setScore(null);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function handleAnswerSelect(questionIndex, answer) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }

  function handleSubmit() {
    let userScore = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        userScore += 1;
      }
    });

    setScore(userScore);
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center text-primary">🎯 INTERACTIVE QUIZ 🎯</h1>
        {questions.length > 0 ? (
          <div>
            {questions.map((q, index) => (
              <div key={index} className="mb-4">
                <h4 dangerouslySetInnerHTML={{ __html: q.question }} />
                <ul className="list-group">
                  {q.answers.map((answer, i) => (
                    <li key={i} className="list-group-item">
                      <label>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={answer}
                          checked={selectedAnswers[index] === answer}
                          onChange={() => handleAnswerSelect(index, answer)}
                          className="me-2"
                        />
                        <span dangerouslySetInnerHTML={{ __html: answer }} />
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="text-center">
              <button className="btn btn-success mt-3" onClick={handleSubmit}>
                ✅ Submit Quiz
              </button>
            </div>

            {score !== null && (
              <div className="text-center mt-4">
                <h2 className="text-info">🎉 Your Score: {score} / {questions.length} 🎉</h2>
                <button className="btn btn-primary mt-3" onClick={fetchQuestions}>
                  🔄 Take Another Quiz
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-danger">⏳ Loading questions...</p>
        )}
      </div>
    </div>
  );
}

export default App;
