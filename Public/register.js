
import {
    auth,
    createUserWithEmailAndPassword,
    provider, signInWithPopup,
    GoogleAuthProvider
} from './firebase.js';


//-------------------SignUp Function--------------------
let signup = () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: "Invalid email format",
            timer: 5000,
            icon: "error",
            showConfirmButton: false
        });
        return;
    }
  
    if (!passwordRegex.test(password)) {
        Swal.fire({
            title: "Password must be 6-16 characters and include at least one number and one special character",
            timer: 5000,
            icon: "error",
            showConfirmButton: false
        });
        return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User created:", user);
            alert("Account Created"); 
        })
        .catch((error) => {
            console.error("Error creating user:", error.code, error.message);
            alert(error);
        });
};

let register = document.getElementById('registerBtn');
if (register) {
    register.addEventListener('click', signup);
}


//----------------------SignIn with Google Function------------------------------
let googleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log("Signed in with Google:", user);
            alert("Signed With Google Successfully!")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode);
            alert(errorCode)
        });
}
let signInGoogle = document.getElementById('signInGoogle');
if(signInGoogle){
    signInGoogle.addEventListener('click', googleSignIn);
}
