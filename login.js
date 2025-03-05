//
//
// // Credentials would never be hardcoded or stored in LocalStorage. This is just for me to learn.
//
// document.addEventListener("DOMContentLoaded", function () {
//     const loginForm = document.getElementById("loginForm");
//     const messageElement = document.getElementById("message");
//
//     // Simulated user credentials
//     const storedEmail = "test@example.com";
//     const storedPassword = "password123";
//
//     // Store credentials in localstorage
//
//     localStorage.setItem("email", storedEmail);
//     localStorage.setItem("password", storedPassword);
//
//     loginForm.addEventListener("submit", function(event){
//         event.preventDefault(); // prevents the form from refreshing the page
//
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//
//         // Retrieve stored credentials
//         const savedEmail = localStorage.getItem("email");
//         const savedPassword = localStorage.getItem("password");
//
//         if(email === savedEmail && password === savedPassword){
//             messageElement.style.color = "green";
//             messageElement.textContent = "Login successful";
//
//             setTimeout(()=>{
//                 window.location.href = "index.html";
//             }, 2000)
//         }
//         else{
//             messageElement.style.color = "red";
//             messageElement.textContent = "Invalid email or password";
//         }
//     });
// });