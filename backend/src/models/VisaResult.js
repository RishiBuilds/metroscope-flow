import mongoose from 'mongoose';
const visaResultSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, inputs: { type: mongoose.Schema.Types.Mixed, required: true }, result: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true });
visaResultSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('VisaResult', visaResultSchema);
