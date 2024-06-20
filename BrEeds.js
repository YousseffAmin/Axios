import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = 'YOUR_API_KEY';

// Interceptors for logging time and showing progress
axios.interceptors.request.use(config => {
    console.log('Request started');
    document.body.style.cursor = 'progress';
    document.getElementById('progressBar').style.width = '0%';
    config.metadata = { startTime: new Date() };
    return config;
});

axios.interceptors.response.use(response => {
    const time = new Date() - response.config.metadata.startTime;
    console.log(`Request took ${time} ms`);
    document.body.style.cursor = 'default';
    return response;
}, error => {
    document.body.style.cursor = 'default';
    return Promise.reject(error);
});

function updateProgress(progressEvent) {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    document.getElementById('progressBar').style.width = `${progress}%`;
}

async function initialLoad() {
    const breedSelect = document.getElementById('breedSelect');
    const response = await axios.get('/breeds');
    const breeds = response.data;

    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });

    breedSelect.addEventListener('change', handleBreedSelect);
    breedSelect.dispatchEvent(new Event('change')); // Trigger initial load
}

async function handleBreedSelect(event) {
    const breedId = event.target.value;
    const carousel = document.getElementById('carousel');
    const infoDump = document.getElementById('infoDump');

    // Clear previous content
    carousel.innerHTML = '';
    infoDump.innerHTML = '';

    const response = await axios.get(`/images/search?breed_id=${breedId}&limit=5`, {
        onDownloadProgress: updateProgress
    });
    const images = response.data;

    images.forEach(imageData => {
        const img = document.createElement('img');
        img.src = imageData.url;
        img.alt = 'Cat Image';
        carousel.appendChild(img);
    });

    const breedInfo = images[0].breeds[0];
    const infoContent = `
        <h2>${breedInfo.name}</h2>
        <p>${breedInfo.description}</p>
        <p>Temperament: ${breedInfo.temperament}</p>
        <p>Origin: ${breedInfo.origin}</p>
        <p>Life span: ${breedInfo.life_span} years</p>
    `;
    infoDump.innerHTML = infoContent;
}

document.addEventListener('DOMContentLoaded', initialLoad);
