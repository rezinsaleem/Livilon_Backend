import mongoose, { Schema } from 'mongoose';
import { IMaterial } from '../types';
import { MATERIAL_CATEGORIES } from '../constants/materialCategories';

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
    materialCategory: {
      type: String,
      enum: [...MATERIAL_CATEGORIES, null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = mongoose.model<IMaterial>('Material', materialSchema);
