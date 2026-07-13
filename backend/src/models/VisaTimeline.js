import mongoose from 'mongoose';
const timelineSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, phases: { type: mongoose.Schema.Types.Mixed, default: [] } }, { timestamps: true });
export default mongoose.model('VisaTimeline', timelineSchema);
