import Checklist from '../models/Checklist.js';
import { buildChecklist } from '../data/checklistTemplates.js';
import { AppError } from '../utils/AppError.js';
export async function generate({ userId, destination_country, move_type }) { if (!destination_country || !['work', 'study', 'retirement', 'family'].includes(move_type)) throw new AppError('Provide a country and valid move type.', 400, 'VALIDATION_ERROR'); await Checklist.deleteMany({ userId }); return Checklist.create({ userId, country: destination_country, move_type, items: buildChecklist(destination_country, move_type) }); }
export const getActive = (userId) => Checklist.findOne({ userId }).sort({ createdAt: -1 }).lean();
export async function toggle({ userId, id, itemId, done }) { const checklist = await Checklist.findOne({ _id: id, userId }); if (!checklist) throw new AppError('Checklist not found.', 404, 'NOT_FOUND'); const item = checklist.items.find((entry) => entry.id === itemId); if (!item) throw new AppError('Checklist item not found.', 404, 'NOT_FOUND'); item.done = Boolean(done); await checklist.save(); return checklist; }
