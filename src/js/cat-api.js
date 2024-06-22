import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = 'live_45Jf0BQQbEXHmhLx1lKDFvLPiMs13lHsJHjJZeEv5gqp14Prpgo7oMtGjRVC8AS1';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      throw new Error(`Error fetching breeds ${error}`,);
    });
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      throw new Error(`Error fetching cat by breed ${error}`);
    });
}
