import VisaResult from '../models/VisaResult.js';
import VisaTimeline from '../models/VisaTimeline.js';
import { scoreVisaProfile } from './visaScoring.js';
import { AppError } from '../utils/AppError.js';

export const predict = (inputs) => scoreVisaProfile(inputs);
export const saveResult = ({ userId, inputs, result }) => VisaResult.create({ userId, inputs, result });
export const listResults = (userId) => VisaResult.find({ userId }).sort({ createdAt: -1 }).lean();

function steps(country, field, score) {
  const languageNeeded = (score?.result?.score || 0) < 75;
  return [
    ['Document Preparation', '2–4 weeks', ['Gather your passport and certified copies', `Translate qualifications for ${country} where needed`, 'Prepare proof of funds and health insurance']],
    ['Language Test Booking', '3–8 weeks', [languageNeeded ? 'Book an IELTS or accepted language test' : 'Keep your language certificate current', 'Schedule test preparation sessions', 'Request official test score delivery']],
    ['Visa Application Submission', '4–16 weeks', [`Complete the ${country} application form`, 'Upload supporting evidence', 'Attend biometrics or interview if requested']],
    ['Pre-Arrival Setup', '2–6 weeks', ['Secure temporary accommodation', 'Arrange an arrival bank account plan', 'Confirm health cover from your arrival date']],
    ['Arrival & Orientation', 'First 30 days', ['Register your address where required', 'Set up a local phone number', `Connect with ${field || 'professional'} communities`]],
    ['Long-term Settlement', '6 months+', ['Track residence-permit renewal dates', 'Understand local tax filing', `Research ${country} permanent-residence pathways`]],
  ].map(([name, duration, substeps], index) => ({ id: `phase-${index + 1}`, name, duration, substeps: substeps.map((text, step) => ({ id: `phase-${index + 1}-step-${step + 1}`, text, done: false })), status: 'Not Started' }));
}

export async function getTimeline(userId) {
  const saved = await VisaTimeline.findOne({ userId }).lean();
  if (saved) return saved;
  const latest = await VisaResult.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!latest) return null;
  return VisaTimeline.create({ userId, phases: steps(latest.inputs.destination_country, latest.inputs.field, latest) });
}
export async function updateTimeline({ userId, phases }) {
  if (!Array.isArray(phases)) throw new AppError('phases must be an array.', 400, 'VALIDATION_ERROR');
  const updated = await VisaTimeline.findOneAndUpdate({ userId }, { phases }, { new: true, runValidators: true });
  if (!updated) throw new AppError('Create and save a visa prediction before updating your timeline.', 404, 'NOT_FOUND');
  return updated;
}
