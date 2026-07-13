import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    avg_monthly_rent_usd: {
      type: Number,
      required: [true, 'Average monthly rent is required'],
      min: [0, 'Rent cannot be negative'],
    },
    internet_cost_usd: {
      type: Number,
      required: [true, 'Internet cost is required'],
      min: [0, 'Internet cost cannot be negative'],
    },
    avg_salary_usd: {
      type: Number,
      required: [true, 'Average salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    food_cost_index: {
      type: Number,
      required: [true, 'Food cost index is required'],
      min: [0, 'Food cost index cannot be negative'],
      max: [300, 'Food cost index seems unrealistically high'],
    },
    transport_cost_index: {
      type: Number,
      required: [true, 'Transport cost index is required'],
      min: [0, 'Transport cost index cannot be negative'],
      max: [300, 'Transport cost index seems unrealistically high'],
    },
    quality_of_life_score: {
      type: Number,
      required: [true, 'Quality of life score is required'],
      min: [0, 'Score cannot be below 0'],
      max: [300, 'Score cannot exceed 300'],
    },
    healthcare_score: {
      type: Number,
      required: [true, 'Healthcare score is required'],
      min: [0, 'Score cannot be below 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    safety_score: {
      type: Number,
      required: [true, 'Safety score is required'],
      min: [0, 'Score cannot be below 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    pollution_score: {
      type: Number,
      required: [true, 'Pollution score is required'],
      min: [0, 'Score cannot be below 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    cost_of_living_index: {
      type: Number,
      required: [true, 'Cost of living index is required'],
      min: [0, 'Index cannot be negative'],
      max: [300, 'Index seems unrealistically high'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year seems too old'],
      max: [2100, 'Year seems too far in the future'],
    },
  },
  {
    timestamps: true,
  }
);

citySchema.index({ city: 1, country: 1, year: 1 }, { unique: true });
citySchema.index({ city: 1, country: 1 });
citySchema.index({ country: 1, city: 1 });

const City = mongoose.model('City', citySchema);

export default City;
