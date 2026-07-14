import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, LabelList, PolarRadiusAxis,
} from 'recharts';

export const CITY_COLORS = [
  'oklch(0.67 0.22 260)',
  'oklch(0.75 0.20 70)',
  'oklch(0.65 0.22 150)',
  'oklch(0.65 0.20 30)',
];

const tooltipStyle = {
  backgroundColor: 'var(--chart-tooltip)',
  border: '1px solid var(--chart-border)',
  borderRadius: '8px',
  color: 'var(--color-surface-200)',
  fontSize: '13px',
};

const axisStyle = { fill: 'var(--chart-text)', fontSize: 12 };
const valueLabelStyle = { fontSize: 11, fill: 'var(--chart-text)' };

export function CostOfLivingChart({ cities }) {
  const data = cities.map((c) => ({ name: c.city, value: c.food_cost_index + c.transport_cost_index }));
  const best = Math.min(...data.map((item) => item.value));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.04 260 / 0.4)" />
        <XAxis dataKey="name" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Cost Index">
          {data.map((item, i) => <Cell key={i} fill={item.value === best ? 'oklch(0.70 0.17 145)' : CITY_COLORS[i % CITY_COLORS.length]} stroke={item.value === best ? 'oklch(0.88 0.12 145)' : 'transparent'} strokeWidth={2} />)}
          <LabelList dataKey="value" position="top" offset={8} className="chart-value-label" style={valueLabelStyle} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AffordabilityChart({ cities }) {
  const data = [
    { metric: 'Avg Rent (USD)',     key: 'avg_monthly_rent_usd' },
    { metric: 'Internet (USD/mo)',  key: 'internet_cost_usd' },
    { metric: 'Avg Salary (USD)',   key: 'avg_salary_usd' },
  ].map(({ metric, key }) => {
    const row = { metric };
    cities.forEach((c) => { row[c.city] = c[key]; });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.04 260 / 0.4)" />
        <XAxis dataKey="metric" tick={{ ...axisStyle, fontSize: 11 }} />
        <YAxis tick={axisStyle} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toLocaleString()}`} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'oklch(0.75 0.03 260)' }} />
        {cities.map((c, i) => (
          <Bar key={c._id} dataKey={c.city} fill={CITY_COLORS[i % CITY_COLORS.length]} radius={[3, 3, 0, 0]}>
            <LabelList dataKey={c.city} position="top" offset={8} className="chart-value-label" style={{ ...valueLabelStyle, fontSize: 10 }}
              formatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FoodTransportChart({ cities }) {
  const data = [
    { metric: 'Food Index',      key: 'food_cost_index' },
    { metric: 'Transport Index', key: 'transport_cost_index' },
  ].map(({ metric, key }) => {
    const row = { metric };
    cities.forEach((c) => { row[c.city] = c[key]; });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.04 260 / 0.4)" />
        <XAxis dataKey="metric" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'oklch(0.75 0.03 260)' }} />
        {cities.map((c, i) => (
          <Bar key={c._id} dataKey={c.city} fill={CITY_COLORS[i % CITY_COLORS.length]} radius={[3, 3, 0, 0]}>
            <LabelList dataKey={c.city} position="top" offset={8} className="chart-value-label" style={{ ...valueLabelStyle, fontSize: 10 }} />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function QualityRadarChart({ cities }) {
  const metrics = ['quality_of_life_score', 'healthcare_score', 'safety_score', 'cleanliness', 'affordability'];
  const labels  = ['Quality of Life', 'Healthcare', 'Safety', 'Cleanliness', 'Affordability'];

  const data = metrics.map((key, idx) => {
    const row = { metric: labels[idx] };
    cities.forEach((c) => {
      const values = {
        quality_of_life_score: Math.min(100, Number(c.quality_of_life_score) || 0),
        cleanliness: Math.max(0, 100 - (Number(c.pollution_score) || 0)),
        affordability: Math.max(0, 100 - Math.min(100, (Number(c.food_cost_index) + Number(c.transport_cost_index)) / 2)),
      };
      row[c.city] = values[key] ?? c[key];
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart data={data} margin={{ top: 16, right: 30, left: 30, bottom: 0 }}>
        <PolarGrid stroke="oklch(0.35 0.04 260 / 0.5)" />
        <PolarAngleAxis dataKey="metric" tick={{ ...axisStyle, fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'oklch(0.75 0.03 260)' }} />
        {cities.map((c, i) => (
          <Radar
            key={c._id}
            name={c.city}
            dataKey={c.city}
            stroke={CITY_COLORS[i % CITY_COLORS.length]}
            fill={CITY_COLORS[i % CITY_COLORS.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function PollutionChart({ cities }) {
  const data = cities.map((c) => ({
    name: c.city,
    pollution: c.pollution_score,
    cleanliness: 100 - c.pollution_score,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.04 260 / 0.4)" />
        <XAxis dataKey="name" tick={axisStyle} />
        <YAxis domain={[0, 100]} tick={axisStyle} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name, props) => [
            `${props.payload.pollution} (lower = cleaner)`,
            'Pollution Score',
          ]}
        />
        <Bar dataKey="pollution" name="Pollution Score" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={`oklch(${0.65 - d.pollution / 250} ${0.18 + d.pollution / 500} ${d.pollution > 50 ? 25 : 145})`}
            />
          ))}
          <LabelList
            dataKey="pollution"
            position="top"
            offset={8}
            className="chart-value-label"
            style={valueLabelStyle}
            formatter={(v) => v}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
