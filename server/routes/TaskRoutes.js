const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  const tasks = await Task.find(); // Later you can filter by req.user
  res.json(tasks);
});

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// POST new task
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description });
  await task.save();
  res.json(task);
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
  res.json(updatedTask);
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
