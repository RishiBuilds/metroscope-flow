import * as visa from '../services/visa.service.js';
export function predict(req, res) { res.json({ data: visa.predict(req.body) }); }
export async function saveResult(req, res) { const entry = await visa.saveResult({ userId: req.user.id, ...req.body }); res.status(201).json({ data: entry }); }
export async function listResults(req, res) { res.json({ data: await visa.listResults(req.user.id) }); }
export async function getTimeline(req, res) { res.json({ data: await visa.getTimeline(req.user.id) }); }
export async function updateTimeline(req, res) { if (req.params.userId !== req.user.id) return res.status(403).json({ error: { message: 'You can only update your own timeline.', code: 'FORBIDDEN' } }); res.json({ data: await visa.updateTimeline({ userId: req.user.id, phases: req.body.phases }) }); }
