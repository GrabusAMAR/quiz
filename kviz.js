const registerButton = document.getElementsByClassName("register-button")[0];

registerButton?.addEventListener("click", () => {
  registerUser();
});

const loginButton = document.getElementsByClassName("login-button")[0];

async function registerUser() {
  try {
    const response = await fetch(
      "https://0c6e-77-239-14-36.ngrok-free.app/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "bakir.hadzic1@gmail.com",
          password: "654321",
          firstName: "bakir",
          lastName: "hadzic",
          username: "elbake10",
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Finally");
  }
}

async function loginUser() {
  try {
    const response = await fetch(
      "https://0c6e-77-239-14-36.ngrok-free.app/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "bakir.hadzic1@gmail.com",
          password: "654321",
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

loginButton?.addEventListener("click", getUsers);


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
  
  
