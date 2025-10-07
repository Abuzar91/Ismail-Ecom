import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

announcementSchema.index({ priority: -1, isActive: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
