// Salvar anúncio
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
     let anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
     anuncios.push(anuncio);
     localStorage.setItem('anuncios', JSON.stringify(anuncios));
     alert('Anúncio publicado com sucesso!');
     window.location.href = 'index.html';
   });
 }
 // Listar anúncios
 const lista = document.getElementById('lista-anuncios');
 if (lista) {
   const anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
   if (anuncios.length === 0) {
     lista.innerHTML = '<p>Nenhum anúncio publicado ainda.</p>';
   } else {
     anuncios.reverse().forEach((anuncio) => {
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
   }
 }
});