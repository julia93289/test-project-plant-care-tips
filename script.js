// Function to create a tip element
function createTipElement(tip) {
  const tipElement = document.createElement('div');
  tipElement.className = 'tip-item';
  
  const tipText = document.createElement('p');
  tipText.textContent = tip.tip;
  
  const upvoteCount = document.createElement('span');
  upvoteCount.className = 'upvote-count';
  upvoteCount.textContent = `Upvotes: ${tip.upvotes || 0}`;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const upvoteButton = document.createElement('button');
  upvoteButton.textContent = 'Upvote';
  upvoteButton.onclick = () => upvoteTip(tip.id);

  const downvoteButton = document.createElement('button');
  downvoteButton.textContent = 'Downvote';
  downvoteButton.onclick = () => downvoteTip(tip.id);

  buttonContainer.appendChild(upvoteCount);
  buttonContainer.appendChild(upvoteButton);
  buttonContainer.appendChild(downvoteButton);

  tipElement.appendChild(tipText);
  tipElement.appendChild(buttonContainer);

  return tipElement;
}

// Function to upvote a tip
function upvoteTip(id) {
  // First get the current tip data
  fetch(`http://localhost:12000/tips/${id}`)
      .then(response => response.json())
      .then(tip => {
        const newUpvotes = (tip.upvotes || 0) + 1;
        return fetch(`http://localhost:12000/tips/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upvotes: newUpvotes })
        });
      })
      .then(response => response.json())
      .then(data => {
        console.log('Tip upvoted successfully');
        loadTips(); // Reload tips to show updated count and sorting
      })
      .catch(error => console.error('Error upvoting tip:', error));
}

// Function to downvote a tip
function downvoteTip(id) {
  // First get the current tip data
  fetch(`http://localhost:12000/tips/${id}`)
      .then(response => response.json())
      .then(tip => {
        const newUpvotes = Math.max((tip.upvotes || 0) - 1, 0); // Don't go below 0
        return fetch(`http://localhost:12000/tips/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upvotes: newUpvotes })
        });
      })
      .then(response => response.json())
      .then(data => {
        console.log('Tip downvoted successfully');
        loadTips(); // Reload tips to show updated count and sorting
      })
      .catch(error => console.error('Error downvoting tip:', error));
}

// Function to add a new tip
function addTip() {
  const newTipInput = document.getElementById('new-tip-input');
  const newTipText = newTipInput.value;
  const selectSpecies = document.getElementById('species-select');
  const selectedSpeciesText = selectSpecies.value;

  fetch('http://localhost:12000/tips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tip: newTipText, species: selectedSpeciesText, upvotes: 0 }),
  })
      .then(response => response.json())
      .then(data => {
        newTipInput.value = '';
        loadTips(); // Reload tips to show the new tip in sorted order
      })
      .catch(error => console.error('Error adding tip:', error));
}

// Function to add a new species
function addSpecies() {
  const speciesName = document.getElementById('new-species').value;
  const speciesData = { name: speciesName };

  fetch('http://localhost:12000/species', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(speciesData),
  })
      .then(response => response.json())
      .then(data => {
        const speciesSelect = document.getElementById('species-select');
        const optionElement = document.createElement('option');
        optionElement.textContent = data.name;
        speciesSelect.appendChild(optionElement);
        document.getElementById('new-species').value = '';
      });
}

// Function to load tips
function loadTips() {
  const selectSpecies = document.getElementById('species-select');
  const selectedSpeciesText = selectSpecies.value;

  fetch(`http://localhost:12000/tips?species=${selectedSpeciesText}`)
      .then(response => response.json())
      .then(data => {
        // Sort tips by upvotes in descending order (highest first)
        const sortedTips = data.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        
        const tipsDiv = document.getElementById('tips');
        tipsDiv.innerHTML = '';
        sortedTips.forEach(tip => {
          const tipElement = createTipElement(tip);
          tipsDiv.appendChild(tipElement);
        });
      });
}

// Load species
fetch('http://localhost:12000/species')
    .then(response => response.json())
    .then(data => {
      const speciesSelect = document.getElementById('species-select');
      data.forEach(species => {
        const optionElement = document.createElement('option');
        optionElement.textContent = species.name;
        speciesSelect.appendChild(optionElement);
      });
    });

// Event listeners
document.getElementById('species-select').addEventListener('change', loadTips);
document.getElementById('add-tip-button').addEventListener('click', addTip);
document.getElementById('add-species-button').addEventListener('click', addSpecies);
document.getElementById('addSpeciesBtn').addEventListener('click', () => {
  const addNewSpeciesSection = document.getElementById('add-new-species-section');
  addNewSpeciesSection.style.display = addNewSpeciesSection.style.display === 'none' ? 'block' : 'none';
});
document.getElementById('addTipBtn').addEventListener('click', () => {
  const addNewTipSection = document.getElementById('add-new-tip-section');
  addNewTipSection.style.display = addNewTipSection.style.display === 'none' ? 'block' : 'none';
});

// Initial load
loadTips();