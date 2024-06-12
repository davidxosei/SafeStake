import { saveToLocalStorage, getFromLocalStorage } from "./storage.js";

import { renderDashNav } from "./renderDashNav.js";

import { applyDarkMode } from "./renderDarkMode.js";

document.addEventListener("DOMContentLoaded", function () {
  renderDashNav();

  applyDarkMode();

  fetch("data.json")
    .then((response) => response.json())

    .then((data) => {
      const sportsBets = data.Dashboard;

      function createBetOptions(betData) {
        return betData

          .split("|")

          .map((bet) => `<option value="${bet.trim()}">${bet.trim()}</option>`)

          .join("");
      }

      function createBetRow(betType, betData, sport, index) {
        const description =
          data.betTypeDescriptions[betType] || "No description available.";

        return `

          <tr>

            <td>${betType} <span title="${description}"></span></td>

            <td>

              <select class="bet-selection-${index}" data-sport="${sport}" data-index="${index}">

                <option value="neither">Select an option</option>

                ${createBetOptions(betData)}

              </select>

            </td>

          </tr>

        `;
      }

      function createBetInputAndPayoutRow(sport, index) {
        return `

              <tr>

                  <td colspan="2">

                      <input type="number" class="bet-amount" placeholder="Enter Bet Amount ($)" min="1" data-sport="${sport}" data-index="${index}" style="width: 145px;">

                      <button class="bet-button" data-sport="${sport}" data-index="${index}">Place Bet</button>

                      <span id="payout-${sport}-${index}">Potential Payout: $0.00</span>

                  </td>

              </tr>

          `;
      }

      function createBetTable(sport) {
        const container = document.getElementById(
          `${sport.toLowerCase()}-table-container`
        );

        let tableHtml = "";

        sportsBets[sport].forEach((game, index) => {
          tableHtml += `<table class="bet-table"><thead><tr><th colspan="2">${game.teams}</th></tr></thead><tbody>`;

          for (const [betType, betData] of Object.entries(game.bets)) {
            tableHtml += createBetRow(betType, betData, sport, index);
          }


          tableHtml += createBetInputAndPayoutRow(sport, index);

          tableHtml += `</tbody></table>`;
        });

        container.innerHTML = tableHtml;
      }

      let betBucks = getFromLocalStorage("betBucks") || 100;

      updateBetBucksDisplay();

      let dailyBudgetUsed =
        parseFloat(getFromLocalStorage("dailyBudgetUsed")) || 0;

      let dailyBudgetTotal =
        parseFloat(getFromLocalStorage("dailyBudgetTotal")) || 250;

      updateBudgetDisplay();

      function updateBetBucksDisplay() {
        const betBucksDisplay = document.querySelector(".bet-bucks");

        betBucksDisplay.textContent = `Bet-Bucks: ${betBucks.toFixed(2)} `;

        saveToLocalStorage("betBucks", betBucks);
      }

      function updateBudgetDisplay() {

        document.getElementById("daily-budget-used").textContent =
          dailyBudgetUsed;

        document.getElementById("daily-budget-total").textContent =
          dailyBudgetTotal;


        const budgetUsedPercentage = (dailyBudgetUsed / dailyBudgetTotal) * 100;

        document.querySelector(
          ".budget-used"
        ).style.width = `${budgetUsedPercentage}%`;

        saveToLocalStorage("dailyBudgetUsed", dailyBudgetUsed);
      }

      function calculateParlayOdds(selections) {
        let oddsList = [];

        selections.forEach((select) => {
          const selectedValue = select.value;

          if (selectedValue !== "neither") {
            const odds = selectedValue.match(/\(([-+]\d+)\)/)[1];

            oddsList.push(odds);
          }
        });

        return oddsList;
      }

      function calculateParlayPayout(oddsList, amount) {
        let totalPayoutMultiplier = 1;

        oddsList.forEach((odds) => {
          totalPayoutMultiplier *= calculateAmericanOddsMultiplier(odds);
        });

        return totalPayoutMultiplier * amount - amount;
      }

      function calculateParlayWinProbability(oddsList) {
        let totalProbability = 1;

        oddsList.forEach((odds) => {
          const impliedProbability = odds.includes("+")
            ? 100 / (parseInt(odds) + 100)
            : Math.abs(parseInt(odds)) / (Math.abs(parseInt(odds)) + 100);

          totalProbability *= impliedProbability;
        });

        return totalProbability;
      }

      function calculateAmericanOddsMultiplier(odds) {
        if (odds.includes("+")) {
          return parseInt(odds) / 100 + 1;
        } else {
          return 100 / Math.abs(parseInt(odds)) + 1;
        }
      }

      function calculatePayout(sport, index) {
        const betAmountInput = document.querySelector(
          `.bet-amount[data-sport="${sport}"][data-index="${index}"]`
        );

        const betAmount = parseFloat(betAmountInput.value);

        let totalPayout = 1;

        let parlayOdds = [];


        const selections = document.querySelectorAll(
          `.bet-selection-${index}[data-sport="${sport}"]`
        );

        selections.forEach((select) => {
          const selectedValue = select.value;

          if (selectedValue !== "neither" && betAmount > 0) {
            const odds = selectedValue.match(/\(([-+]\d+)\)/)[1];

            parlayOdds.push(odds);
          }
        });

        if (parlayOdds.length > 0 && betAmount > 0) {
          const parlayWinProbability =
            calculateParlayWinProbability(parlayOdds);

          const payout = calculateParlayPayout(parlayOdds, betAmount);

          document.getElementById(
            `payout-${sport}-${index}`
          ).textContent = `Potential Payout: $${payout.toFixed(2)}`;
        } else {
          document.getElementById(`payout-${sport}-${index}`).textContent =
            "Potential Payout: $0.00";
        }
      }

      function calculateAmericanOddsPayout(odds, amount) {
        if (odds.includes("+")) {

          return (amount * parseInt(odds)) / 100;
        } else if (odds.includes("-")) {

          return amount / Math.abs(parseInt(odds) / 100);
        }

        return 0;
      }

      function placeBet(sport, index) {
        console.log(`placeBet called for sport: ${sport}, index: ${index}`);

        const betAmountInput = document.querySelector(
          `.bet-amount[data-sport="${sport}"][data-index="${index}"]`
        );

        const betSelectionElement = document.querySelector(
          `.bet-selection-${index}[data-sport="${sport}"]`
        );

        const betAmount = parseFloat(betAmountInput.value);

        const selectedBet = betSelectionElement.value;

        if (betAmount > betBucks) {
          alert("You don't have enough Bet-Bucks to place this bet.");

          return;
        }

        if (dailyBudgetUsed + betAmount > dailyBudgetTotal) {
          alert(
            "Placing this bet will exceed your daily budget. This bet will not be placed"
          );

          return;
        }

        if (isNaN(betAmount) || betAmount <= 0) {
          alert("Please enter a valid bet amount.");

          throw new Error("Invalid bet amount");
        }

        const selections = document.querySelectorAll(
          `.bet-selection-${index}[data-sport="${sport}"]`
        );

        let parlayOdds = calculateParlayOdds(selections);

        alert(`Placing a $${betAmount} bet`);

        if (parlayOdds.length > 0 && betAmount > 0) {
          const potentialPayout = calculateParlayPayout(parlayOdds, betAmount);

          if (potentialPayout >= betAmount * 3 || betAmount >= 50) {
            const highRiskWarning =
              potentialPayout >= betAmount * 3
                ? "Potential payout is high. "
                : "";

            const highAmountWarning =
              betAmount >= 50 ? "Large amount is being placed. " : "";

            if (
              !confirm(
                `${highRiskWarning}${highAmountWarning}Are you sure you want to proceed?`
              )
            ) {
              console.log("Bet cancelled by user.");

              return;
            }
          }

          dailyBudgetUsed += parseFloat(betAmount);

          saveToLocalStorage("dailyBudgetUsed", dailyBudgetUsed);

          updateBudgetDisplay();


          if (Math.random() < calculateParlayWinProbability(parlayOdds)) {
            alert(`Congratulations! You won $${potentialPayout.toFixed(2)}`);

            betBucks += potentialPayout;

            storeBetData(sport, selectedBet, betAmount, true, potentialPayout);
          } else {
            alert("Sorry, you lost the parlay bet.");

            betBucks -= betAmount;

            storeBetData(sport, selectedBet, betAmount, false, 0);
          }

          updateBetBucksDisplay();
        }

        analyzeBettingPatterns();
      }

      Object.keys(sportsBets).forEach((sport) => {
        createBetTable(sport);
      });

      const quizQuestions = data.quizQuestions;

      let numQuiz = parseInt(getFromLocalStorage("numQuiz"));

      let numRightQuiz = parseInt(getFromLocalStorage("numRightQuiz"));

      function askQuizQuestion(sport, betType, selectElement) {
        if (
          !quizQuestions[sport] ||
          !quizQuestions[sport][betType] ||
          quizQuestions[sport][betType].length === 0
        ) {
          alert("No quiz available for this bet type.");

          return true; 
        }

        console.log(betBucks);

        const randomQuestionIndex = Math.floor(
          Math.random() * quizQuestions[sport][betType].length
        );

        const quiz = quizQuestions[sport][betType][randomQuestionIndex];

        const userAnswer = prompt(quiz.question);

        if (
          userAnswer &&
          userAnswer.toLowerCase() === quiz.answer.toLowerCase()
        ) {
          alert("Correct! Proceeding with your bet and awarding 5 betbucks.");

          betBucks += 5;

          updateBetBucksDisplay();

          numRightQuiz += 1;

          numQuiz += 1;

          saveToLocalStorage("numQuiz", numQuiz);

          saveToLocalStorage("numRightQuiz", numRightQuiz);

          return true; 
        } else {
          alert("Incorrect or no answer provided. Please try again.");

          selectElement.value = "neither";

          numQuiz += 1;

          saveToLocalStorage("numQuiz", numQuiz);

          return false; 
        }
      }

      function showRandomPopup(sport, selectElement, index) {
        let betType = "";

        const selectedBetOption = selectElement.value;


        for (const [type, bets] of Object.entries(
          sportsBets[sport][index].bets
        )) {
          if (bets.includes(selectedBetOption)) {
            betType = type;

            break;
          }
        }

        const popupType = Math.floor(Math.random() * 2);

        if (
          popupType === 0 &&
          quizQuestions[sport] &&
          quizQuestions[sport][betType]
        ) {

          return askQuizQuestion(sport, betType, selectElement);
        } else {

          alert(
            `Bet Info: ${
              data.betTypeDescriptions[betType] || "No description available."
            }`
          );

          return true;
        }
      }

      function startCountdown(duration, display) {
        var timer = duration,
          minutes,
          seconds;
        var modal = document.getElementById("timeoutModal");
        var countdownInterval = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          display.textContent = minutes + ":" + seconds;
          if (--timer < 0) {
            clearInterval(countdownInterval);
            modal.style.display = "none";
          }
        }, 1000);
      }


      function showModal() {
        let dur = parseInt(getFromLocalStorage("duration")) || 10;

        var modal = document.getElementById("timeoutModal");

        var countdownElement = document.createElement("div");

        countdownElement.id = "countdown";

        modal.querySelector(".modal-content").appendChild(countdownElement);

        modal.style.display = "block";

        var tenMinutes = 60 * dur;

        var display = document.querySelector("#countdown");

        startCountdown(tenMinutes, display);
      }


      var timeoutButton = document.querySelector('a[href="timeout.html"]');

      timeoutButton.addEventListener("click", function (event) {
        event.preventDefault(); 

        showModal();
      });

      function storeBetData(sport, betType, amount, won, payout) {
        let bets = JSON.parse(getFromLocalStorage("bets")) || [];

        bets.push({
          date: new Date().toISOString(),

          sport,

          betType,

          amount,

          won,

          payout,
        });

        saveToLocalStorage("bets", JSON.stringify(bets));

        analyzeBettingPatterns();
      }

      function analyzeBettingPatterns() {
        let bets = JSON.parse(getFromLocalStorage("bets")) || [];

        let totalBets = bets.length;

        let totalWins = bets.filter((bet) => bet.won).length;

        let totalLosses = bets.filter((bet) => !bet.won).length;

        let totalAmountWon = bets

          .filter((bet) => bet.won)

          .reduce((sum, bet) => sum + bet.payout, 0);

        let totalAmountLost = bets

          .filter((bet) => !bet.won)

          .reduce((sum, bet) => sum + bet.amount, 0);

        let winRate = ((totalWins / totalBets) * 100).toFixed(2);

        let lossRate = ((totalLosses / totalBets) * 100).toFixed(2);

        saveToLocalStorage("winRate", winRate);

        saveToLocalStorage("lossRate", lossRate);

        saveToLocalStorage("totalAmountWon", totalAmountWon);

        saveToLocalStorage("totalAmountLost", totalAmountLost);

        return { totalBets, winRate, totalAmountWon, totalAmountLost };
      }

      document.addEventListener("input", function (event) {
        if (
          event.target.classList.contains("bet-amount") ||
          event.target.className.startsWith("bet-selection-")
        ) {
          const sport = event.target.dataset.sport;

          const index = event.target.dataset.index;

          calculatePayout(sport, index);
        }
      });

      document.addEventListener("click", function (event) {
        if (event.target.classList.contains("bet-button")) {
          const sport = event.target.getAttribute("data-sport");

          const index = event.target.getAttribute("data-index");

          placeBet(sport, index);
        }
      });

      document.addEventListener("change", function (event) {
        if (event.target.className.startsWith("bet-selection-")) {
          const sport = event.target.dataset.sport;

          const index = event.target.dataset.index;

          if (event.target.value !== "neither") {
            showRandomPopup(sport, event.target, index);
          }
        }
      });

      Object.keys(sportsBets).forEach((sport) => {
        createBetTable(sport);
      });
    })

    .catch((error) => console.error("Error loading the data:", error));
});
