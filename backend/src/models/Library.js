const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Library name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      default: 'Bengaluru',
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
    },
    openingTime: {
      type: String,
      default: '08:00 AM'
    },
    closingTime: {
      type: String,
      default: '10:00 PM'
    },
    totalSeats: {
      type: Number,
      default: 0,
      min: 0
    },
    availableSeats: {
      type: Number,
      default: 0,
      min: 0
    },
    totalBooks: {
      type: Number,
      default: 0,
      min: 0
    },
    availableBooks: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },
    facilities: {
      type: [String],
      default: ['High-Speed Wi-Fi', 'AC', 'Silent Zone', 'Power Outlets']
    }
  },
  {
    timestamps: true
  }
);

librarySchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Library', librarySchema);
