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
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
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
