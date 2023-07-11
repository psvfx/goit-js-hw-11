'use strict';
// Імпорт бібліотек:
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import notiflix from 'notiflix';

// https://pixabay.com/api/docs/
// 	Your API key: 38192027-861d4e16491b6b9cd5923fcdb

// Отримання посилання на форму пошуку та галерею:
const seachFormEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
// console.log(seachForm);
// console.log(gallery);

// Обробник подій форми пошуку:
seachFormEl.addEventListener('submit', async event => {
  event.preventDefault();

  // Отримання значення пошукового запиту:
  const searchQuery = event.target.elements.searchQuery.value;

  try {
    // Виконання HTTP-запиту до Pixabay API:
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '38192027-861d4e16491b6b9cd5923fcdb',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40, // кількість зображень на сторінці
      },
    });

    const { data } = response;

    // Перевірка результатів пошуку:
    if (data.hits.length === 0) {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    // Очищення галереї перед новим пошуком:
    gallery.innerHTML = '';

    // Додавання зображення до галереї:
    data.hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });

    // Відображення повідомлення з кількістю знайдених зображень:
    notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    // Показ кнопки "Load more":
    showLoadMoreButton();
  } catch (error) {
    console.error('Error:', error);
    notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
});

// Функція приймання обєкту зображення та повернення розмітки картки:
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  info.append(likes, views, comments, downloads);
  card.append(img, info);

  return card;
}
