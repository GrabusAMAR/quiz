let questionNumber = 1;
let score = 0;
let timerInterval;
let currentGameId;
let currentQuestionId;


async function loadQuestion() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://quiz-be-zeta.vercel.app/game/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    currentGameId = data.gameId;
    showQuestion(data.question);
  } catch (error) {
    console.log(error);
  }
}

function startTimer() {
  let timeLeft = 10;
  document.getElementById("timer").textContent = timeLeft;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      window.location.href = "./zavrsi-kviz.html";
    }
  }, 1000);
}

function showQuestion(question) {
  if (!question) {
    window.location.href = "./zavrsi-kviz.html";
    return;
  }

  startTimer()

  currentQuestionId = question._id;

  document.getElementById("question-text").textContent = question.title;
  document.getElementById("redniBroj").textContent = questionNumber;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span>${String.fromCharCode(65 + index)}</span> ${
      option.text
    }`;

    btn.addEventListener("click", async () => {
        clearInterval(timerInterval);
      document
        .querySelectorAll(".option-btn")
        .forEach((b) => (b.disabled = true));
      console.log(option);
      const res = await fetch("https://quiz-be-zeta.vercel.app/game/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          gameId: currentGameId,
          questionId: currentQuestionId,
          answer: option.text,
        }),
      });

      const result = await res.json();
      console.log(result);

      if (result.correct) {
        score++;
        localStorage.setItem("score", score);
        btn.style.background = "#28a745";
        document.getElementById("bodovi").textContent = score;
        setTimeout(() => {
          showQuestion(result.nextQuestion);
        }, 1000);
      } else {
        btn.style.backgroundColor = "#dc3545";
        setTimeout(() => {
          endQuiz();
        }, 1000);
      }
    });

    optionsContainer.appendChild(btn);
  });
}

loadQuestion(); 

function endQuiz() {
  document.querySelectorAll('.quiz-end-modal, .btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('quiz-end-modal').style.display = 'flex';
    });
  });
  

  
  document.getElementById('startGameBtn').addEventListener('click', function () {
    window.location.href = 'zapocni-igranje2.html'; 
  });
}