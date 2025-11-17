// ------------------------------
// CONSTANTS
// ------------------------------
const TOTAL_START = 2389;
const TODAY_START = 678;

const TOTAL_INCREMENT = 100;
const TODAY_INCREMENT = 50;

const TWO_HOURS = 2 * 60 * 60 * 1000;
const DAY_24H = 24 * 60 * 60 * 1000;

// ------------------------------
// LOAD SAVED DATA OR SET DEFAULT
// ------------------------------
let data = JSON.parse(localStorage.getItem("bingwaStats")) || {
    totalPurchase: TOTAL_START,
    todayPurchase: TODAY_START,
    todaySuccess: TODAY_START,
    lastUpdate: Date.now(),
    dayStart: Date.now()
};

// ------------------------------
// RESET TODAY VALUES EVERY 24 HOURS
// ------------------------------
function resetDailyValues() {
    data.todayPurchase = TODAY_START;
    data.todaySuccess = TODAY_START;
    data.dayStart = Date.now();
}

// ------------------------------
// APPLY INCREMENTS EVERY 2 HOURS
// ------------------------------
function applyIncrements() {
    const now = Date.now();

    // 24hr reset
    if (now - data.dayStart >= DAY_24H) {
        resetDailyValues();
    }

    // 2hr increments
    if (now - data.lastUpdate >= TWO_HOURS) {
        const cycles = Math.floor((now - data.lastUpdate) / TWO_HOURS);

        data.totalPurchase += cycles * TOTAL_INCREMENT;
        data.todayPurchase += cycles * TODAY_INCREMENT;
        data.todaySuccess += cycles * TODAY_INCREMENT;

        data.lastUpdate = now;
    }

    localStorage.setItem("bingwaStats", JSON.stringify(data));
}

// ------------------------------
// UPDATE UI VALUES
// ------------------------------
function updateDisplay() {
    document.querySelector("#totalPurchase").innerText =
        data.totalPurchase.toLocaleString();

    document.querySelector("#todayPurchase").innerText =
        data.todayPurchase.toLocaleString();

    document.querySelector("#todaySuccess").innerText =
        data.todaySuccess.toLocaleString();

    document.querySelector("#issues").innerText = "0";
}

// ------------------------------
// MAIN EXECUTION
// ------------------------------
function updateStats() {
    applyIncrements();
    updateDisplay();
}

// Run immediately
updateStats();

// Update every minute
setInterval(updateStats, 60 * 1000);
