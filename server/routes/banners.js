import express from 'express';
import Banner from '../models/Banner.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import logger from '../middleware/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ orderPosition: 1 })
      .populate('productId', 'name price images')
      .lean();

    logger.info('Active banners fetched successfully');
    res.json({ banners });
  } catch (error) {
    logger.error('Error fetching active banners:', error);
    res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
  }
});

router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ orderPosition: 1, createdAt: -1 })
      .populate('productId', 'name price images')
      .lean();

    logger.info('All banners fetched by admin');
    res.json({ banners });
  } catch (error) {
    logger.error('Error fetching all banners:', error);
    res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
  }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, imageUrl, productId, ctaText, isActive, orderPosition } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and image URL are required' });
    }

    const banner = new Banner({
      title,
      subtitle,
      imageUrl,
      productId: productId || null,
      ctaText,
      isActive,
      orderPosition
    });

    await banner.save();
    await banner.populate('productId', 'name price images');

    logger.info('Banner created successfully', { bannerId: banner._id });
    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    logger.error('Error creating banner:', error);
    res.status(500).json({ message: 'Failed to create banner', error: error.message });
  }
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, productId, ctaText, isActive, orderPosition } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    banner.title = title || banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.imageUrl = imageUrl || banner.imageUrl;
    banner.productId = productId || null;
    banner.ctaText = ctaText || banner.ctaText;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    banner.orderPosition = orderPosition !== undefined ? orderPosition : banner.orderPosition;

    await banner.save();
    await banner.populate('productId', 'name price images');

    logger.info('Banner updated successfully', { bannerId: banner._id });
    res.json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    logger.error('Error updating banner:', error);
    res.status(500).json({ message: 'Failed to update banner', error: error.message });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await Banner.deleteOne({ _id: id });

    logger.info('Banner deleted successfully', { bannerId: id });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    logger.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
});

export default router;