import * as checklist from '../services/checklist.service.js';
export async function generate(req, res) { res.status(201).json({ data: await checklist.generate({ userId: req.user.id, ...req.body }) }); }
export async function getActive(req, res) { res.json({ data: await checklist.getActive(req.user.id) }); }
export async function toggle(req, res) { res.json({ data: await checklist.toggle({ userId: req.user.id, id: req.params.id, ...req.body }) }); }
