const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    isbn: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    publisher: {
      type: String,
      default: 'LibNexus Press'
    },
    publicationYear: {
      type: Number,
      default: 2024
    },
    description: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    },
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library',
      required: [true, 'Library ID is required']
    },
    totalCopies: {
      type: Number,
      default: 3,
      min: 1
    },
    availableCopies: {
      type: Number,
      default: 3,
      min: 0
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    arrivalDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({ library: 1, title: 1, category: 1, isNewArrival: 1 });

module.exports = mongoose.model('Book', bookSchema);
