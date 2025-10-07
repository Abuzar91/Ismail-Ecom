import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Collection description is required'],
    trim: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Collection image is required']
    },
    publicId: {
      type: String,
      required: true
    }
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

collectionSchema.index({ orderPosition: 1, isActive: 1 });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
