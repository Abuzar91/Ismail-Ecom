import express from 'express';
import Announcement from '../models/Announcement.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import logger from '../middleware/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    logger.info('Active announcements fetched successfully');
    res.json({ announcements });
  } catch (error) {
    logger.error('Error fetching active announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
});

router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    logger.info('All announcements fetched by admin');
    res.json({ announcements });
  } catch (error) {
    logger.error('Error fetching all announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, message, isActive, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const announcement = new Announcement({
      title,
      message,
      isActive,
      priority
    });

    await announcement.save();

    logger.info('Announcement created successfully', { announcementId: announcement._id });
    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    logger.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, isActive, priority } = req.body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.title = title || announcement.title;
    announcement.message = message || announcement.message;
    announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;
    announcement.priority = priority !== undefined ? priority : announcement.priority;

    await announcement.save();

    logger.info('Announcement updated successfully', { announcementId: announcement._id });
    res.json({ message: 'Announcement updated successfully', announcement });
  } catch (error) {
    logger.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Failed to update announcement', error: error.message });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.deleteOne({ _id: id });

    logger.info('Announcement deleted successfully', { announcementId: id });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    logger.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Failed to delete announcement', error: error.message });
  }
});

export default router;
