/*const asyncFunction = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Hello, world from asyncFunction!");
    }, 1000);
  });
  
  console.log("Hello  world 1!");
  asyncFunction
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log("Hello  world!");
    });
*/
  // fetch
/*
  fetch("https://c986-77-239-14-36.ngrok-free.app").then((response) => {
    response.json().then((data) => {
      console.log(data);
    });
  });
  
  const createUser = () => {
    fetch("https://c986-77-239-14-36.ngrok-free.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "jasmin.fajkicl17@gmail.com",
        password: "kalerias1982",
        firstName: "Jasmin",
        lastName: "Fajkic",
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  setTimeout(() => {
    console.log("Hello world, from setTimeout!");
  }
  , 5000);
  
  createUser()
*/
 const res = fetch('https://jsonplaceholder.typicode.com/users/1')
 console.log(res);

 function logResponse (response) {
  response.json().then((data) => {
    console.log(data);
  })
}


function logError (error) {
  console.log(error);
}

function logFinally () {
  console.log("Hello world, from finally!");
}

fetch("https://jsonplaceholder.typicode.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
  }),
})
  .then(logResponse)
  .catch(logError)
  .finally(logFinally);

  fetch("https://jsonplaceholder.typicode.com/users/1", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Grabus",
      email: "GRABUS.A@example.com",
    }),
  })
    .then(logResponse)
    .catch(logError)
    .finally(logFinally);

    fetch("https://jsonplaceholder.typicode.com/users/1", {
      method: "DELETE",
    })
      .then(logResponse)
      .catch(logError)
      .finally(logFinally);

      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      })
        .then(logResponse)
        .catch(logError)
        .finally(logFinally);

        async function getUsers() {
          try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await response.json();
            console.log(data);
          } catch (error) {
            console.log(error);
          } finally {
            console.log("Finally");
          }
        }
        
        getUsers();

fetch("https://600d-77-239-14-36.ngrok-free.app", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
  }),
})
  .then(logResponse)
  .catch(logError)
  .finally(logFinally);





// jasm

async function registerUser() {
  try {
    const response = await fetch(
      "https://600d-77-239-14-36.ngrok-free.app/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Josh",
          email: "some+1@testc.om",
          password: 123455,
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
registerUser();