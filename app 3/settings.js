import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from './storage.js';
import { loadAndInitNavbar } from './renderNavbar.js';
import { applyDarkMode } from './renderDarkMode.js';

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadAndInitNavbar();

    const settingsForm = document.getElementById('betting-settings');
    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        saveSettings();
    });
  
    const resetButton = document.getElementById('reset-settings');
    resetButton.addEventListener('click', function() {
        resetSettings();
    });
});

function saveSettings() {
    const userName = document.getElementById('user-name').value.trim();
    console.log(userName);
    const dailyLimit = document.getElementById('daily-limit').value;
    const darkMode = document.getElementById('dark-mode').checked;
    const duration = document.getElementById('duration').value;

    saveToLocalStorage('dailyBudgetTotal', dailyLimit);
    saveToLocalStorage('darkMode', darkMode);
    saveToLocalStorage('duration', duration);
    saveToLocalStorage('userName', userName);
  
    applyDarkMode();

    alert("Settings saved successfully!");
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}


function resetSettings() {
    document.getElementById('user-name').value = '';
    document.getElementById('daily-limit').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('dark-mode').checked = false;

    saveToLocalStorage('userName', 'User');
    saveToLocalStorage('dailyBudgetTotal', '100'); 
    saveToLocalStorage('duration', '30');
    saveToLocalStorage('darkMode', false);
    saveToLocalStorage('num', 0);
  
    removeFromLocalStorage('bets'); 

    saveToLocalStorage('dailyBudgetUsed', 0);
    saveToLocalStorage('betBucks', 100);
    saveToLocalStorage('quizpercent', 0);
    saveToLocalStorage('totalAmountWon', 0);
    saveToLocalStorage('winRate', 0);
    saveToLocalStorage('totalAmountLost', 0);
    saveToLocalStorage('lossRate', 0);
    saveToLocalStorage('numQuiz', 0);
    saveToLocalStorage('numRightQuiz', 0);

    applyDarkMode();
    
    alert("Settings have been reset!");
}

function loadSettings() {
    const dailyLimit = getFromLocalStorage('dailyLimit');
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const duration = getFromLocalStorage('duration');
    const userName = getFromLocalStorage('userName');
  
    if (dailyLimit) {
        document.getElementById('daily-limit').value = dailyLimit;
    }
    if (duration) {
        document.getElementById('duration').value = duration;
    }
    if (userName) {
        document.getElementById('user-name').value = userName;
    }

    document.getElementById('dark-mode').checked = darkMode;
    applyDarkMode();

}
