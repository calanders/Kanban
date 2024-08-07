// tiles.js

const endpoint = 'http://localhost:8080/api';

fetchProjects();

// Get the data from endpoint and store it in kanban JSON array
const projects = [];
function fetchProjects() {
    fetch(endpoint + '/projects')
        .then(blob => blob.json())
        .then(data => {
            projects.push(data);
            loadProjects();
        }
    );
}

function loadProjects() {
    for (k = 0; k < projects[0].kanbans.length; k++) {
        let kanban = projects[0].kanbans[k];
        createTile(kanban.id, kanban.title, kanban.description, kanban.columns);
    }
}

function redirectToKanban(id) {
    window.location.href = 'kanban.html?id=' + id;
}

let flexContainer = document.getElementById('flexContainer');
let addTileBtn = document.getElementById('addTileBtn');
let existingTileIds = new Set(); // Track existing tile IDs

document.addEventListener('DOMContentLoaded', () => {
    addTileBtn.addEventListener('click', () => {
        window.appManagerInstance.openModal(); // Use the globally defined appManagerInstance
    });
});

function createTileFromJSON(jsonArray) {
    jsonArray.forEach(item => {
        if (!existingTileIds.has(item.id)) {
            createTile(item.id, item.title, item.description, item.link);
            existingTileIds.add(item.id); // Add ID to the set to prevent duplicates
        } else {
            console.warn(`Tile with ID ${item.id} already exists.`);
        }
    });
}

function createTile(id, title, descriptionMarkdown, columns) {
    const newTile = document.createElement('div');
    newTile.classList.add('tile');
    newTile.dataset.id = id;
    newTile.dataset.title = title;
    newTile.dataset.description = descriptionMarkdown;
    newTile.addEventListener('click', function() {
        redirectToKanban(id);
    })
    setTileContent(newTile, id, title, descriptionMarkdown, columns);
    flexContainer.insertBefore(newTile, addTileBtn);
    existingTileIds.add(id); // Add ID to the set to track created tiles
}

function setTileContent(tile, id, title, descriptionMarkdown, columns) {
    const descriptionHtml = markdownToHtml(descriptionMarkdown);
    tile.innerHTML = `
        <a href="#" class="tile-link")>
            <div class="tile-content">
                <strong>${title}</strong>
                <div class="description">${descriptionHtml}</div>
            </div>
        </a>
        <a href="#" class="tile-link">
            <div class="description">${descriptionHtml}</div>
        </a>
        ${createKebabMenu()}
    `;
    attachKebabListeners(tile);
}

function updateTile(tile, title, descriptionMarkdown) {
    tile.dataset.title = title;
    tile.dataset.description = descriptionMarkdown;
    setTileContent(tile, title, descriptionMarkdown);
}

function markdownToHtml(markdown) {
    // Convert markdown to HTML using SimpleMDE
    let rawHtml = SimpleMDE.prototype.markdown(markdown);

    // Create a temporary container to apply additional styling
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    // Apply necessary styling to ensure text wraps and no overflow occurs
    let elements = tempDiv.querySelectorAll('*');
    elements.forEach(el => {
        el.style.whiteSpace = 'normal';
        el.style.wordWrap = 'break-word';
        el.style.overflowWrap = 'break-word'; // Additional property for older browsers
    });

    return tempDiv.innerHTML;
}

function getTileById(id) {
    return document.querySelector(`.tile[data-id="${id}"]`);
}

// Function to send an HTTP request to the specified endpoint with the data and HTTP method
async function sendHttpRequest(endpoint, data, method) {
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    location.reload();
}

// Expose the necessary functions to the global scope
window.TileManager = {
    createTileFromJSON,
    createTile,
    setTileContent,
    updateTile,
    markdownToHtml,
    getTileById
};
