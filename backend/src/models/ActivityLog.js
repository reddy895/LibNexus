const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      default: 'Library Administrator'
    },
    action: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ''
    },
    libraryId: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
