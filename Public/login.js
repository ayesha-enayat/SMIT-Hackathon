
import {auth,signInWithEmailAndPassword} from './firebase.js'

let login = () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('login successful', user);
        alert("login successful");
        window.location='profile.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        alert(errorCode)
      });
  }
  let loginBtn = document.getElementById('LoginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click', login);
  }
else{
  console.log('login button not found');
}

