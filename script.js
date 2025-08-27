// Streaks data
const pastStreaks = [
  {
    start: new Date('2025-04-08T06:00:00+10:00'),
    end: new Date('2025-07-04T17:00:00+10:00')
  },
  {
    start: new Date('2025-07-21T06:00:00+10:00'),
    end: new Date('2025-08-12T06:00:00+10:00')
  }
];

const currentStreakStart = new Date();

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

// --- Rendering Functions ---
const streakListElement = document.getElementById('streak-history-list');

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

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderStreaks();
});