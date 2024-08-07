// Get references to HTML elements
const openModalBtn = document.getElementById('openModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const inputModal = document.getElementById('inputModal');
const outputModal = document.getElementById('outputModal');
const submitBtn = document.getElementById('submitBtn');
const closeOutputBtn = document.getElementById('closeOutputBtn');
const outputuserName = document.getElementById('outputuserName');
const outputpassword = document.getElementById('outputpassword');
const alertNotice = document.getElementById('alertNotice');

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// const loginQueryId = getQueryParam('auth');

function redirectToProjects() {
    window.location.href = 'projects.html';
}

// Event listener to open the input modal
openModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'block';
    inputModal.style.display = 'block';
});

// Event listener to submit the input and show the output modal
submitBtn.addEventListener('click', () => {
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    if ( userName != "admin" || password != "test123" ) {
        alertNotice.textContent = "Please enter a valid username/password";
    } else {
        outputuserName.textContent = userName;
        outputpassword.textContent = password;

        inputModal.style.display = 'none';
        // outputModal.style.display = 'block';

        redirectToProjects();
    }
});

// Event listener to close the output modal
closeOutputBtn.addEventListener('click', () => {
    outputModal.style.display = 'none';
    modalOverlay.style.display = 'none';
});

// Event listener to close any open modal when clicking the overlay
modalOverlay.addEventListener('click', () => {
    inputModal.style.display = 'none';
    outputModal.style.display = 'none';
    modalOverlay.style.display = 'none';
});