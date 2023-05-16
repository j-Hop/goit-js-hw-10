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

  const info = event.target.value.trim();

  if(info === ''){
    onInfo();
    onList();
    return;
  }

  fetchCountries(info)
  .then(data => {
    if(data.length > 10){
      tooManyMatchesFound();
    } else if(data.length === 1){
      renderCountryCard(data);
    } else if(data.length >= 2 && data.length <= 10){
      renderCountryCard(data);
    }
  })
  .catch(error => {
    Notiflix.Notify.info('Oops, there is no country with that name!');
  });
}

function onInfo(){
  countryInfo.innerHTML = '';
}

function onList(){
  countryList.innerHTML = '';
}

///Функція для специфічного імені країни тобто якої не існую вказую на помилку користувачу
function tooManyMatchesFound(){
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}


// Функія для поточної країни
function renderCountryCard(data){
    onInfo();
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



