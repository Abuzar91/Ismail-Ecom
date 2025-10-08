import express from 'express';
import Banner from '../models/Banner.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';
import logger from '../middleware/logger.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

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

router.get('/admin/all', authenticate, checkPermission('banners', 'read'), async (req, res) => {
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

router.post('/', authenticate, checkPermission('banners', 'create'), upload.array('images', 5), async (req, res) => {
  try {
    const { title, subtitle, productId, ctaText, isActive, orderPosition } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    const banner = new Banner({
      title,
      subtitle,
      images,
      productId: productId || null,
      ctaText,
      isActive: isActive === 'true' || isActive === true,
      orderPosition: parseInt(orderPosition) || 0
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

router.put('/:id', authenticate, checkPermission('banners', 'update'), upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, productId, ctaText, isActive, orderPosition, removeImages } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      for (const publicId of imagesToRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
          banner.images = banner.images.filter(img => img.publicId !== publicId);
        } catch (err) {
          logger.error('Error deleting image from Cloudinary:', err);
        }
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      banner.images = [...banner.images, ...newImages];
    }

    banner.title = title || banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.productId = productId || null;
    banner.ctaText = ctaText || banner.ctaText;
    banner.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : banner.isActive;
    banner.orderPosition = orderPosition !== undefined ? parseInt(orderPosition) : banner.orderPosition;

    await banner.save();
    await banner.populate('productId', 'name price images');

    logger.info('Banner updated successfully', { bannerId: banner._id });
    res.json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    logger.error('Error updating banner:', error);
    res.status(500).json({ message: 'Failed to update banner', error: error.message });
  }
});

router.delete('/:id', authenticate, checkPermission('banners', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    for (const image of banner.images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        logger.error('Error deleting image from Cloudinary:', err);
      }
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
