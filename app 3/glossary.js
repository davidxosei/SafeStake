import { loadAndInitNavbar } from './renderNavbar.js';
import { applyDarkMode } from './renderDarkMode.js';

document.addEventListener('DOMContentLoaded', function() {
    loadAndInitNavbar();
    applyDarkMode();
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const sections = ['General', 'Baseball', 'Basketball', 'Football','Soccer', 'Hockey', 'Tennis'];
        sections.forEach(section => {
            const sectionElement = document.getElementById(`${section.toLowerCase()}-terms`);
            const dl = document.createElement('dl');

            data[section].forEach(item => {
                const dt = document.createElement('dt');
                dt.textContent = item.term;
                dl.appendChild(dt);

                const dd = document.createElement('dd');
                dd.textContent = item.definition;
                dl.appendChild(dd);

                dt.addEventListener('click', function() {
                    let next = this.nextElementSibling;
                    while (next && next.tagName === 'DD') {
                        if (next.style.display === 'none' || !next.style.display) {
                            next.style.display = 'block';
                        } else {
                            next.style.display = 'none';
                        }
                        next = next.nextElementSibling;
                    }
                });
            });

            sectionElement.appendChild(dl);
        });

        const searchInput = document.querySelector('.search');
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const allSections = document.querySelectorAll('section[id$="-terms"]');
            allSections.forEach(section => {
                const termsInSection = section.querySelectorAll('dt');
                let sectionMatch = false; 
                termsInSection.forEach(term => {
                    const text = term.textContent.toLowerCase();
                    const dd = term.nextElementSibling;
                    if (text.includes(searchTerm)) {
                        term.style.display = 'block'; 
                        dd.style.display = 'block';
                        sectionMatch = true; 
                    } else {
                        term.style.display = 'none'; 
                        dd.style.display = 'none'; 
                    }
                });
                
                if (sectionMatch) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            
            if (searchTerm === '') {
                allSections.forEach(section => {
                    section.querySelectorAll('dt').forEach(term => {
                        term.style.display = 'block';
                        term.nextElementSibling.style.display = 'none';
                    });
                });
            }
        });
    })
    .catch(error => console.error('Failed to load glossary data:', error));
});
