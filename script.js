// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
// Configuração do Firebase
const firebaseConfig = {
 apiKey: "AIzaSyApq4Aap0ab3i0ihC2NnGAgcA8MKdDw4JY",
 authDomain: "mural-senac.firebaseapp.com",
 databaseURL: "https://mural-senac-default-rtdb.firebaseio.com",
 projectId: "mural-senac",
 storageBucket: "mural-senac.firebasestorage.app",
 messagingSenderId: "919910834762",
 appId: "1:919910834762:web:c6d6a1fe6121f7aebafcb3"
};
// Inicialização
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let todosAnuncios = []; // Armazena todos para filtro posterior
document.addEventListener('DOMContentLoaded', () => {
 const form = document.getElementById('form-anuncio');
 const lista = document.getElementById('lista-anuncios');
 const filtro = document.getElementById('filtro-categoria');
 // === PUBLICAR ANÚNCIO ===
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
 // === LISTAR + FILTRAR ANÚNCIOS ===
 if (lista) {
   const anunciosRef = ref(database, 'anuncios');
   onValue(anunciosRef, (snapshot) => {
     const anunciosObj = snapshot.val();
     if (!anunciosObj) {
       lista.innerHTML = '<p>Nenhum anúncio publicado ainda.</p>';
       return;
     }
     // Transforma em array com id
     todosAnuncios = Object.entries(anunciosObj)
       .map(([id, dados]) => ({ id, ...dados }))
       .reverse();
     renderAnuncios(filtro.value);
   });
   // Filtro por categoria
   if (filtro) {
     filtro.addEventListener('change', () => {
       renderAnuncios(filtro.value);
     });
   }
   // Renderizar anúncios filtrados
   function renderAnuncios(categoriaSelecionada) {
     lista.innerHTML = '';
     const filtrados = categoriaSelecionada
       ? todosAnuncios.filter(anuncio => anuncio.categoria === categoriaSelecionada)
       : todosAnuncios;
     if (filtrados.length === 0) {
       lista.innerHTML = '<p>Nenhum anúncio nessa categoria.</p>';
       return;
     }
     filtrados.forEach((anuncio) => {
       const div = document.createElement('div');
       div.classList.add('anuncio');
       div.innerHTML = `
<h2>${anuncio.titulo}</h2>
<p>${anuncio.descricao}</p>
<span class="categoria">${anuncio.categoria}</span>
<p class="contato">${anuncio.anunciante} - ${anuncio.contato}</p>
<button class="btn-excluir" data-id="${anuncio.id}">Excluir</button>
       `;
       lista.appendChild(div);
     });
     // Adicionar eventos aos botões de excluir
     document.querySelectorAll('.btn-excluir').forEach((botao) => {
       botao.addEventListener('click', () => {
         const id = botao.getAttribute('data-id');
         if (confirm('Tem certeza que deseja excluir este anúncio?')) {
           const anuncioRef = ref(database, 'anuncios/' + id);
           remove(anuncioRef)
             .then(() => {
               alert('Anúncio excluído com sucesso!');
             })
             .catch((error) => {
               alert('Erro ao excluir: ' + error.message);
             });
         }
       });
     });
   }
 }
});