async function registerUser() {
  try {
    const response = await fetch(
      "https://quiz-be-zeta.vercel.app/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
          username: document.getElementById("username").value,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Registracija uspješna! Token: " + data.token);
      window.location.href = "index.html";
    } else {
      alert("Nije uredu");
    }
  } catch (error) {
    console.log(error);
    alert("Greška prilikom registracije.");
  }
}

document
  .querySelector(".register-button")
  ?.addEventListener("click", registerUser);