const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library',
      required: [true, 'Library ID is required']
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true
    },
    floor: {
      type: Number,
      default: 1
    },
    section: {
      type: String,
      default: 'Main Reading Area',
      trim: true
    },
    type: {
      type: String,
      enum: ['desk', 'cubicle', 'quiet', 'group'],
      default: 'desk'
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

seatSchema.index({ library: 1, seatNumber: 1 });

module.exports = mongoose.model('Seat', seatSchema);
