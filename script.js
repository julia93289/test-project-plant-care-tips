// Create a new IndexedDB database
const request = window.indexedDB.open('plantCareTips', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('tips', { keyPath: 'id' });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened successfully');
  
  const form = document.getElementById('tip-form');
  const speciesSelect = document.getElementById('species-select');
  const addSpeciesButton = document.getElementById('add-species');
  const newSpeciesInput = document.getElementById('new-species');

  addSpeciesButton.addEventListener('click', (event) => {
    const newSpecies = newSpeciesInput.value;
    if (newSpecies) {
      fetch('http://localhost:3000/species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ species: newSpecies })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Species added to the server');
        const newOption = document.createElement('option');
        newOption.value = newSpecies;
        newOption.textContent = newSpecies.charAt(0).toUpperCase() + newSpecies.slice(1);
        speciesSelect.appendChild(newOption);
        newSpeciesInput.value = '';
      });
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const tipInput = document.getElementById('tip');
    const tip = { id: Math.floor(Math.random() * 1000), tip: tipInput.value };
    
    fetch('http://localhost:3000/tips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tip)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Tip added to the server');
      tipInput.value = '';
      displayTips();
    });
  });
  
  speciesSelect.addEventListener('change', (event) => {
    const selectedSpecies = event.target.value;
    displayTipsBySpecies(selectedSpecies);
  });
  
  displayTips();
};

request.onerror = (event) => {
  console.log('Error opening database');
};

function displayTips() {
  fetch('http://localhost:3000/tips')
    .then(response => response.json())
    .then(data => {
      const tipsElement = document.getElementById('tips');
      
      tipsElement.innerHTML = '';
      
      data.forEach((tip) => {
        const tipElement = document.createElement('p');
        tipElement.textContent = tip.tip;
        tipsElement.appendChild(tipElement);
      });
    });
}

function displayTipsBySpecies(species) {
  fetch(`http://localhost:3000/tips?species=${species}`)
    .then(response => response.json())
    .then(data => {
      const tipsElement = document.getElementById('tips');
      
      tipsElement.innerHTML = '';
      
      data.forEach((tip) => {
        const tipElement = document.createElement('p');
        tipElement.textContent = tip.tip;
        tipsElement.appendChild(tipElement);
      });
    });
}
