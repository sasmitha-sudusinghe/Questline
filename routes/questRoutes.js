const express = require('express');
const {
  getQuests,
  getQuest,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
} = require('../controllers/questController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All quest routes require a logged-in user
router.use(protect);

router.get('/', getQuests);
router.post('/', createQuest);
router.get('/:id', getQuest);
router.put('/:id', updateQuest);
router.delete('/:id', deleteQuest);
router.post('/:id/complete', completeQuest);

module.exports = router;
