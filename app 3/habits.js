import { getFromLocalStorage } from './storage.js';
import { loadAndInitNavbar } from './renderNavbar.js';
import { applyDarkMode } from './renderDarkMode.js';

document.addEventListener('DOMContentLoaded', function () {
    loadAndInitNavbar();
    displayHabits();
    applyDarkMode();
});

// function analyzeBettingPatterns() {
//     let bets = JSON.parse(localStorage.getItem('bets')) || [];
//     let totalBets = bets.length;
//     let totalWins = bets.filter(bet => bet.won).length;
//     let winRate = totalBets > 0 ? (totalWins / totalBets * 100).toFixed(2) : "No bets yet";
//     let totalLosses = totalBets - totalWins;
//     //let averageBetAmount = totalBets > 0 ? (bets.reduce((sum, bet) => sum + bet.amount, 0) / totalBets).toFixed(2) : 0;
//     let totalBetAmount = bets.reduce((sum, bet) => {
//         let amount = parseFloat(bet.amount); // Ensure the amount is treated as a floating-point number
//         return sum + (isNaN(amount) ? 0 : amount); // Only add to sum if the amount is a number
//     }, 0);

//     let averageBetAmount = totalBets > 0 ? (totalBetAmount / totalBets).toFixed(2) : 0;
  
  
//     return { totalBets, totalWins, totalLosses, winRate, averageBetAmount };
// }
function analyzeBettingPatterns() {
    let bets = JSON.parse(getFromLocalStorage('bets')) || [];
    let totalBets = bets.length;
    let totalWins = bets.filter(bet => bet.won).length;
  let winRate = totalBets > 0 ? (totalWins / totalBets * 100).toFixed(2) : "No bets yet";
    let totalLosses = totalBets - totalWins;
    let totalBetAmount = bets.reduce((sum, bet) => {
        let amount = parseFloat(bet.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    let averageBetAmount = totalBets > 0 ? (totalBetAmount / totalBets).toFixed(2) : 0;


    return { totalBets, totalWins, totalLosses, winRate, averageBetAmount };
}


function displayHabits() {
    let { totalBets, totalWins, totalLosses, winRate, averageBetAmount } = analyzeBettingPatterns();
    document.getElementById('habit-stats').innerHTML = `
        <p>Total Bets Placed: ${totalBets}</p>
        <p>Total Wins: ${totalWins}</p>
        <p>Total Losses: ${totalLosses}</p>
        <p>Win Rate: ${winRate}%</p>
        <p>Average Bet Amount: $${averageBetAmount}</p>
    `;
}