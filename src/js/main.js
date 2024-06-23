import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import iziToast from 'izitoast';
import SlimSelect from 'slim-select';
import 'izitoast/dist/css/iziToast.min.css';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

let isIntitialized = false;
loader.style.display = 'none';

const slimSelectInstance = new SlimSelect({
  select: breedSelect,
});

function populateBreedSelect(breeds) {
  breedSelect.innerHTML = `<option value='' selected>Select a breed</option>` +
    breeds.map(breed =>
      `<option value='${breed.id}'>${breed.name}</option>`,
    ).join('');
  slimSelectInstance.setData([
    { text: 'Select a breed', value: '', selected: true },
    ...breeds.map(breed => ({ text: breed.name, value: breed.id })),
  ]);
}

function showLoader() {
  loader.style.display = 'inline-block';
  if(!isIntitialized) {
    document.querySelector('.ss-main').style.display = 'none'
  }
}

function hideLoader() {
  loader.style.display = 'none';
  if(!isIntitialized) {
    document.querySelector('.ss-main').style.display = 'flex'
    isIntitialized = true;
  }
}

function showError(message) {
  iziToast.error({
    title: 'Error',
    message: message,
  });
}

function updateCatInfo(cat) {
  catInfo.innerHTML = `
    <img src='${cat.url}' alt='${cat.breeds[0].name}' />
    <h2>${cat.breeds[0].name}</h2>
    <p>${cat.breeds[0].description}</p>
    <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  showLoader();
  fetchBreeds()
    .then(breeds => {
      hideLoader();
      populateBreedSelect(breeds);
    })
    .catch(err => {
      hideLoader();
      showError('Failed to load breed information. Please try again later.');
    });
});

breedSelect.addEventListener('change', event => {
  const breedId = event.target.value;
  if (!breedId) return;

  showLoader();
  catInfo.innerHTML = '';

  fetchCatByBreed(breedId)
    .then(cat => {
      hideLoader();
      updateCatInfo(cat);
    })
    .catch(err => {
      hideLoader();
      showError('Failed to load cat information. Please try again later.');
    });
});
