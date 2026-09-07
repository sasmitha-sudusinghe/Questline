// Simple leveling formula: every 100 XP = 1 level.
// Tune this however you like as the game design evolves.
const XP_PER_LEVEL = 100;

function calculateLevel(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

function xpIntoCurrentLevel(totalXp) {
  return totalXp % XP_PER_LEVEL;
}

function xpNeededForNextLevel() {
  return XP_PER_LEVEL;
}

module.exports = {
  XP_PER_LEVEL,
  calculateLevel,
  xpIntoCurrentLevel,
  xpNeededForNextLevel,
};
