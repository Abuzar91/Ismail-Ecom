import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Banner image URL is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  ctaText: {
    type: String,
    default: 'Shop Now'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  orderPosition: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

bannerSchema.index({ orderPosition: 1, isActive: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
