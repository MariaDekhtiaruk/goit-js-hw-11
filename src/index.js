import { Notify } from 'notiflix';
import './css/styles.css';
import NewApiServices from './fetchAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const newApiService = new NewApiServices();

const searchRef = document.querySelector(`[name='searchQuery']`);
const searchBtnRef = document.querySelector(`.search-btn`);
const searchForm = document.querySelector(`.search-form`);
const loadMoreBtn = document.querySelector(`.load-more`);
const galleryRef = document.querySelector(`.cataloge-list`);

searchForm.addEventListener('submit', searchHandler);
console.log(searchBtnRef);
loadMoreBtn.addEventListener('click', onLoadMore);

async function searchHandler(event) {
  event.preventDefault();
  galleryRef.innerHTML = '';
  newApiService.query = searchRef.value;
  if (newApiService.query === '') {
    return Notify.warning('Fill something');
  }
  newApiService.resetPage();
  const pictures = await newApiService.fetchPictures();
  if (pictures.length === 0) {
    return;
  }

  galleryRef.innerHTML += pictures.map(item => buildPhotoCard(item)).join('');
  Notify.info(`Hooray! We found totalHits images: ${newApiService.totalHits}`);

  if (!newApiService.isLastPage) {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

async function onLoadMore(event) {
  loadMoreBtn.classList.add('is-hidden');
  event.preventDefault();

  const pictures = await newApiService.fetchPictures();

  galleryRef.innerHTML += pictures.map(item => buildPhotoCard(item)).join('');

  if (newApiService.isLastPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

const buildPhotoCard = card => {
  return `<li class="photo-card">
  <img class="image" src="${card.webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${card.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${card.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${card.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${card.downloads}</b>
    </p>
  </div>
</li>`;
};

// searchRef.addEventListener('input', e => {
//   const searchName = e.target.value.trim();
// }
// }
// function createCountryElements(countryArray = []) {
//   console.log(countryArray.length);
//   if (countryArray.length === 1) {
//     return countryArray
//       .map(({ name, capital, population, flags, languages }) => {
//         return `<div class="country">
//         <div class="country-flag">
//         <img class="flag-img" src="${flags.svg}" alt="${
//           name.official
//         } "width="20" height="20" loading="lazy">
//         <h2 class="name">${name.official}</h2>
//         </div>
//     <h2 class="value"> Capital: ${capital[0]}</h2>
//     <h2 class="value"> Population: ${population}</h2>

//    <h2 class="value"> Languages: ${Object.values(languages).join(', ')}</h2>
//   </div>`;
//       })
//       .join('');
//   } else if (countryArray.length === 0) {
//     return '';
//   } else if (countryArray.length > 10) {
//     Notify.warning(
//       'Too many matches found. Please enter a more specific name.'
//     );
//     return '';
//   } else {
//     return countryArray
//       .map(({ name, flags }) => {
//         return `<div class="country-flag">
//         <img class="flag-img" src="${flags.svg}" alt="${name.official} "width="20" height="20" loading="lazy">
//         <h2 class="value">${name.official}</h2>
//         </div>`;
//       })
//       .join('');
//   }
// }
