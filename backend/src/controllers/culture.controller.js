import * as culture from '../services/culture.service.js';
export async function chat(req, res) { res.json({ data: await culture.chat(req.body) }); }
