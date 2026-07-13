import mongoose from 'mongoose';
const checklistSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, country: String, move_type: String, items: [{ id: String, category: String, text: String, done: { type: Boolean, default: false } }] }, { timestamps: true });
checklistSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('Checklist', checklistSchema);
