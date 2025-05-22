let questionNumber = 1;
let score = 0;
let timerInterval;
let currentGameId;
let currentQuestionId;


async function loadQuestion() {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const res = await fetch("https://quiz-be-zeta.vercel.app/game/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await res.json();

    if (!data.question) {
      throw new Error('No questions available');
    }

    currentGameId = data.gameId;
    showQuestion(data.question);
  } catch (error) {
    console.error(error);
    alert('Došlo je do greške pri učitavanju pitanja. Molimo pokušajte ponovo.');
    window.location.href = 'index.html';
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
      endQuiz();
    }
  }, 1000);
}

function showQuestion(question) {
  if (!question) {
    endQuiz();
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

async function updateScore() {
  const token = localStorage.getItem("token");
  
  if (!token) return;
  
  try {
    const profileResponse = await fetch("https://quiz-be-zeta.vercel.app/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userData = await profileResponse.json();
    
    if (score > userData.bestScore) {
      await fetch("https://quiz-be-zeta.vercel.app/leaderboard/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: score }),
      });
      
      console.log("Najbolji rezultat ažuriran:", score);
    }
  } catch (error) {
    console.error("Greška pri ažuriranju rezultata:", error);
  }
}

function endQuiz() {
  const modal = document.getElementById('quiz-end-modal');
  modal.style.display = 'flex';
  modal.classList.remove('hidden');
  
  document.getElementById('final-score').textContent = score;
  
  updateScore().then(() => {
    fetchUserRank();
  });
  
  const restartBtn = document.querySelector('.modal-buttons button:first-child');
  const leaderboardBtn = document.querySelector('.modal-buttons button:last-child');
  
  const newRestartBtn = restartBtn.cloneNode(true);
  const newLeaderboardBtn = leaderboardBtn.cloneNode(true);
  
  restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
  leaderboardBtn.parentNode.replaceChild(newLeaderboardBtn, leaderboardBtn);
  
  newRestartBtn.addEventListener('click', function() {
    closeModal();
  });
  
  newLeaderboardBtn.addEventListener('click', function() {
    goToLeaderboard();
  });
}

async function fetchUserRank() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    document.getElementById('final-rank').textContent = "?";
    return;
  }
  
  try {
    const leaderboardResponse = await fetch("https://quiz-be-zeta.vercel.app/leaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const leaderboardData = await leaderboardResponse.json();
    
    const profileResponse = await fetch("https://quiz-be-zeta.vercel.app/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const currentUser = await profileResponse.json();
    
    const simulatedLeaderboard = [...leaderboardData];
    const userIndex = simulatedLeaderboard.findIndex(user => user.username === currentUser.username);
    
    if (userIndex >= 0) {
      const userScore = Math.max(currentUser.bestScore, score);
      simulatedLeaderboard[userIndex] = {
        ...simulatedLeaderboard[userIndex],
        bestScore: userScore
      };
    }
    
    simulatedLeaderboard.sort((a, b) => b.bestScore - a.bestScore);
    
    const userPosition = simulatedLeaderboard.findIndex(user => user.username === currentUser.username) + 1;
    
    if (userPosition > 0) {
      document.getElementById('final-rank').textContent = `#${userPosition}`;
    } else {
      document.getElementById('final-rank').textContent = "?";
    }
    
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error);
    document.getElementById('final-rank').textContent = "?";
  }
}

function goToLeaderboard() {
  window.location.href = 'index.html#leaderboard-section';
}

function closeModal() {
  const modal = document.getElementById('quiz-end-modal');
  modal.style.display = 'none';
  questionNumber = 1;
  score = 0;
  document.getElementById('bodovi').textContent = '0';
  loadQuestion();
}