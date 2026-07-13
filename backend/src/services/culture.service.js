import { cultureFallbacks } from '../data/cultureFallbacks.js';
const quickTopics = [['housing', 'housing'], ['health', 'healthcare'], ['transport', 'transport'], ['daily', 'food'], ['food', 'food'], ['work culture', 'workplace'], ['workplace', 'workplace'], ['work', 'workplace']];
function fallback(country, message) { const entry = cultureFallbacks[country] || cultureFallbacks.Canada; const topic = quickTopics.find(([needle]) => message.toLowerCase().includes(needle))?.[1] || 'food'; return entry[topic]; }
export async function chat({ country, message, history = [] }) {
  if (!process.env.GEMINI_API_KEY) return { response: fallback(country, message), source: 'fallback' };
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: 'You provide practical, accurate relocation-specific cultural guidance only: workplace norms, housing, healthcare, transport and daily life. Be concise, avoid legal advice, and state uncertainty clearly.' });
    const contents = [...history, { role: 'user', content: message }].slice(-10).map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text: item.content }] }));
    const result = await model.generateContent({ contents });
    return { response: result.response.text(), source: 'gemini' };
  } catch { return { response: fallback(country, message), source: 'fallback' }; }
}
