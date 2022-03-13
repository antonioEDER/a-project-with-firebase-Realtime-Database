import firebase from "firebase";

var todoForm = document.getElementById("todo");
var authForm = document.getElementById("authForm");

var userName = document.getElementById("userName");

todoForm.style.display = "none";
authForm.style.display = "block";

authForm.onsubmit = function(event) {
  event.preventDefault();
  if (authForm.submitAuthForm.innerHTML == "Acessar") {
    firebase
      .auth()
      .signInWithEmailAndPassword(authForm.email.value, authForm.password.value)
      .then(() => {
        todoForm.style.display = "block";
        authForm.style.display = "none";
      })
      .catch((error) => {
        alert("Falha no acesso: ", error);
      });
  }
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    showUserContent(user);
  } else {
    showAuth();
  }
});



function showUserContent(user) {
    if (user.providerData[0].providerId != 'password') {
     alert('Autenticação por provedor confiável, não é necessário verificar e-mail')
    }

    userName.innerHTML = user.displayName
    userEmail.innerHTML = user.email

    todoForm.style.display = "block";
    authForm.style.display = "none";

    window.OnDataBase()
  }