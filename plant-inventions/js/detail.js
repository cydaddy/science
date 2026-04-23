document.addEventListener('DOMContentLoaded', () => {
  // Get plant ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get('id');

  // Find the plant data
  const plant = plantData.find(p => p.id === plantId);

  if (!plant) {
    document.querySelector('.detail-container').innerHTML = '<h2>해당 식물을 찾을 수 없습니다.</h2><a href="index.html" class="back-btn">목록으로 돌아가기</a>';
    return;
  }

  // Update page title
  document.title = `${plant.name} - 식물의 특징은 생활 속에서 이렇게 이용되었어요`;

  // Update DOM elements
  document.getElementById('plant-name').textContent = plant.name;
  document.getElementById('plant-feature').textContent = plant.feature;
  document.getElementById('plant-usage').textContent = plant.usage;
  
  // Convert newlines to <br> for better readability in the story
  document.getElementById('plant-story').innerHTML = plant.story.replace(/\n\n/g, '<br><br>');

  // Set up images
  const plantImgContainer = document.getElementById('plant-image');
  plantImgContainer.innerHTML = `<img src="images/${encodeURIComponent(plant.plantImage)}" alt="${plant.name}" onerror="this.onerror=null; this.parentNode.innerHTML='식물 사진을 넣어주세요<br>(${plant.plantImage})'">`;

  const usageImgContainer = document.getElementById('usage-image');
  usageImgContainer.innerHTML = `<img src="images/${encodeURIComponent(plant.usageImage)}" alt="${plant.usage}" onerror="this.onerror=null; this.parentNode.innerHTML='활용 물건 사진을 넣어주세요<br>(${plant.usageImage})'">`;
});
