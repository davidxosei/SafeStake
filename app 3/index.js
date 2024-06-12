import { loadAndInitNavbar } from './renderNavbar.js';
import { applyDarkMode } from './renderDarkMode.js';

document.addEventListener('DOMContentLoaded', function () {
    loadAndInitNavbar();
    applyDarkMode();
});