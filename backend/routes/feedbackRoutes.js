// routes/feedback.js
import express from 'express';
const router = express.Router();
import Feedback from '../models/Feedback.js';

router.post('/', async (req, res) => {
  const { message ,userId} = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    await Feedback.create({ message, userId });  // Include userId here
    res.status(201).json({ message: 'Feedback received' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  
});

export default router;
