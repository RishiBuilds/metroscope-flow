export const SUPPORTED_COUNTRIES = ['Canada', 'Germany', 'Australia', 'United Kingdom', 'United States', 'Netherlands', 'Sweden', 'New Zealand', 'Singapore', 'Japan'];

const educationScores = { phd: 100, masters: 90, bachelors: 75, diploma: 50, high_school: 30 };
const tierOnePassports = new Set(['United States', 'US', 'United Kingdom', 'UK', 'European Union', 'EU', 'Australia', 'AU', 'Canada', 'CA', 'Japan', 'JP', 'Singapore', 'SG', 'New Zealand', 'NZ']);
const countryAdjustments = { Canada: 3, Germany: 2, Australia: 2, 'United Kingdom': 0, 'United States': -3, Netherlands: 1, Sweden: 1, 'New Zealand': 2, Singapore: -2, Japan: -4 };

function workScore(years) { if (years >= 10) return 100; if (years >= 6) return 85; if (years >= 3) return 70; if (years >= 1) return 40; return 0; }
function languageScore(band) { if (band >= 8) return 100; if (band >= 7) return 90; if (band >= 6.5) return 75; if (band >= 6) return 60; return 30; }
function ageScore(age) { if (age <= 25) return 85; if (age <= 34) return 100; if (age <= 44) return 70; if (age <= 54) return 40; return 20; }

export function scoreVisaProfile(input = {}) {
  const education = educationScores[input.education_level] ?? 0;
  const work = workScore(Number(input.work_experience_years) || 0);
  const language = languageScore(Number(input.language_score?.ielts_band) || 0);
  const age = ageScore(Number(input.age) || 99);
  const job = input.has_job_offer ? 100 : 0;
  const documentCount = Object.values(input.documents || {}).filter(Boolean).length;
  const documents = [0, 33, 66, 100][documentCount] ?? 0;
  const raw = (education * .25) + (work * .20) + (language * .15) + (age * .15) + (job * .15) + (documents * .10);
  const bonuses = (input.has_job_offer ? 10 : 0) + (input.field === 'stem' ? 7 : 0) + (tierOnePassports.has(input.passport_country) ? 5 : 0) + (input.passport_country === input.destination_country ? 5 : 0);
  const score = Math.min(100, Math.round(raw + bonuses));
  const factorScores = { education, work, language, age, job, documents };
  const weakest = Object.entries(factorScores).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([key]) => key);
  const tipByFactor = {
    education: 'Consider an additional recognised qualification to strengthen your eligibility.',
    work: 'Build more relevant, documented work experience before applying.',
    language: 'Book a language test and target an IELTS band of 7.0 or higher.',
    age: 'Prioritise pathways that reward your current age bracket and apply promptly.',
    job: 'Secure a qualifying job offer; it can substantially improve your application.',
    documents: 'Complete your passport, health-insurance, and proof-of-funds documentation.',
  };
  const confidence = score > 75 ? 'high' : score >= 50 ? 'medium' : 'low';
  const label = score > 75 ? 'Strong Applicant' : score >= 50 ? 'Competitive' : score >= 30 ? 'Needs Improvement' : 'Unlikely';
  return {
    score, confidence, label,
    improvement_tips: weakest.map((key) => tipByFactor[key]).slice(0, 4),
    country_rank: SUPPORTED_COUNTRIES.map((country) => ({ country, score: Math.max(0, Math.min(100, score + countryAdjustments[country])) })).sort((a, b) => b.score - a.score),
  };
}
