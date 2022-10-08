import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getRefs } from './js/getRefs';
import { clearMarkup } from './js/clearMarkup';
import { fetchCountries } from './js/fetchCountries';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
let inputValue;

function onInput(e) {
  inputValue = e.target.value.trim();
  const namePrinted = inputValue.length > 0;

  if (!namePrinted) {
    clearMarkup();
    Notify.failure('Please, enter a country name');
  } else {
    fetchCountries(inputValue);
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
