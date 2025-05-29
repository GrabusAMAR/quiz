async function getUsers() {
  const token = localStorage.getItem("token");
  console.log(token);
  try {
    const response = await fetch(
      "https://0c6e-77-239-14-36.ngrok-free.app/users",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const userList = document.getElementById("list-users");
    userList.innerHTML = "";
    data.forEach((user) => {
      const listOfUsers = document.createElement("p");
      listOfUsers.textContent = `Id: ${user.id} - ${user.username} - ${user.email}`;
      userList.appendChild(listOfUsers);
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("finally");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const loginBtn = document.querySelector(".login-button");
  const registerBtn = document.querySelector(".register-button");
  const logoutBtn = document.querySelector(".odjavi-se a");

  if (token) {
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    fetchUserCoins();

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
  }
});

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
    const coinsAmount = document.querySelector(".coins-amount");
    if (coinsAmount) {
      coinsAmount.textContent = userData.coins || 0;
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju novčića:", error);
  }
}

function logRespons(response) {
  response.json().then((data) => {
    console.log(data);
  });
}

function logError(error) {
  console.log(error);
}

function logFinally() {
  console.log("Hello world, from finally");
}

document.querySelectorAll('.start-quiz, .btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('quiz-modal').style.display = 'flex';
  });
});

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('quiz-modal').style.display = 'none';
});

document.getElementById('startGameBtn').addEventListener('click', function () {
  window.location.href = 'zapocni-igranje2.html'; 
});