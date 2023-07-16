// Fetch the material list from the server and populate the material list
function fetchMaterials() {
  // Make an AJAX request to fetch the list of materials from the server
  // Replace the URL with your backend endpoint for fetching materials
  fetch('api/materials')
    .then(response => response.json())
    .then(data => {
      const materialList = document.getElementById('material-list');
      materialList.innerHTML = '';
      data.forEach(material => {
        const listItem = document.createElement('li');
        listItem.textContent = material.title;
        listItem.setAttribute('data-url', material.url);
        listItem.addEventListener('click', handleMaterialDownload);
        materialList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching materials:', error));
}

// Handle the download of a study material
function handleMaterialDownload(event) {
  const materialUrl = event.target.getAttribute('data-url');
  window.open(materialUrl, '_blank');
}

// Add a new material to the repository
function addMaterial(event) {
  event.preventDefault();

  const materialTitle = document.getElementById('material-title').value;
  const materialUrl = document.getElementById('material-url').value;

  // Make an AJAX request to add the material to the server
  // Replace the URL with your backend endpoint for adding materials
  fetch('api/materials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: materialTitle, url: materialUrl }),
  })
    .then(response => response.json())
    .then(data => {
      // Refresh the material list after adding the new material
      fetchMaterials();

      // Clear the input fields
      document.getElementById('material-title').value = '';
      document.getElementById('material-url').value = '';
    })
    .catch(error => console.error('Error adding material:', error));
}

// Add event listeners to the form submissions
document.getElementById('material-form').addEventListener('submit', addMaterial);
document.getElementById('assignment-form').addEventListener('submit', uploadAssignment);
document.getElementById('review-form').addEventListener('submit', submitReview);

// Fetch the materials when the page loads
fetchMaterials();
