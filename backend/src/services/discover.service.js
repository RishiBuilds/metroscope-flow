import City from '../models/City.js';

const BUDGET_RANGES = {
  low:    [0,    1000],
  medium: [1000, 2000],
  high:   [2000, Infinity],
};

const CLIMATE_MAP = {
  warm:     ['Australia', 'Singapore', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'India', 'Brazil', 'Mexico', 'Spain', 'Portugal', 'Greece', 'Italy', 'UAE', 'South Africa'],
  moderate: ['United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium', 'Sweden', 'United States', 'Canada', 'Japan', 'South Korea', 'China', 'New Zealand', 'Switzerland', 'Austria'],
  cold:     ['Norway', 'Finland', 'Denmark', 'Iceland', 'Russia', 'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary'],
};

export async function findMatchingCities({ budget, climate, pace, priority, work }) {
  const allCities = await City.find().lean();

  const [minRent, maxRent] = BUDGET_RANGES[budget] ?? [0, Infinity];
  let candidates = allCities.filter(
    (c) => c.avg_monthly_rent_usd >= minRent && c.avg_monthly_rent_usd <= maxRent,
  );

  const climateCountries = CLIMATE_MAP[climate] ?? [];
  const inClimate = candidates.filter((c) => climateCountries.includes(c.country));
  if (inClimate.length >= 6) candidates = inClimate;

  const scored = candidates.map((city) => {
    let score = 0;

    if (priority === 'affordability') {
      const rentScore = Math.max(0, 100 - (city.avg_monthly_rent_usd / 50));
      score += rentScore * 2;
    } else if (priority === 'safety') {
      score += (city.safety_score ?? 0) * 2;
    } else if (priority === 'quality') {
      score += (city.quality_of_life_score ?? 0) * 2;
    } else if (priority === 'healthcare') {
      score += (city.healthcare_score ?? 0) * 2;
    } else if (priority === 'nature') {
      score += Math.max(0, 100 - (city.pollution_score ?? 50)) * 2;
    }

    if (pace === 'fast') {
      score += (city.avg_salary_usd / 100) + (100 - city.cost_of_living_index);
    } else if (pace === 'relaxed') {
      score += Math.max(0, 100 - city.cost_of_living_index);
    } else {
      score += city.quality_of_life_score ?? 50;
    }

    if (work === 'remote') {
      const internetScore = Math.max(0, 100 - (city.internet_cost_usd ?? 60));
      score += internetScore + (city.quality_of_life_score ?? 50);
    }

    score += (city.quality_of_life_score ?? 0) * 0.5;
    score += (city.safety_score ?? 0) * 0.3;

    return { city, score: Math.round(score) };
  });

  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  return top3.map(({ city, score }) => ({
    _id: city._id,
    city: city.city,
    country: city.country,
    score,
    highlights: buildHighlights(city, priority, work),
    metrics: {
      avg_monthly_rent_usd: city.avg_monthly_rent_usd,
      avg_salary_usd: city.avg_salary_usd,
      safety_score: city.safety_score,
      quality_of_life_score: city.quality_of_life_score,
      healthcare_score: city.healthcare_score,
      internet_cost_usd: city.internet_cost_usd,
      pollution_score: city.pollution_score,
    },
  }));
}

function buildHighlights(city, priority, work) {
  const lines = [];
  if (priority === 'affordability') {
    lines.push(`Avg rent $${city.avg_monthly_rent_usd?.toLocaleString()}/mo with avg salary $${city.avg_salary_usd?.toLocaleString()}/yr`);
  } else if (priority === 'safety') {
    lines.push(`Safety score ${city.safety_score}/100`);
  } else if (priority === 'quality') {
    lines.push(`Quality of life ${city.quality_of_life_score}/100`);
  } else if (priority === 'healthcare') {
    lines.push(`Healthcare score ${city.healthcare_score}/100`);
  } else if (priority === 'nature') {
    lines.push(`Pollution score ${city.pollution_score}/100 (lower is better)`);
  }
  if (work === 'remote') {
    lines.push(`Internet cost $${city.internet_cost_usd}/mo`);
  }
  lines.push(`Quality of life ${city.quality_of_life_score}/100 · Safety ${city.safety_score}/100`);
  return lines.slice(0, 2);
}
