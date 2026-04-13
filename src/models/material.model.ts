import mongoose, { Schema } from 'mongoose';
import { IMaterial } from '../types';

const materialSchema = new Schema<IMaterial>(
  {
    materialId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = mongoose.model<IMaterial>('Material', materialSchema);
