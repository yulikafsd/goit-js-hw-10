import { getRefs } from './getRefs';
import { clearMarkup } from './clearMarkup';
import { Notify } from 'notiflix';

const refs = getRefs();

export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,flags,population,languages`
  )
    .then(r => {
      if (!r.ok) {
        clearMarkup();
        Notify.failure('Oops, there is no country with that name');
        throw new Error(r.status);
      }
      return r.json();
    })

    .then(countries => {
      if (countries.length > 10) {
        clearMarkup();
        Notify.info('Too many matches found. Please, enter a more specific name.');
      } else if (countries.length > 1) {
        makeListMarkup(countries);
      } else {
        makeInfoMarkup(countries);
      }
    })
    .catch(e => console.log('Error catched: ', e));
}

function makeListMarkup(countriesArr) {
  const markup = countriesArr
    .map(country => {
      return `<li class="list-item"><img class = "list-item__image" src="${country.flags.svg}" alt="flag of ${country.name.common} width="15px"/><p class = "list-item__name">${country.name.common}</p></li>`;
    })
    .join('');
  refs.listEl.innerHTML = markup;
  return markup;
}

function makeInfoMarkup(countriesArr) {
  const langs = Object.values(countriesArr[0].languages).join(', ');
  const markup = countriesArr
    .map(country => {
      return `<div class="country-info__header"><img class="country-info__image" src="${country.flags.svg}" alt="flag of ${country.name.common}" /><h2 class="country-info__name">${country.name.common}</h2></div><p class="country-info__title">Capital: <span>${country.capital}</span></p><p class="country-info__title">Population: <span class="country-info__span">${country.population}</span></p><p class="country-info__title">Languages: <span class="country-info__span">${langs}</span></p>`;
    })
    .join('');
  refs.listEl.innerHTML = markup;
  return markup;
}
