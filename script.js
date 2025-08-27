// Streaks data
const pastStreaks = [
  {
    start: new Date('2025-04-08T06:00:00+10:00'),
    end: new Date('2025-07-04T17:00:00+10:00')
  },
  {
    start: new Date('2025-07-21T06:00:00+10:00'),
    end: new Date('2025-08-12T17:00:00+10:00')
  }
];

// The start date of your new streak. Change this to the exact date and time your new streak began.
const currentStreakStart = new Date('2025-08-27T06:00:00+10:00');

// Combine all streaks into one array
const streaks = [
  ...pastStreaks, {
    start: currentStreakStart,
    end: null
  }
];

// --- Utility Functions ---
function calcDays(startDate, endDate) {
  const diffInMs = endDate - startDate;
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// --- DOM Elements ---
const streakListElement = document.getElementById('streak-list');
const daysCounterElement = document.getElementById('days-counter');
const detailedTimerElement = document.getElementById('detailed-timer');

// --- Rendering Functions ---

// Function to update the main counter in real-time
function updateMainCounter() {
  const now = new Date();
  const diff = now - currentStreakStart;

  // Calculate days, hours, minutes, and seconds
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Update the counter text
  daysCounterElement.textContent = `Alcohol free for ${days} days`;
  detailedTimerElement.textContent = `It has been ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds since my last drink.`;
}


// Function to render the streak history
function renderStreaks() {
  const now = new Date();

  // Map over the streaks to calculate duration
  const streakData = streaks.map(streak => {
    const end = streak.end || now;
    return {
      ...streak,
      duration: calcDays(streak.start, end)
    };
  });

  // Sort by duration (longest first)
  streakData.sort((a, b) => b.duration - a.duration);

  // Build HTML for each streak
  const html = streakData.map(streak => {
    const endLabel = streak.end ? formatDate(streak.end) : 'Present';
    const startLabel = formatDate(streak.start);
    const ongoingClass = streak.end ? '' : 'ongoing';

    // Create a new array of dot elements for each day of the streak
    const dots = Array.from({ length: streak.duration }, (_, i) => `<div class="streak-dot"></div>`).join('');

    return `
      <div class="streak-item ${ongoingClass}">
        <div class="streak-label">
          <span>${streak.duration} days</span>
          <span>${startLabel} – ${endLabel}</span>
        </div>
        <div class="streak-bar">
          ${dots}
        </div>
      </div>
    `;
  }).join('');

  if (streakListElement) {
    streakListElement.innerHTML = html;
  }
}

// Initial render and then update every second
document.addEventListener('DOMContentLoaded', () => {
  renderStreaks();
  updateMainCounter();
  setInterval(updateMainCounter, 1000);
});