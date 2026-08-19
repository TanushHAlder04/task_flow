import express from 'express';
import List from '../models/List.js';
import Task from '../models/Task.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection
router.use(protect);

// Default lists that exist for every user initially
const DEFAULT_LISTS = [
  { id: 'personal', name: 'Personal', color: 'bg-pink-500' },
  { id: 'work', name: 'Work', color: 'bg-teal-500' }
];

// @route   GET /api/lists
// @desc    Get all lists for logged in user (defaults + custom)
router.get('/', async (req, res) => {
  try {
    const customLists = await List.find({ userId: req.user._id });
    
    // Combine defaults + user custom lists
    const userCustomFormatted = customLists.map(l => ({
      id: l.listId,
      name: l.name,
      color: l.color,
      isCustom: true
    }));

    res.json([
      ...DEFAULT_LISTS.map(l => ({ ...l, isCustom: false })),
      ...userCustomFormatted
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/lists
// @desc    Create a new custom list
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'List name is required' });
    }

    const trimmedName = name.trim();
    const listId = trimmedName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const newList = await List.create({
      userId: req.user._id,
      listId,
      name: trimmedName,
      color: color || 'bg-blue-500'
    });

    res.status(201).json({
      id: newList.listId,
      name: newList.name,
      color: newList.color,
      isCustom: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/lists/:listId
// @desc    Delete a custom list & reassign its tasks to 'personal'
router.delete('/:listId', async (req, res) => {
  try {
    const { listId } = req.params;

    // Protection: Cannot delete default lists
    if (listId === 'personal' || listId === 'work') {
      return res.status(400).json({ message: 'Default system lists cannot be deleted' });
    }

    const deletedList = await List.findOneAndDelete({
      listId,
      userId: req.user._id
    });

    if (!deletedList) {
      return res.status(404).json({ message: 'List not found or unauthorized' });
    }

    // Reassign all tasks in this list to fallback 'personal' list
    await Task.updateMany(
      { userId: req.user._id, list: listId },
      { $set: { list: 'personal' } }
    );

    res.json({
      message: 'List deleted successfully. Tasks reassigned to Personal list.',
      listId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
