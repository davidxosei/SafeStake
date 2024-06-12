import { saveToLocalStorage, getFromLocalStorage } from "./storage.js";
import { loadAndInitNavbar } from "./renderNavbar.js";
import { applyDarkMode } from "./renderDarkMode.js";

document.addEventListener("DOMContentLoaded", function () {
  loadAndInitNavbar();
  applyDarkMode();
  const form = document.getElementById("goal-form");
  const winGoalInput = document.getElementById("win-goal");
  const lossLimitInput = document.getElementById("loss-limit");
  const quizGoalInput = document.getElementById("quiz-goal");
  const winningPercentageGoalInput = document.getElementById(
    "winning-percentage-goal"
  );
  const losingPercentageGoalInput = document.getElementById(
    "losing-percentage-goal"
  );
  console.log(losingPercentageGoalInput);
  const goalsDisplay = document.getElementById("goals-display");

  function loadCurrentStats() {
    const totalAmountWon =
      JSON.parse(getFromLocalStorage("totalAmountWon")).toFixed(2) || [];
    const totalAmountLost =
      JSON.parse(getFromLocalStorage("totalAmountLost")).toFixed(2) || [];
    const winRate = JSON.parse(getFromLocalStorage("winRate")).toFixed(0) || [];
    const lossRate = ((1 - winRate / 100) * 100).toFixed();

    const numQuiz = JSON.parse(getFromLocalStorage("numQuiz")) || 0;
    const numRightQuiz = JSON.parse(getFromLocalStorage("numRightQuiz")) || 0;
    console.log(numRightQuiz, numQuiz);
    const quizAccuracy = ((numRightQuiz / numQuiz) * 100).toFixed(0);
    console.log("QA", quizAccuracy);
    return {
      totalAmountWon,
      totalAmountLost,
      winRate,
      lossRate,
      quizAccuracy,
    };
  }

  function loadGoals() {
    const goals = JSON.parse(getFromLocalStorage("bettingGoals")) || {};
    if (goals.winGoal) {
      winGoalInput.value = goals.winGoal;
    }
    if (goals.lossLimit) {
      lossLimitInput.value = goals.lossLimit;
    }
    if (goals.quizGoal) {
      quizGoalInput.value = goals.quizGoal;
    }
    if (goals.winningPercentageGoal) {
      winningPercentageGoalInput.value = goals.winningPercentageGoal;
    }
    if (goals.losingPercentageGoal) {
      losingPercentageGoalInput.value = goals.losingPercentageGoal;
    }
  }

  function saveGoals(e) {
    e.preventDefault();
    const winGoal = winGoalInput.value;
    const lossLimit = lossLimitInput.value;
    const quizGoal = quizGoalInput.value;
    const winningPercentageGoal = winningPercentageGoalInput.value;
    const losingPercentageGoal = losingPercentageGoalInput.value;

    const goals = {
      winGoal,
      lossLimit,
      quizGoal,
      winningPercentageGoal,
      losingPercentageGoal,
    };

    saveToLocalStorage("bettingGoals", JSON.stringify(goals));
    displayGoals(goals, loadCurrentStats());
    alert("Your betting goals have been saved successfully.");
  }
  

  function displayGoals(goals, stats) {
    const totalAmountWon = parseFloat(stats.totalAmountWon) || 0;
    const totalAmountLost = parseFloat(stats.totalAmountLost) || 0;
    const winRate = parseFloat(stats.winRate) || 0;
    let lossRate = parseFloat(stats.lossRate) || 0;
    
    
    
    const quizAccuracy = parseFloat(stats.quizAccuracy) || 0;

    let winProgress = goals.winGoal > 0 ? ((totalAmountWon / goals.winGoal) * 100).toFixed(0) : 0;
    let lossProgress = goals.lossLimit > 0 ? (((goals.lossLimit - totalAmountLost) / goals.lossLimit) * 100).toFixed(0) : 0;
    let quizProgress = goals.quizGoal > 0 ? ((quizAccuracy / goals.quizGoal) * 100).toFixed(0) : 0;
    let winRateProgress = goals.winningPercentageGoal > 0 ? ((winRate / goals.winningPercentageGoal) * 100).toFixed(0) : 0;
    let lossRateProgress = goals.losingPercentageGoal > 0 ? ((goals.losingPercentageGoal - lossRate) / goals.losingPercentageGoal * 100).toFixed(0) : 0;

    winProgress = Math.min(Math.max(winProgress, 0), 100);
    lossProgress = Math.min(Math.max(lossProgress, 0), 100);
    quizProgress = Math.min(Math.max(quizProgress, 0), 100);
    winRateProgress = Math.min(Math.max(winRateProgress, 0), 100);
    lossRateProgress = Math.max(0, lossRateProgress);
    
    let num = getFromLocalStorage("num");
    console.log(num);
    if (totalAmountLost===0){
      lossProgress = 0;
    }
    if (num === 0){
      lossRate = 0;
      saveToLocalStorage("num", 1);
      console.log("now", num);
    }
    else{
      lossRate = parseFloat(stats.lossRate) || 0;
      console.log("HERE", lossRate)
    }
    

    goalsDisplay.innerHTML = `
      <div id="goals-display">
        <h2>Your Current Goals vs Your Stats</h2>
        <div class="goal-item">
          <p>Goal to Win Amount: $${goals.winGoal} (Current: $${totalAmountWon})</p>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${winProgress}%">${winProgress}%</div>
          </div>
        </div>
        <div class="goal-item">
          <p>Goal Not to Lose More Than: $${goals.lossLimit} (Current Losses: $${totalAmountLost})</p>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${lossProgress}%">${lossProgress}%</div>
          </div>
        </div>
        <div class="goal-item">
          <p>Goal for Quiz Accuracy: ${goals.quizGoal}% (Current Accuracy: ${quizAccuracy}%)</p>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${quizAccuracy}%">${quizAccuracy}%</div>
          </div>
        </div>
        <div class="goal-item">
          <p>Goal for Winning Percentage: ${goals.winningPercentageGoal}% (Current Winning Percentage: ${winRate}%)</p>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${winRate}%">${winRate}%</div>
          </div>
        </div>
        <div class="goal-item">
          <p>Goal for Losing Percentage: ${goals.losingPercentageGoal}% (Current Losing Percentage: ${lossRate}%)</p>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${lossRate}%">${lossRate}%</div>
          </div>
        </div>
      </div>
    `;
  }

  form.addEventListener("submit", saveGoals);
  loadGoals();
  const stats = loadCurrentStats();
  displayGoals(JSON.parse(getFromLocalStorage("bettingGoals")) || {}, stats);
});
