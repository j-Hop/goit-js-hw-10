import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
const enterIn = document.querySelector("input#search-box");



enterIn.addEventListener("input", debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  if(event.target.value.trim() === ''){
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(event.target.value.trim())
  .then(data => {
    if(data.length > 10){
      tooManyMatchesFound();
    } else if(data.length === 1){
      renderCountryCard(data);
    } else if(data.length >= 2 && data.length <= 10){
      renderCountryList(data);
    }
  })
  .catch(error => {
    Notiflix.Notify.faifure('Oops, there is no country with that name!');
  });
}

function tooManyMatchesFound(){
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function renderCountryCard(data){
  countryInfo.innerHTML = '';
  countryList.innerHTML = data
  .map(({name, flags, capital, population, languages}) => {
    return `<img src="${flags.svg}" alt="${flags.alt}" width="100"/>
    <h2> ${name.common}, (${name.official})</h2>
    <p>Capital: ${capital}</p>
    <p>Languages: ${Object.values(languages).join('')}</p>
    <p>Population: ${population}</p>`;
  })
    .join('');
}

function renderCountryList(data){
  countryInfo.innerHTML = '';
  countryList.innerHTML = data
  .map(({flags, name}) => {
    `<li class="list-item"><img src="${flags.svg}" alt="${flags.alt}" width="100"/>
    <h2> ${name.common}, (${name.official})</h2></li>`;
  })
  .join('');
}

