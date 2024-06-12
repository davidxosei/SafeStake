import { loadAndInitNavbar } from './renderNavbar.js';
import { applyDarkMode } from './renderDarkMode.js';

document.addEventListener('DOMContentLoaded', function() {
    applyDarkMode();
    initTutorial(); 
});

let currentStep = 0;
let tutorialContent = []; 

function displayTutorialStep(step) {
    const title = document.createElement('h2');
    title.textContent = tutorialContent[step].title;

    const description = document.createElement('p');
    description.textContent = tutorialContent[step].description;

    const tutorialStepDiv = document.getElementById('tutorial-step');
    tutorialStepDiv.innerHTML = '';
    tutorialStepDiv.appendChild(title);
    tutorialStepDiv.appendChild(description);

    updateNavigationButtons(step);
}

function updateNavigationButtons(step) {
    const nextButton = document.getElementById('next-step');
    const prevButton = document.getElementById('prev-step');

    nextButton.textContent = step === tutorialContent.length - 1 ? "Go to Dashboard" : "Next";
    prevButton.disabled = step === 0;

    prevButton.onclick = () => {
        if (step > 0) {
            changeStep(-1);
        }
    };
    nextButton.onclick = () => {
        if (step === tutorialContent.length - 1) {
            window.location.href = "dashboard.html";
        } else {
            changeStep(1);
        }
    };
}

function changeStep(change) {
    currentStep += change;
    displayTutorialStep(currentStep);
}

function initTutorial() {
    loadAndInitNavbar();
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            tutorialContent = data.Tutorial;
            displayTutorialStep(0);
        })
        .catch(error => console.error('Failed to load tutorial data:', error));
}

