import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import connectDB from '../config/db.js';
import City from '../models/City.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seed() {
  await connectDB();

  const filePath = resolve(__dirname, 'cities_seed.csv');
  const raw = await readFile(filePath, 'utf-8');
  const [header, ...rows] = raw.trim().split(/\r?\n/);
  const fields = header.split(',').map((f) => f.trim());
  const cities = rows
    .filter((row) => row.trim().length > 0)
    .map((row) => {
      const values = row.split(',').map((v) => v.trim());

      return Object.fromEntries(
        fields.map((field, index) => [
          field,
          field === 'city' || field === 'country' ? values[index] : Number(values[index]),
        ])
      );
    });

  console.log(`Loaded ${cities.length} cities from seed file`);

  let upserted = 0;
  let updated = 0;

  for (const cityData of cities) {
    const filter = {
      city: cityData.city,
      country: cityData.country,
      year: cityData.year,
    };

    const result = await City.findOneAndUpdate(filter, cityData, {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
    });

    if (result && result.createdAt && result.updatedAt && result.createdAt.getTime() === result.updatedAt.getTime()) {
      upserted++;
    } else {
      updated++;
    }
  }

  console.log(`\nSeed complete:`);
  console.log(`  ${upserted} new cities inserted`);
  console.log(`  ${updated} existing cities updated`);

  const total = await City.countDocuments();
  console.log(`  ${total} total cities in database`);

  const sample = await City.find().limit(3).lean();
  console.log(`\nSample (3 cities):`);
  console.log(JSON.stringify(sample, null, 2));

  return total;
}

export async function seedIfNeeded() {
  const count = await City.countDocuments();
  if (count === 0) {
    console.log('Database is empty (0 cities). Running auto-seed...');
    await seed();
  } else {
    console.log(`Database initialized with ${count} cities.`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
