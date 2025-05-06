let data;
let currentUser;

async function fetchLeaderBoard() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://quiz-be-zeta.vercel.app/leaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = await response.json();

    const profileResponse = await fetch("https://quiz-be-zeta.vercel.app/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    currentUser = await profileResponse.json();

    renderLeaderboard();

  } catch (e) {
    console.error("Greška pri dohvaćanju podataka:", e);
  }
}

function Item(name, score, i) {
  this.element = `<div class="leaderboard-item">
    <span class="rank">#${i ? i : i + 1}</span>
    <span class="name">${name}</span>
    <span class="score">${score}</span>
  </div>`;
}

function renderLeaderboard() {
  const leaderboard = document.getElementsByClassName("leaderboard")[0];
  leaderboard.innerHTML = "";

  data.slice(0, 5).forEach((user, i) => {
    const item = new Item(user.username, user.bestScore, i);
    leaderboard.innerHTML += item.element;
  });

  leaderboard.innerHTML += `<hr style="margin: 10px 0;">`;

  const item = new Item(currentUser.username, currentUser.bestScore, "Ti");
  leaderboard.innerHTML += item.element;
}

fetchLeaderBoard();