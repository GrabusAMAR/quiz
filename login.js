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
      console.log(data);
      localStorage.setItem("token", data.user.token);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Finally");
    }
  }