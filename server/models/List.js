import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    listId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      default: 'bg-blue-500'
    }
  },
  { timestamps: true }
);

export default mongoose.model('List', listSchema);
