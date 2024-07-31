
let overlayTitle;
let overlayDescription;
let overlayId;
let overlayColumns;
let overlayTasks;

const endpoint = 'http://localhost:8080/api';

fetchKanban();

// Get the data from endpoint and store it in kanban JSON array
const kanban = [];
function fetchKanban() {
  fetch(endpoint + '/kanban')
    .then(blob => blob.json())
    .then(data => {
      kanban.push(data);
      loadKanban();
    }
  );
}

// Populate the page with HTML content from the kanban JSON array
function loadKanban() {
  document.getElementById("kanbanTitle").innerHTML = "";
  document.getElementById("columnSpace").innerHTML = "";

  // Load Kanban title
  let websiteTitle = document.getElementById("websiteTitle");
  websiteTitle.innerHTML = kanban[0].title;
  let kanbanTitle = document.getElementById("kanbanTitle");
  kanbanTitle.innerHTML = kanban[0].title;
  
  // Load Columns
  let columnSpace = document.getElementById("columnSpace");
  for (c = 0; c < kanban[0].columns.length; c++) {
    let column = kanban[0].columns[c];
    overlayId = column.id;
    overlayTasks = column.tasks;
    let columnHTML = 
      `<div class="column">
        <div class="columnBox" id="col_${column.id}">
          <div class="columnTitleBox" draggable="true" ondragstart="drag(event)">
            <h2 class="columnTitle" id="colTitle_${column.id}">${column.title}</h2>
          </div>
          <div class="columnButtonBox">
            <button class="columnButton" type="button" onclick="deleteColumn('${column.id}')">Delete Column</button>
            <button class="columnButton" type="button" onclick="displayIdOverlay('Create Task', 'New Task', '', '${column.id}', createTask)">Create Task</button>
          </div>
        </div>
        <div class="taskSpace" id="${column.id}"></div>
      </div>`

    columnSpace.innerHTML += columnHTML;

    // Load Tasks of this Column
    let taskSpace = document.getElementById(column.id);
    for (t = 0; t < kanban[0].columns[c].tasks.length; t++) {
      let task = kanban[0].columns[c].tasks[t];
      let taskHTML = 
        `<div class="task">
          <div class="taskBox">
            <div class="taskTitleBox" draggable="true" ondragstart="drag(event)">
              <p class="taskTitle" id="task_${task.id}">${task.title}</p>
              <p class="taskDescription" id="task_${task.id}">${task.description}</p>
            </div>
            <div class="taskButtonBox">
              <button class="taskButton" type="button" onclick="deleteTask('${task.id}')">
                <i class="fa-regular fa-trash-can fa-lg"></i>
              </button>
            </div>
          </div>
        </div>`

      taskSpace.innerHTML += taskHTML;
    }
  }

  attachEventListeners();
}

// Function to display the overlay with a specified id
function displayIdOverlay(formType, title, description, id, callback) {
  overlayId = id;
  displayOverlay(formType, title, description, callback);
}

// Function to display the overlay and populate the form with the specified title and description
function displayOverlay(formType, title, description, callback) {
  console.log(overlayId);

  // Display the overlay
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('inputModal').style.display = 'block';

  // Populate form fields
  document.getElementById("formType").innerHTML = formType;
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;

  // Call the specified callback on form submit
  document.getElementById("inputModal").addEventListener('submit', function(event) {
    event.preventDefault();
    overlayTitle = document.getElementById("title").value;
    overlayDescription = document.getElementById("description").value;
    callback();
    closeOverlay();
  });
}

// Function to close the overlay
function closeOverlay() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('inputModal').style.display = 'none';
}

// Attach event listeners to Columns and Tasks
function attachEventListeners() {
  // Attach event listener to Kanban title
  let kanbanTitle = document.getElementById("kanbanTitle");
  kanbanTitle.addEventListener('click', (event) => {
    overlayColumns = kanban[0].columns;
    displayOverlay("Update Kanban", kanban[0].title, kanban[0].description, updateKanban);
  });

  for (c = 0; c < kanban[0].columns.length; c++) {
    // Attach event listener to each Column
    let columnElement = document.getElementById(kanban[0].columns[c].id);
    let column = kanban[0].columns[c];
    let tasks = kanban[0].columns[c].tasks;
    let colTitle = document.getElementById("colTitle_" + columnElement.id);
    colTitle.addEventListener('click', (event) => {
      overlayId = column.id;
      overlayTasks = tasks;
      displayOverlay("Update Column", column.title, column.description, updateColumn);
    });

    // Attach drag listeners to each Column
    let colHeader = document.getElementById("col_" + columnElement.id);
    colHeader.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', event.target.childNodes[1].id);
    });
    colHeader.addEventListener('dragover', function(event) {
      event.preventDefault();
    });
    colHeader.addEventListener('drop', function(event) {
      let droppedId = event.target.id;
      if (droppedId == "") {
        droppedId = event.target.childNodes[1].id;
      }
      let draggedId = event.dataTransfer.getData('text/plain');
      droppedId = droppedId.replace("colTitle_", "");
      draggedId = draggedId.replace("colTitle_", "");
      moveColumn(draggedId, droppedId);
    });

    // Attach drag listeners to the task space of each Column
    columnElement.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', event.target.childNodes[1].id);
    });
    columnElement.addEventListener('dragover', function(event) {
      event.preventDefault();
    });
    columnElement.addEventListener('drop', function(event) {
      let droppedId = event.target.id;
      if (droppedId == "") {
        droppedId = event.target.childNodes[1].id;
      }
      let draggedId = event.dataTransfer.getData('text/plain');
      droppedId = droppedId.replace("task_", "");
      draggedId = draggedId.replace("task_", "");
      console.log(droppedId);
      moveTask(draggedId, droppedId);
    });

    for (t = 0; t < tasks.length; t++) {
      // Attach event listener to each Task
      let task = kanban[0].columns[c].tasks[t];
      let taskTitle = document.getElementById("task_" + task.id);
      taskTitle.addEventListener('click', (event) => {
        overlayTitle = task.title;
        overlayId = task.id;
        displayOverlay("Update Task", task.title, task.description, updateTask);
      });
    }
  }
}

// Function to re-order the columns of the Kanban.
async function moveColumn(columnId1, columnId2) {
  let sourceColumn = getColumnById(columnId1);
  let destinationIndex = getIndexOfColumnId(columnId2);

  // Remove Column from Kanban
  await kanban[0].columns.splice(getIndexOfColumnId(columnId1), 1);

  // Add Column at index of dropped Column
  await kanban[0].columns.splice(destinationIndex, 0, sourceColumn);

  const data = {
    title: kanban[0].title,
    id: kanban[0].id,
    columns: kanban[0].columns
  }
  sendHttpRequest(endpoint + '/updateKanban', data, 'PUT');
}

// Function to move a task to another Column.
async function moveTask(taskId1, taskId2) {
  let sourceTask = getTaskById(taskId1);
  let sourceColumn = getColumnByTaskId(taskId1);
  let destinationColumn = getColumnByTaskId(taskId2);
  let destinationIndex = getIndexOfTaskId(taskId2);

  // Remove Task from source Column
  await sourceColumn.tasks.splice(getIndexOfTaskId(taskId1), 1);

  // Add Task to destination Column at index of dropped Task
  await destinationColumn.tasks.splice(destinationIndex + 1, 0, sourceTask);

  // Update source Column
  data = {
    title: sourceColumn.title,
    id: sourceColumn.id,
    tasks: sourceColumn.tasks
  }
  sendHttpRequest(endpoint + '/updateColumn', data, 'PUT');

  // Update destination Column
  data = {
    title: destinationColumn.title,
    id: destinationColumn.id,
    tasks: destinationColumn.tasks
  }
  sendHttpRequest(endpoint + '/updateColumn', data, 'PUT');
}

/* 
 * OBJECT GETTER FUNCTIONS 
 */ 

// Returns the Column object of the specified Column's id
function getColumnById(id) {
  for (c = 0; c < kanban[0].columns.length; c++) {
    let column = kanban[0].columns[c];
    if (column.id === id) {
      return column;
    }
  }
  return null;
}

// Returns the index of the specified Column's id in its Kanban
function getIndexOfColumnId(id) {
  for (c = 0; c < kanban[0].columns.length; c++) {
    let column = kanban[0].columns[c];
    if (column.id === id) {
      return c;
    }
  }
  return -1;
}

// Returns the Column object of the specified Task's id
function getColumnByTaskId(id) {
  for (c = 0; c < kanban[0].columns.length; c++) {
    let column = kanban[0].columns[c];
    for (t = 0; t < kanban[0].columns[c].tasks.length; t++) {
      if (kanban[0].columns[c].tasks[t].id === id) {
        return column;
      }
    }
  }
  return null;
}

// Returns the Task object of the specified Task's id
function getTaskById(id) {
  for (c = 0; c < kanban[0].columns.length; c++) {
    for (t = 0; t < kanban[0].columns[c].tasks.length; t++) {
      let task = kanban[0].columns[c].tasks[t];
      if (kanban[0].columns[c].tasks[t].id === id) {
        return task;
      }
    }
  }
  return null;
}

// Returns the index of the specified Task's id in its column
function getIndexOfTaskId(id) {
  for (c = 0; c < kanban[0].columns.length; c++) {
    for (t = 0; t < kanban[0].columns[c].tasks.length; t++) {
      if (kanban[0].columns[c].tasks[t].id === id) {
        return t;
      }
    }
  }
  return -1;
}

// Send the event data to the innerHTML of the target when the element is dragged
function drag(event) {
  event.dataTransfer.setData("text/html", event.target.innerHTML);
}

/* 
 * HTTP REQUEST FUNCTIONS 
 */ 

// Function to get a new title and update the existing one using the Kanban API
function updateKanban() {
  const data = {
    title: overlayTitle,
    description: overlayDescription,
    id: kanban[0].id,
    columns: overlayColumns
  }
  sendHttpRequest(endpoint + '/updateKanban', data, 'PUT');
}

// Function to create a new Column and add it to the Kanban API
function createColumn() {
  const data = {
    title: overlayTitle,
    description: overlayDescription,
    id: null,
    tasks: []
  }
  sendHttpRequest(endpoint + '/createColumn', data, 'POST');
}

// Function to update the Column with a specified ID, title, and tasks array and update the Kanban API
function updateColumn() {
  const data = {
    title: overlayTitle,
    description: overlayDescription,
    id: overlayId,
    tasks: overlayTasks
  }
  sendHttpRequest(endpoint + '/updateColumn', data, 'PUT');
}

// Function to delete the Column with the specified ID and update the Kanban API
function deleteColumn(id) {
  let string = confirm("Delete '" + getColumnById(id).title + "'?");
  if (string != null && string != "") {
    const data = {
      title: null,
      description: null,
      id: overlayId,
      tasks: []
    }
    sendHttpRequest(endpoint + '/deleteColumn', data, 'DELETE');
  };
}

// Function to create a new Task and add it to the Kanban API
async function createTask() {
  const data = {
    title: overlayTitle,
    description: overlayDescription,
    id: overlayId,
    tasks: null
  }
  sendHttpRequest(endpoint + '/createTask', data, 'POST');
}

// Function to update the Task with a specified ID and title array and update the Kanban API
function updateTask() {
  const data = {
    title: overlayTitle,
    description: overlayDescription,
    id: overlayId
  }
  sendHttpRequest(endpoint + '/updateTask', data, 'PUT');
}

// Function to delete the Task with the specified ID and update the Kanban API
function deleteTask(id) {
  let string = confirm("Delete '" + getTaskById(id).title + "'?");
  if (string != null && string != "") {
    const data = {
      title: null,
      description: null,
      id: id
    }
    sendHttpRequest(endpoint + '/deleteTask', data, 'DELETE');
  };
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

// Get HTML elements used for importing and attach required event listeners
document.getElementById('importButton').addEventListener('click', () => {
  document.getElementById('importKanban').click();
});
document.getElementById('importKanban').addEventListener('change', importKanban, false);

// Function to import a Kanban from a specified .json file. This function will overwrite the 
// current Kanban displayed 
async function importKanban(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        kanban[0] = JSON.parse(e.target.result);
        const data = {
          title: kanban[0].title,
          description: kanban[0].description,
          id: kanban[0].id,
          columns: kanban[0].columns
        }
        sendHttpRequest(endpoint + '/updateKanban', data, 'PUT');
        loadKanban();
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  } else {
    console.error('No file selected');
  }
}

// Function to export the currently displayed Kanban. It will save to a .json file with the title 
// matching the Kanban and save in the default downloads folder.
async function exportKanban() {
  const json = JSON.stringify(kanban[0], null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = kanban[0].title + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
