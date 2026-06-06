import mongoose, { Schema } from 'mongoose';
import { IMaterial } from '../types';

const materialTypeSchema = new Schema(
  {
    materialType: {
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
  { _id: false }
);

const materialSchema = new Schema<IMaterial>(
  {
    materialCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    materialName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hasMultipleTypes: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Single-price materials (hasMultipleTypes = false).
    // Conditional presence is enforced by the Zod validation layer; kept
    // optional here so update operations that switch type-mode stay clean.
    price: {
      type: Number,
      min: 0,
      default: undefined,
    },
    // Multi-type materials (hasMultipleTypes = true).
    materialTypes: {
      type: [materialTypeSchema],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = mongoose.model<IMaterial>('Material', materialSchema);
