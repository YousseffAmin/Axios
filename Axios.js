document.addEventListener('DOMContentLoaded', initialLoad);

async function initialLoad() {
    const breedSelect = document.getElementById('breedSelect');
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    const breeds = await response.json();

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

    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&limit=5`);
    const images = await response.json();

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
