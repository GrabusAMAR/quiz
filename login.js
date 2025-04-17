const submitButton = document.getElementById("login-button")

async function loginUser() {
    try {
      const response = await fetch("https://quiz-be-zeta.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            
          }),
        }
      );
      const data = await response.json();
      console.log(window.location)

      window.location.href="./index.html"
      
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Finally");
    }
  }
submitButton.addEventListener("click", loginUser)

