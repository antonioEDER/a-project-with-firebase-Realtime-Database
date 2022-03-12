/* eslint-disable no-undef */
import '../css/styles.scss';


var todoForm = document.getElementById('todoForm')
export const loading = document.getElementById('loading');


// Simpplifica a exibição de elementos da página
export function showItem(element) {
  element.style.display = 'block';
}

// Simpplifica a remoção de elementos da página
export function hideItem(element) {
  element.style.display = 'none';
}

// Atributos extras de configuração de e-mail
export const actionCodeSettings = {
  url: 'https://a-project-with-firebase-670d5.firebaseapp.com',
};


window.actionCodeSettings = actionCodeSettings;
window.loading = loading;
