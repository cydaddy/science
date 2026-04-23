document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('plant-grid');

  plantData.forEach(plant => {
    // Create the card element
    const card = document.createElement('a');
    card.href = `detail.html?id=${plant.id}`;
    card.className = 'card';

    // Image placeholder
    const imgPlaceholder = document.createElement('div');
    imgPlaceholder.className = 'card-img-placeholder';
    imgPlaceholder.innerHTML = `<img src="images/${plant.plantImage}" alt="${plant.name}" onerror="this.onerror=null; this.parentNode.innerHTML='식물 사진을 넣어주세요<br>(${plant.plantImage})'">`;

    // Content container
    const content = document.createElement('div');
    content.className = 'card-content';

    const name = document.createElement('h2');
    name.className = 'plant-name';
    name.textContent = plant.name;

    const feature = document.createElement('p');
    feature.className = 'plant-feature';
    feature.textContent = plant.feature;

    const usage = document.createElement('span');
    usage.className = 'plant-usage';
    usage.textContent = `이용: ${plant.usage}`;

    content.appendChild(name);
    content.appendChild(feature);
    content.appendChild(usage);

    card.appendChild(imgPlaceholder);
    card.appendChild(content);

    gridContainer.appendChild(card);
  });
});
