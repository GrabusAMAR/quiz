let questionNumber = 1;
let score = 0;
let coins = 0;
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

    // Fetch initial coins
    await fetchUserCoins();

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

async function fetchUserCoins() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("https://quiz-be-zeta.vercel.app/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userData = await response.json();
    coins = userData.coins || 0;
    updateCoinsDisplay();
  } catch (error) {
    console.error("Greška pri dohvaćanju novčića:", error);
  }
}

function updateCoinsDisplay() {
  const coinsElement = document.getElementById("coins");
  if (coinsElement) {
    coinsElement.textContent = coins;
  }
}

async function updateUserCoins() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch("https://quiz-be-zeta.vercel.app/auth/update-coins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coins: coins }),
    });
  } catch (error) {
    console.error("Greška pri ažuriranju novčića:", error);
  }
}

function startTimer() {
  let timeLeft = 60;
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
        coins++; // Add one coin for correct answer
        localStorage.setItem("score", score);
        btn.style.background = "#28a745";
        document.getElementById("bodovi").textContent = score;
        updateCoinsDisplay(); // Update coins display
        setTimeout(() => {
          showQuestion(result.nextQuestion);
        }, 1000);
      } else {
        btn.style.backgroundColor = "#dc3545";
        setTimeout(() => {
          endQuiz(false); // Pass false to indicate game over due to wrong answer
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

    // Update coins in the database
    await updateUserCoins();
  } catch (error) {
    console.error("Greška pri ažuriranju rezultata:", error);
  }
}

function endQuiz(isVoluntary = true) {
  const modal = document.getElementById('quiz-end-modal');
  modal.style.display = 'flex';
  modal.classList.remove('hidden');
  
  document.getElementById('final-score').textContent = score;
  
  // Update modal content based on how the game ended
  const modalTitle = document.querySelector('.modal-content h2');
  const modalSubtext = document.querySelector('.modal-content p:nth-of-type(2)');
  
  if (!isVoluntary) {
    modalTitle.textContent = "Kviz završen!";
    modalSubtext.textContent = "Nažalost, pogrešan odgovor. Evo vaše statistike:";
    
    // Add revival button if player has enough coins
    const modalButtons = document.querySelector('.modal-buttons');
    if (coins >= 5) {
      const reviveButton = document.createElement('button');
      reviveButton.innerHTML = `<img src="./slike/coin.svg" alt="Coin" style="width: 20px; height: 20px; margin-right: 5px;"> Oživi se (5 novčića)`;
      reviveButton.style.backgroundColor = '#DAA520';
      reviveButton.style.color = 'white';
      reviveButton.style.marginRight = '10px';
      reviveButton.style.display = 'flex';
      reviveButton.style.alignItems = 'center';
      reviveButton.style.justifyContent = 'center';
      reviveButton.addEventListener('click', function() {
        revivePlayer();
      });
      modalButtons.insertBefore(reviveButton, modalButtons.firstChild);
    } else {
      const noCoinsMessage = document.createElement('p');
      noCoinsMessage.textContent = `Nemate dovoljno novčića za oživljavanje (potrebno: 5, imate: ${coins})`;
      noCoinsMessage.style.color = '#666';
      noCoinsMessage.style.marginBottom = '15px';
      modalButtons.parentNode.insertBefore(noCoinsMessage, modalButtons);
    }
  } else {
    modalTitle.textContent = "Čestitamo na završenom kvizu !!";
    modalSubtext.textContent = "U prilogu pogledajte svoju statistiku :";
  }
  
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

async function revivePlayer() {
  if (coins >= 5) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }

      // Call the revive endpoint
      const response = await fetch("https://quiz-be-zeta.vercel.app/game/revive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: currentGameId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to revive');
      }

      const data = await response.json();
      
      // Update coins from the response
      coins = data.coins;
      
      // Update the display
      const coinsElement = document.getElementById("coins");
      if (coinsElement) {
        coinsElement.textContent = coins;
      }
      
      // Close the modal
      const modal = document.getElementById('quiz-end-modal');
      modal.style.display = 'none';
      
      // Continue the game with the next question
      if (data.nextQuestion) {
        showQuestion(data.nextQuestion);
      } else {
        loadQuestion();
      }
    } catch (error) {
      console.error("Greška pri oživljavanju:", error);
      alert("Došlo je do greške pri oživljavanju. Molimo pokušajte ponovo.");
    }
  } else {
    alert("Nemate dovoljno novčića za oživljavanje!");
  }
}

function closeModal() {
  const modal = document.getElementById('quiz-end-modal');
  modal.style.display = 'none';
  questionNumber = 1;
  score = 0;
  coins = 0; // Reset coins for new game
  document.getElementById('bodovi').textContent = '0';
  document.getElementById('coins').textContent = '0';
  loadQuestion();
}