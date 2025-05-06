async function loginUser() {
  try {
    const response = await fetch("https://quiz-be-zeta.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    });

    const data = await response.json();
    console.log("Odgovor servera", data);
    console.log(window.location)

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "./index.html";
    } else {
      alert("Greška pri loginu: " + JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
    alert("Došlo je do greške prilikom prijave.");
  }
}

document.querySelector(".login-button")?.addEventListener("click", loginUser);