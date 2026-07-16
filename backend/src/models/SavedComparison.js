import mongoose from 'mongoose';

const savedComparisonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      default: '',
    },
    cityIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'City',
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2,
        message: 'A comparison requires at least 2 cities.',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    shareToken: {
      type: String,
      index: { unique: true, sparse: true },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

savedComparisonSchema.index({ userId: 1, createdAt: -1 });

const SavedComparison = mongoose.model('SavedComparison', savedComparisonSchema);

export default SavedComparison;
