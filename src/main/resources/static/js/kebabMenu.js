//kebabMenu.js

let kanbanTitle;
let kanbanDescription;
let kanbanId;
let kanbanColumns;

function createKebabMenu() {
  return `
      <div class="kebab-menu">
        <button class="columnKebab">
          <i class="fa-solid fa-ellipsis-vertical fa-2xl"></i>
        </button>
        <div class="kebab-dropdown">
          <button class="details-tile">Details</button>
          <button class="edit-tile">Edit</button>
          <button class="delete-tile">Delete</button>
        </div>
      </div>
  `;
}

// Add click event listener to the kebab menu only and prevent propagation for kebab menu clicks
function attachKebabListeners(tile) {
  const kebabMenu = tile.querySelector('.kebab-menu');
  const kebabDropdown = kebabMenu.querySelector('.kebab-dropdown');
  const detailsButton = kebabDropdown.querySelector('.details-tile');
  const editButton = kebabDropdown.querySelector('.edit-tile');
  const deleteButton = kebabDropdown.querySelector('.delete-tile');

  kebabMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click event from reaching the tile link
    event.preventDefault();  // Prevent default anchor link behavior
    toggleDropdown(kebabDropdown, event);
  });

  detailsButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.appManagerInstance.openDetailsModal(tile);
    hideAllDropdowns();
  });

  editButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.appManagerInstance.openModal(tile);
    hideAllDropdowns();
  });

  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    window.appManagerInstance.openDeleteModal(tile);
    hideAllDropdowns();
  });

  // Prevent the tile's anchor link from being followed when clicking on the kebab menu
  kebabMenu.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
}

document.addEventListener('click', () => hideAllDropdowns());

function toggleDropdown(dropdown, event) {
  const isVisible = dropdown.style.display === 'block';
  hideAllDropdowns(); // Hide all dropdowns first

  if (!isVisible) {
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const parentWidth = document.getElementById('background-container').offsetWidth;
      const parentHeight = document.getElementById('background-container').offsetHeight;
      let dropdownX = event.clientX - (viewportWidth - parentWidth) / 2 + 10;
      let dropdownY = event.clientY - (viewportHeight - parentHeight) / 2 + 10;

      dropdown.style.left = `${dropdownX}px`;
      dropdown.style.top = `${dropdownY}px`;
      dropdown.style.display = 'block';
  }
}

// Hides all kebab dropdown menus
function hideAllDropdowns() {
  document.querySelectorAll('.kebab-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
  });
}

document.addEventListener('click', () => hideAllDropdowns());
