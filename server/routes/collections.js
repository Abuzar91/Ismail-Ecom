import express from 'express';
import Collection from '../models/Collection.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import logger from '../middleware/logger.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .sort({ orderPosition: 1 })
      .lean();

    logger.info('Active collections fetched successfully');
    res.json({ collections });
  } catch (error) {
    logger.error('Error fetching active collections:', error);
    res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
  }
});

router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({ orderPosition: 1, createdAt: -1 })
      .lean();

    logger.info('All collections fetched by admin');
    res.json({ collections });
  } catch (error) {
    logger.error('Error fetching all collections:', error);
    res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
  }
});

router.post('/', authenticate, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, isActive, orderPosition } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const collection = new Collection({
      name,
      description,
      image: {
        url: req.file.path,
        publicId: req.file.filename
      },
      isActive: isActive === 'true' || isActive === true,
      orderPosition: parseInt(orderPosition) || 0
    });

    await collection.save();

    logger.info('Collection created successfully', { collectionId: collection._id });
    res.status(201).json({ message: 'Collection created successfully', collection });
  } catch (error) {
    logger.error('Error creating collection:', error);
    res.status(500).json({ message: 'Failed to create collection', error: error.message });
  }
});

router.put('/:id', authenticate, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, orderPosition } = req.body;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (req.file) {
      try {
        await cloudinary.uploader.destroy(collection.image.publicId);
      } catch (err) {
        logger.error('Error deleting old image from Cloudinary:', err);
      }

      collection.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    collection.name = name || collection.name;
    collection.description = description || collection.description;
    collection.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : collection.isActive;
    collection.orderPosition = orderPosition !== undefined ? parseInt(orderPosition) : collection.orderPosition;

    await collection.save();

    logger.info('Collection updated successfully', { collectionId: collection._id });
    res.json({ message: 'Collection updated successfully', collection });
  } catch (error) {
    logger.error('Error updating collection:', error);
    res.status(500).json({ message: 'Failed to update collection', error: error.message });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    try {
      await cloudinary.uploader.destroy(collection.image.publicId);
    } catch (err) {
      logger.error('Error deleting image from Cloudinary:', err);
    }

    await Collection.deleteOne({ _id: id });

    logger.info('Collection deleted successfully', { collectionId: id });
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    logger.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Failed to delete collection', error: error.message });
  }
});

export default router;
