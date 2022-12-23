import Notiflix, { Notify } from 'notiflix';

export const fetchCountries = name => {
  const urlAPI = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages
`;

  return fetch(urlAPI)
    .then(data => {
      console.log(data);
      const status = data.status;

      if (status !== 200) {
        throw new Error(data);
      }

      return data.json();
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
};
