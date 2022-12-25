import { Notify } from 'notiflix';
import './css/styles.css';
import NewApiServices from './fetchAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const newApiService = new NewApiServices();

const searchRef = document.querySelector(`[name='searchQuery']`);
const searchBtnRef = document.querySelector(`.search-btn`);
const searchForm = document.querySelector(`.search-form`);
const loadMoreBtn = document.querySelector(`.load-more`);
const galleryRef = document.querySelector(`.cataloge-list`);
let instance = null;
searchForm.addEventListener('submit', searchHandler);
console.log(searchBtnRef);
loadMoreBtn.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionSelector: `img`,
  captionPosition: `bottom`,
  captionDelay: 250,
});
function onEscapePress(evt) {
  console.log(evt.key);
  if (evt.key === 'Escape') {
    instance.close();
  }
}

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

  lightbox.refresh();
  if (!newApiService.isLastPage) {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

window.addEventListener(
  'scroll',
  throttle(e => {
    if (newApiService.isLastPage) {
      return;
    }
    const pageFullHeight = document.body.offsetHeight;
    const bottomViewPoint = window.innerHeight + window.scrollY;
    if (bottomViewPoint >= pageFullHeight) {
      onLoadMore();
    }
  }, 300)
);

async function onLoadMore(event) {
  loadMoreBtn.classList.add('is-hidden');
  event?.preventDefault();

  const pictures = await newApiService.fetchPictures();

  galleryRef.innerHTML += pictures.map(item => buildPhotoCard(item)).join('');
  await lightbox.refresh();
  if (newApiService.isLastPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const buildPhotoCard = card => {
  return `<li class="photo-card">
  <a class="gallery-item" href="${card.largeImageURL}">
  <img class="image" src="${card.webformatURL}" alt="" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: <span class="info-item-data"> ${card.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views: <span class="info-item-data"> ${card.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments: <span class="info-item-data"> ${card.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads:<span class="info-item-data"> ${card.downloads}</span></b>
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
