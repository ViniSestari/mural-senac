// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const firebaseConfig = {
 apiKey: "AIzaSyApq4Aap0ab3i0ihC2NnGAgcA8MKdDw4JY",
 authDomain: "mural-senac.firebaseapp.com",
 databaseURL: "https://mural-senac-default-rtdb.firebaseio.com",
 projectId: "mural-senac",
 storageBucket: "mural-senac.firebasestorage.app",
 messagingSenderId: "919910834762",
 appId: "1:919910834762:web:c6d6a1fe6121f7aebafcb3"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
document.addEventListener('DOMContentLoaded', () => {
 const form = document.getElementById('form-anuncio');
 if (form) {
   form.addEventListener('submit', (e) => {
     e.preventDefault();
     const anuncio = {
       titulo: form.titulo.value,
       descricao: form.descricao.value,
       categoria: form.categoria.value,
       anunciante: form.anunciante.value,
       contato: form.contato.value
     };
     const anunciosRef = ref(database, 'anuncios');
     push(anunciosRef, anuncio)
       .then(() => {
         alert('Anúncio publicado com sucesso!');
         window.location.href = 'index.html';
       })
       .catch((error) => {
         alert('Erro ao publicar anúncio: ' + error.message);
       });
   });
 }
 const lista = document.getElementById('lista-anuncios');
 if (lista) {
   const anunciosRef = ref(database, 'anuncios');
   onValue(anunciosRef, (snapshot) => {
     lista.innerHTML = '';
     const anuncios = snapshot.val();
     if (!anuncios) {
       lista.innerHTML = '<p>Nenhum anúncio publicado ainda.</p>';
       return;
     }
     const anunciosArray = Object.values(anuncios).reverse();
     anunciosArray.forEach((anuncio) => {
       const div = document.createElement('div');
       div.classList.add('anuncio');
       div.innerHTML = `
<h2>${anuncio.titulo}</h2>
<p>${anuncio.descricao}</p>
<span class="categoria">${anuncio.categoria}</span>
<p class="contato">${anuncio.anunciante} - ${anuncio.contato}</p>
       `;
       lista.appendChild(div);
     });
   });
 }
});