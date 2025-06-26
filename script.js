// Function to create a tip element
function createTipElement(tip) {
  const tipElement = document.createElement('p');
  tipElement.textContent = tip.tip;

  // Add upvote count
  const upvoteCount = document.createElement('span');
  upvoteCount.textContent = ` (Upvotes: ${tip.upvotes || 0})`;
  tipElement.appendChild(upvoteCount);

  const upvoteButton = document.createElement('button');
  upvoteButton.textContent = 'Upvote';
  upvoteButton.onclick = () => upvoteTip(tip.id);

  const downvoteButton = document.createElement('button');
  downvoteButton.textContent = 'Downvote';
  downvoteButton.onclick = () => downvoteTip(tip.id);

  tipElement.appendChild(upvoteButton);
  tipElement.appendChild(downvoteButton);

  return tipElement;
}

// Function to upvote a tip
function upvoteTip(id) {
  fetch(`http://localhost:3000/tips/${id}/upvote`, { method: 'POST' })
      .then(response => response.json())
      .then(data => console.log('Tip upvoted successfully'))
      .catch(error => console.error('Error upvoting tip:', error));
}

// Function to downvote a tip
function downvoteTip(id) {
  fetch(`http://localhost:3000/tips/${id}/downvote`, { method: 'POST' })
      .then(response => response.json())
      .then(data => console.log('Tip downvoted successfully'))
      .catch(error => console.error('Error downvoting tip:', error));
}

// Function to add a new tip
function addTip() {
  const newTipInput = document.getElementById('new-tip-input');
  const newTipText = newTipInput.value;
  const selectSpecies = document.getElementById('species-select');
  const selectedSpeciesText = selectSpecies.value;

  fetch('http://localhost:3000/tips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tip: newTipText, species: selectedSpeciesText }),
  })
      .then(response => response.json())
      .then(data => {
        const tipsDiv = document.getElementById('tips');
        const tipElement = createTipElement(data);
        tipsDiv.appendChild(tipElement);
        newTipInput.value = '';
      })
      .catch(error => console.error('Error adding tip:', error));
}

// Function to add a new species
function addSpecies() {
  const speciesName = document.getElementById('new-species').value;
  const speciesData = { name: speciesName };

  fetch('http://localhost:3000/species', {
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
      });
}

// Function to load tips
function loadTips() {
  const selectSpecies = document.getElementById('species-select');
  const selectedSpeciesText = selectSpecies.value;

  fetch(`http://localhost:3000/tips?species=${selectedSpeciesText}`)
      .then(response => response.json())
      .then(data => {
        const tipsDiv = document.getElementById('tips');
        tipsDiv.innerHTML = '';
        // Sort tips by upvotes in descending order
        data.sort((a, b) => b.upvotes - a.upvotes);
        data.forEach(tip => {
          const tipElement = createTipElement(tip);
          tipsDiv.appendChild(tipElement);
        });
      });
}

// Load species
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