export function loadAndInitNavbar() {
  const navbarHTML = `
        <link rel="stylesheet" href="nav.css" />
        <nav class="navbar">
            <div class="logo-container">
                <a href="index.html">
                    <img
                      src="https://cdn.glitch.global/9e81ac6d-2612-43d2-bc28-604c5d77f3b9/Screenshot%202024-04-17%20142321.png?v=1713378338128"
                      alt="Logo"
                      class="header-logo light-logo"
                    />
                    <img
                      src="https://cdn.glitch.global/9e81ac6d-2612-43d2-bc28-604c5d77f3b9/Screen%20Shot%202024-04-28%20at%203.11.11%20PM.png?v=1714331474621"
                      alt="Logo"
                      class="header-logo dark-logo"

                    />
                </a>
            </div>
            <div class="hamburger">
                &#9776; 
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="tutorial.html">Tutorial</a></li>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="settings.html">Settings</a></li>
            </ul>
        </nav>
    `;

  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
  initNavbar(); 
}

function initNavbar() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  } else {
    console.error("Hamburger element not found.");
  }
}
