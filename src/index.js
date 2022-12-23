import { Notify } from 'notiflix';
import './css/styles.css';

const API_KEY = '32302956-bbb850179db0fe460a4f0a5f2';
let currentPage = 1;
const searchRef = document.querySelector(`[name='searchQuery']`);
const searchBtnRef = document.querySelector(`.search-btn`);
const searchForm = document.querySelector(`.search-form`);
const loadMoreBtn = document.querySelector(`.load-more`);
const galleryRef = document.querySelector(`.cataloge-list`);

searchForm.addEventListener('submit', searchHandler);
console.log(searchBtnRef);
loadMoreBtn.addEventListener('click', searchHandler);
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
let query = '';
async function searchHandler(event) {
  event.preventDefault();
  query = searchRef.value;
  console.log(query);
  const urlAPI = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=8
`;
  try {
    const data = await fetch(urlAPI).then(res => {
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return res.json();
    });

    currentPage += 1;

    console.log(data);

    const resultData = data.hits;
    if (resultData.length === 0) {
      alert(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    galleryRef.innerHTML += resultData
      .map(item => buildPhotoCard(item))
      .join('');
  } catch (error) {
    console.log(error.message);
  }
}

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
