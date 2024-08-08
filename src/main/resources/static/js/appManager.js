// appManager.js

let uploadedKanban;
let uploadedColumns = [];

class AppManager {
    constructor() {
        this.simplemde = new SimpleMDE({ 
            element: document.getElementById("description"),
            placeholder: "Enter description...",
            spellChecker: false,
            status: false,
            autosave: true,
        });

        // Modal elements
        this.modalOverlay = document.getElementById('modalOverlay');
        this.inputModal = document.getElementById('inputModal');
        this.detailsModal = document.getElementById('detailsModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.conflictModal = document.getElementById('conflictModal');

        // Buttons and inputs
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.closeDetailsBtn = document.getElementById('closeDetailsBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        this.jsonFileInput = document.getElementById('jsonFileInput');
        this.uploadJsonBtn = document.getElementById('uploadJsonBtn');
        this.conflictContent = document.getElementById('conflictContent');
        this.closeConflictBtn = document.getElementById('closeConflictBtn');
        this.autoResolveBtn = document.getElementById('autoResolveBtn');
        this.downloadResolvedBtn = document.getElementById('downloadResolvedBtn');

        // State variables
        this.editMode = false;
        this.editTile = null;
        this.tileToDelete = null;
        this.conflictIds = [];
        this.nonConflictingItems = [];
        this.existingTileIds = new Set();

        // JSON Manager will be set later
        this.jsonManager = null;

        // Initialize event listeners
        this.initEventListeners();
    }

    setJsonManager(jsonManager) {
        this.jsonManager = jsonManager;
    }

    initEventListeners() {
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.cancelBtn.addEventListener('click', () => this.closeModal(this.inputModal));
        this.closeDetailsBtn.addEventListener('click', () => this.closeModal(this.detailsModal));
        this.confirmDeleteBtn.addEventListener('click', () => this.handleDelete());
        this.cancelDeleteBtn.addEventListener('click', () => this.closeModal(this.deleteModal));
        this.uploadJsonBtn.addEventListener('click', () => this.handleJsonUpload());
        this.autoResolveBtn.addEventListener('click', () => this.jsonManager.autoResolveConflicts());
        this.downloadResolvedBtn.addEventListener('click', () => this.jsonManager.downloadConflictingJSON());
        this.closeConflictBtn.addEventListener('click', () => {
            this.closeModal(this.conflictModal);
            this.openModal();
        });

        // Trigger submit on Enter key press in the title field
        document.getElementById('title').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.handleSubmit();
            }
        });
    }

    openModal(tile = null) {
        if (tile) {
            document.getElementById('title').value = tile.dataset.title;
            document.getElementById('description').value = tile.dataset.description;
            this.setDescription(tile.dataset.description);
            this.editMode = true;
            this.editTile = tile;
        } else {
            this.resetModal();
            this.editMode = false;
            this.editTile = null;
        }

        // Remove error class and hide error message if present
        // document.getElementById('title').classList.remove('input-error');
        // document.getElementById('titleError').style.display = 'none';

        this.modalOverlay.style.display = 'block';
        this.inputModal.style.display = 'block';
    }

    closeModal(modal) {
        this.modalOverlay.style.display = 'none';
        modal.style.display = 'none';
    }

    resetModal() {
        document.getElementById('title').value = '';
        this.simplemde.value('');
    }

    openDetailsModal(tile) {
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = window.TileManager.markdownToHtml(tile.dataset.description);
        this.modalOverlay.style.display = 'block';
        this.detailsModal.style.display = 'block';
    }

    openDeleteModal(tile) {
        this.tileToDelete = tile;
        this.modalOverlay.style.display = 'block';
        this.deleteModal.style.display = 'block';
    }

    handleSubmit() {
        const title = document.getElementById('title').value;
        const description = this.simplemde.value();

        // Validate title
        if (!title) {
            document.getElementById('title').classList.add('input-error');
            // document.getElementById('titleError').style.display = 'block';
            return;
        }

        if (this.editMode && this.editTile) {
            // Update existing tile
            let kanban = getKanbanById(this.editTile.dataset.id);
            if(uploadedColumns.length > 0) {
                updateKanban(title, description, kanban.id, uploadedColumns);
                uploadedColumns = [];
            } else {
                updateKanban(title, description, kanban.id, kanban.columns);
            }
        } else {
            // Create new tile
            createKanban(title, description, uploadedColumns);
            uploadedColumns = [];
        }
    }

    handleDelete() {
        if (this.tileToDelete) {
            deleteKanban(this.tileToDelete.dataset.id);
        }
    }

    handleJsonUpload() {
        const file = this.jsonFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const kanban = [];
                    kanban[0] = JSON.parse(e.target.result);
                    const data = {
                        title: kanban[0].title,
                        description: kanban[0].description,
                        id: kanban[0].id,
                        columns: kanban[0].columns
                    }
                    // populate fields and prepare for form submission
                    document.getElementById('title').value = kanban[0].title;
                    document.getElementById('description').value = kanban[0].description;
                    this.setDescription(kanban[0].description);
                    uploadedKanban = kanban[0];
                    uploadedColumns = kanban[0].columns;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        } else {
            console.error('No file selected');
        }
    }

    displayConflictModal(conflicts) {
        const conflictText = conflicts.map(c => 
            `<p>ID: ${c.id}</p>
             <p>New Title: ${c.title}</p>
             <p>Existing Title: ${c.conflictTitle}</p>`
        ).join('<br>');
        this.conflictContent.innerHTML = `<p>The following IDs are already in use and were not added:</p><p>${conflictText}</p>`;
        this.modalOverlay.style.display = 'block';
        this.conflictModal.style.display = 'block';
    }

    generateUniqueId() {
        let newId;
        do {
            newId = String(Date.now() + Math.random());
        } while (this.existingTileIds.has(newId));
        return newId;
    }

    setDescription(value) {
        this.simplemde.value(value);
    }
}

// Returns the Column object of the specified Column's id
function getKanbanById(id) {
    for (k = 0; k < projects[0].kanbans.length; k++) {
      let kanban = projects[0].kanbans[k];
      if (kanban.id === id) {
        return kanban;
      }
    }
    return null;
}

// Function to create a new Kanban and add it to the Kanban API
function createKanban(title, description, columns) {
    const data = {
        title: title,
        description: description,
        id: null,
        columns: columns
    }
    sendHttpRequest(endpoint + '/createKanban', data, 'POST');
}

// Function to update the Kanban with a specified title, id, description, and columns array and update the Kanban API
function updateKanban(title, description, id, columns) {
    const data = {
      title: title,
      description: description,
      id: id,
      columns: columns
    }
    sendHttpRequest(endpoint + '/updateKanban', data, 'PUT');
}

// Function to delete the Kanban with the specified ID and update the Kanban API
function deleteKanban(id) {
    const data = {
        title: null,
        description: null,
        id: id,
        columns: []
    }
    sendHttpRequest(endpoint + '/deleteKanban', data, 'DELETE');
}

// Create an instance of AppManager and assign it to a global variable
const appManagerInstance = new AppManager();

// Optionally, also assign it to window to ensure global access
window.appManagerInstance = appManagerInstance;

const jsonManagerInstance = new JSONManager(appManagerInstance);
appManagerInstance.setJsonManager(jsonManagerInstance);

// Optionally, also assign jsonManagerInstance to window
window.jsonManagerInstance = jsonManagerInstance;
