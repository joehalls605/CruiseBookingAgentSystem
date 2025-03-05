document.getElementById("agent-name-value").innerText = "Phil Hoff";
document.getElementById("agent-id-value").innerText = "02819";
document.getElementById("email-address-value").innerText = "philhoff@bookingsystem.com";
document.getElementById("phone-number-value").innerText = "01473 327655";
document.getElementById("office-location-value").innerText = "London";
document.getElementById("password").value = "affddskjf";


const visibilityImageElement = document.getElementById("visibility-image");
visibilityImageElement.addEventListener("click", togglePassword);


function togglePassword(){
    var passwordField = document.getElementById("password");

    if(passwordField.type === "password"){
        passwordField.type = "text";
    }

    else{
        passwordField.type = "password";
    }
}
