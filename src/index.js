import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getRefs } from './js/getRefs';
import { clearMarkup, makeListMarkup, makeInfoMarkup } from './js/renderFunctions';
import { fetchCountries } from './js/fetchCountries';
import { hideLoader, showLoader } from './js/loaderFunctions';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  clearMarkup();
  showLoader();
  trimmedValue = e.target.value.trim();
  console.log(trimmedValue);

  if (!trimmedValue) {
    Notify.warning('Please, specify country');
    hideLoader();
  } else {
    fetchCountries(trimmedValue).then(renderMarkup).catch(handleError);
  }
}

function renderMarkup(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please, enter a more specific name.');
    hideLoader();
  } else if (countries.length > 1) {
    refs.listEl.innerHTML = makeListMarkup(countries);
    hideLoader();
    renderCountry(countries);
  } else {
    refs.listEl.innerHTML = makeInfoMarkup(countries);
    hideLoader();
  }
}

function handleError() {
  Notify.failure('Oops, there is no country with that name');
  hideLoader();
}

function renderCountry(arr) {
  const countriesItems = document.querySelectorAll('.list-item');
  countriesItems.forEach(country => country.addEventListener('click', onClick));
  hideLoader();
  Notify.info('Choose a country from the list or keep printing');

  function onClick({ currentTarget }) {
    showLoader();
    const filteredCountry = arr.filter(
      country => currentTarget.dataset.name === country.name.official
    );
    refs.listEl.innerHTML = makeInfoMarkup(filteredCountry);
    refs.inputEl.value = '';
    hideLoader();
    countriesItems.forEach(country => country.removeEventListener('click', onClick));
  }
}

// Перші макарони:

// function onInput(e) {
//   const name = e.target.value.trim();

//   if (name.length <= 0) {
//     refs.listEl.innerHTML = '';
//     refs.infoEl.innerHTML = '';
//     Notify.failure('Please, put in the country');
//   } else {
//     fetch(
//       `https://restcountries.com/v3.1/name/${name}?fields=name,capital,flags,population,languages`
//     )
//       .then(r => {
//         if (!r.ok) {
//           refs.listEl.innerHTML = '';
//           refs.infoEl.innerHTML = '';
//           Notify.failure('Oops, there is no country with that name');
//           throw new Error(r.status);
//         }
//         return r.json();
//       })
//       .then(countries => {
//         if (countries.length > 10) {
//           refs.listEl.innerHTML = '';
//           refs.infoEl.innerHTML = '';
//           Notify.info(
//             'Too many matches found. Please, enter a more specific name.'
//           );
//         } else if (countries.length > 1) {
//           const markup = countries
//             .map(country => {
//               return `<li class="list-item"><img class = "list-item__image" src="${country.flags.svg}" alt="flag of ${country.name.common} width="15px"/><p class = "list-item__name">${country.name.common}</p></li>`;
//             })
//             .join('');
//           refs.listEl.innerHTML = markup;
//           return markup;
//         } else {
//           const langs = Object.values(countries[0].languages).join(', ');
//           const markup = countries
//             .map(country => {
//               return `<div class="country-info__header"><img class="country-info__image" src="${country.flags.svg}" alt="flag of ${country.name.common}" /><h2 class="country-info__name">${country.name.common}</h2></div><p class="country-info__title">Capital: <span>${country.capital}</span></p><p class="country-info__title">Population: <span class="country-info__span">${country.population}</span></p><p class="country-info__title">Languages: <span class="country-info__span">${langs}</span></p>`;
//             })
//             .join('');
//           refs.listEl.innerHTML = markup;
//           return markup;
//         }
//       })
//       .catch(e => console.log('Error catched: ', e));
//   }
// }
