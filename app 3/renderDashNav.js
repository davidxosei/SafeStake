export function renderDashNav() {
    let userName = localStorage.getItem('userName') || 'User';
    userName = userName.slice(1, userName.length - 1);
    const headerHTML = `
        <header>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="tutorial.html">Tutorial</a></li>
                    <li><a href="dashboard.html" class="active">Dashboard</a></li>
                    <li><a href="settings.html">Settings</a></li>
                </ul>
            </nav>
            <div class="user-info">
                <span class="bet-bucks">Bet-Bucks: 100</span>
                <span class="username">${userName}</span>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
}