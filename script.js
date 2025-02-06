// Create a new IndexedDB database
const request = window.indexedDB.open('plantCareTips', 1);

fetch('http://localhost:3000/tips')
  .then(response => response.json())
  .then(data => {
    const tipsDiv = document.getElementById('tips');
    data.forEach(tip => {
      const tipElement = document.createElement('p');
      tipElement.textContent = tip.tip;
      tipsDiv.appendChild(tipElement);
    });
  });

fetch('http://localhost:3000/species')
  .then(response => response.json())
  .then(data => {
    const speciesSelect = document.getElementById('species-select');
    data.forEach(species => {
      const optionElement = document.createElement('option');
      optionElement.textContent = species.name;
      speciesSelect.appendChild(optionElement);
    });
  });

document.getElementById('add-species').addEventListener('click', () => {
  const speciesName = document.getElementById('new-species').value;
  const speciesData = { name: speciesName };

  fetch('http://localhost:3000/species', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(speciesData)
  })
  .then(response => response.json())
  .then(data => {
    const speciesSelect = document.getElementById('species-select');
    const optionElement = document.createElement('option');
    optionElement.textContent = data.name;
    speciesSelect.appendChild(optionElement);
  });
});

document.getElementById("add-new-button").addEventListener("click", function() {
  var addNewSection = document.getElementById("add-new-section");
  if (addNewSection.style.display === "none") {
    addNewSection.style.display = "block";
  } else {
    addNewSection.style.display = "none";
  }
});
