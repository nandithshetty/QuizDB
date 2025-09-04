let currentDifficulty = '';
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuizzes(difficulty) {
  const res = await fetch(`/quizzes/${difficulty}`);
  return await res.json();
}

async function initializeApp() {
  window.quizzes = {
    easy: await fetchQuizzes("easy"),
    medium: await fetchQuizzes("medium"),
    hard: await fetchQuizzes("hard")
  };
  updateQuizCounts();
  showScreen("homeScreen");
}

function updateQuizCounts() {
  document.getElementById("easyCount").textContent = `${quizzes.easy.length} quizzes`;
  document.getElementById("mediumCount").textContent = `${quizzes.medium.length} quizzes`;
  document.getElementById("hardCount").textContent = `${quizzes.hard.length} quizzes`;
  document.getElementById("totalQuizzes").textContent =
    quizzes.easy.length + quizzes.medium.length + quizzes.hard.length;
}

function showScreen(screenId) {
  ["homeScreen","quizScreen","resultsScreen"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}

function selectDifficulty(difficulty) {
  currentDifficulty = difficulty;
  displayQuizzes(difficulty);
  document.getElementById("quizSelection").classList.remove("hidden");
}

function displayQuizzes(difficulty) {
  const quizList = document.getElementById("quizList");
  quizList.innerHTML = '';
  quizzes[difficulty].forEach(quiz => {
    const card = document.createElement("div");
    card.className = "quiz-card bg-white p-6 rounded-xl border cursor-pointer";
    card.innerHTML = `<h3 class="text-xl font-semibold">${quiz.title}</h3><p>${quiz.description}</p>`;
    card.onclick = () => startQuiz(quiz);
    quizList.appendChild(card);
  });
}

function startQuiz(quiz) {
  currentQuiz = quiz;
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("quizTitle").textContent = quiz.title;
  document.getElementById("difficultyBadge").textContent = currentDifficulty.toUpperCase();
  showScreen("quizScreen");
  displayQuestion();
}

function displayQuestion() {
  const q = currentQuiz.questions[currentQuestionIndex];
  document.getElementById("questionText").textContent = q.question;
  const optionsDiv = document.getElementById("answerOptions");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-option w-full p-4 bg-gray-50 rounded-lg border";
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });
  document.getElementById("progressBar").style.width =`${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`;
  document.getElementById("nextButton").classList.add("hidden");
}

{/*function selectAnswer(i, btn) {
  const q = currentQuiz.questions[currentQuestionIndex];
  if (i === q.correct) {
    score++;
    btn.classList.add("correct-answer");
  } else {
    btn.classList.add("wrong-answer");
  }
  [...document.getElementById("answerOptions").children].forEach(b => b.disabled = true);
  document.getElementById("nextButton").classList.remove("hidden");
}*/}

function selectAnswer(idx) {
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll("#answerOptions button");

    options.forEach((btn, i) => {
        if (i === Number(question.correct)) {
            btn.classList.add("bg-green-200");
        }
        if (i === idx && i !== Number(question.correct)) {
            btn.classList.add("bg-red-200");
        }
        btn.disabled = true;
    });

    if (idx === Number(question.correct)) {
        score++;
    }

    document.getElementById("nextButton").classList.remove("hidden");
}


function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= currentQuiz.questions.length) {
    endQuiz();
  } else {
    displayQuestion();
  }
}

function showResults() {
  document.getElementById("finalScore").textContent = `${score}/${currentQuiz.questions.length}`;
  document.getElementById("scoreMessage").textContent = score > currentQuiz.questions.length/2 ? "Well done!" : "Keep practicing!";
  showScreen("resultsScreen");
}

function goHome() {
  document.getElementById("quizSelection").classList.add("hidden");
  showScreen("homeScreen");
}

function quitQuiz() { goHome(); }

function endQuiz() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultsScreen").classList.remove("hidden");

  const total = currentQuiz.questions.length;
  const correct = score;
  const wrong = total - correct;
  const accuracy = Math.round((correct / total) * 100);

  document.getElementById("finalScore").textContent = `${correct}/${total}`;
  document.getElementById("correctAnswers").textContent = correct;
  document.getElementById("wrongAnswers").textContent = wrong;
  document.getElementById("accuracyPercent").textContent = `${accuracy}%`;

  let message = "";
  let emoji = "🎉";
  if (accuracy === 100) {
    message = "Perfect! Amazing job!";
    emoji = "🏆";
  } else if (accuracy >= 70) {
    message = "Great job! 🚀";
    emoji = "💪";
  } else if (accuracy >= 40) {
    message = "Not bad, keep practicing!";
    emoji = "🙂";
  } else {
    message = "Don't give up! Try again!";
    emoji = "💪";
  }

  document.getElementById("scoreMessage").textContent = message;
  document.getElementById("resultEmoji").textContent = emoji;
}

function retakeQuiz() {
  startQuiz(currentQuiz);
}

document.addEventListener("DOMContentLoaded", initializeApp);
