// JavaScript file

// ---- Streak Dates ----

// Your current streak 
const currentStreakStart = new Date('2025-07-21T06:00:00+10:00');

// Previous longest streak: 8 April 2025, 6:00am → 4 July 2025, 5:00pm
const pastStreaks = [
  {
    start: new Date('2025-04-08T06:00:00+10:00'),
    end: new Date('2025-07-04T17:00:00+10:00')
  }
];

// Build the full streak list (past + current)
const streaks = [
  ...pastStreaks,
  {
    start: currentStreakStart,
    end: null // Ongoing streak
  }
];

// ---- DOM References ----
const daysCounterElement = document.getElementById('days-counter');
const detailedTimerElement = document.getElementById('detailed-timer');
const streakListElement = document.getElementById('streak-list');

// ---- Utility Functions ----

// Calculate whole days between two dates
function calcDays(start, end) {
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
}

// ---- Timer Logic (for main counter) ----
function updateTimer() {
  const now = new Date();
  const diff = now - currentStreakStart;

  // Calculate total units
  const seconds = Math.max(0, Math.floor(diff / 1000));
  const minutes = Math.max(0, Math.floor(seconds / 60));
  const hours = Math.max(0, Math.floor(minutes / 60));
  const days = Math.max(0, Math.floor(hours / 24));

  // Remaining units for display
  const remHours = hours % 24;
  const remMinutes = minutes % 60;
  const remSeconds = seconds % 60;

  // Update DOM
  if (daysCounterElement) {
    daysCounterElement.textContent = `Alcohol free for ${days} days`;
  }
  if (detailedTimerElement) {
    detailedTimerElement.textContent = `It has been ${days} days, ${remHours} hours, ${remMinutes} minutes, ${remSeconds} seconds since my last drink.`;
  }
}

// ---- Streak History Rendering ----
function renderStreaks() {
  const now = new Date();

  // Calculate durations
  const streakData = streaks.map(streak => {
    const end = streak.end || now;
    return {
      ...streak,
      duration: calcDays(streak.start, end)
    };
  });

  // Sort by duration (longest first)
  streakData.sort((a, b) => b.duration - a.duration);

  // Find the longest streak for scaling bar widths
  const maxDays = streakData[0]?.duration || 1;

  // Build HTML for each streak
  const html = streakData.map(streak => {
    const endLabel = streak.end ? formatDate(streak.end) : 'Present';
    const startLabel = formatDate(streak.start);
    const widthPercent = (streak.duration / maxDays) * 100;
    const ongoingClass = streak.end ? '' : 'ongoing';

    return `
      <div class="streak-item ${ongoingClass}">
        <div class="streak-label">
          <span>${streak.duration} days</span>
          <span>${startLabel} – ${endLabel}</span>
        </div>
        <div class="streak-bar" style="--fill: ${widthPercent}%"></div>
      </div>
    `;
  }).join('');

  if (streakListElement) {
    streakListElement.innerHTML = html;
  }
}

// Format dates as DD/MM/YYYY (Australian style)
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// ---- Initialise ----
updateTimer();
renderStreaks();

// Update every second so both the counter and the current streak bar stay live
setInterval(() => {
  updateTimer();
  renderStreaks();
}, 1000);
