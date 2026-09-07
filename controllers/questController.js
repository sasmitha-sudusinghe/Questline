const Quest = require('../models/Quest');
const User = require('../models/User');
const { calculateLevel } = require('../utils/xp');

// GET /api/quests
async function getQuests(req, res) {
  try {
    const quests = await Quest.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ quests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quests', error: err.message });
  }
}

// GET /api/quests/:id
async function getQuest(req, res) {
  try {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json({ quest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quest', error: err.message });
  }
}

// POST /api/quests
async function createQuest(req, res) {
  try {
    const { title, description, difficulty, xpValue, recurring } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const quest = await Quest.create({
      userId: req.userId,
      title,
      description,
      difficulty,
      xpValue,
      recurring,
    });

    res.status(201).json({ quest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quest', error: err.message });
  }
}

// PUT /api/quests/:id
async function updateQuest(req, res) {
  try {
    const updates = (({ title, description, difficulty, xpValue, recurring }) => ({
      title,
      description,
      difficulty,
      xpValue,
      recurring,
    }))(req.body);

    // Strip undefined keys so we don't overwrite fields the client didn't send
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    res.json({ quest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quest', error: err.message });
  }
}

// DELETE /api/quests/:id
async function deleteQuest(req, res) {
  try {
    const quest = await Quest.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json({ message: 'Quest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quest', error: err.message });
  }
}

// POST /api/quests/:id/complete
// Marks the quest complete, awards XP, recalculates level, and updates streaks.
async function completeQuest(req, res) {
  try {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    if (quest.completed && !quest.recurring) {
      return res.status(400).json({ message: 'Quest already completed' });
    }

    quest.completed = true;
    quest.completedAt = new Date();
    await quest.save();

    const user = await User.findById(req.userId);

    // Award XP and recalculate level
    user.xp += quest.xpValue;
    user.level = calculateLevel(user.xp);

    // Streak logic: if the user's last completion was yesterday, extend the
    // streak; if it was today already, leave it; otherwise reset to 1.
    const now = new Date();
    const last = user.lastCompletedAt;
    if (last) {
      const daysSinceLast = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      if (daysSinceLast === 1) {
        user.currentStreak += 1;
      } else if (daysSinceLast > 1) {
        user.currentStreak = 1;
      }
      // daysSinceLast === 0 means already completed something today; streak unchanged
    } else {
      user.currentStreak = 1;
    }

    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastCompletedAt = now;

    await user.save();

    res.json({ quest, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete quest', error: err.message });
  }
}

module.exports = {
  getQuests,
  getQuest,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
};
