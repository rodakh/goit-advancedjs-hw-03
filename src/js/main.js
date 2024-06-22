import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import iziToast from 'izitoast';
import SlimSelect from 'slim-select';
import 'izitoast/dist/css/iziToast.min.css';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

error.style.display = 'none';
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
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  error.style.display = 'block';
}

function hideError() {
  error.style.display = 'none';
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
      showError();
      iziToast.error({
        title: 'Error',
        message: `Failed to fetch breeds. Please try again later. (${err})`,
      });
    });
});

breedSelect.addEventListener('change', event => {
  const breedId = event.target.value;
  if (!breedId) return;

  showLoader();
  hideError();
  catInfo.innerHTML = '';

  fetchCatByBreed(breedId)
    .then(cat => {
      hideLoader();
      updateCatInfo(cat);
    })
    .catch(err => {
      hideLoader();
      showError();
      iziToast.error({
        title: 'Error',
        message: `Failed to fetch cat information. Please try again later. (${err})`,
      });
    });
});
