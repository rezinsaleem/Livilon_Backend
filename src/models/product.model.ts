import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const materialListItemSchema = new Schema(
  {
    materialId: {
      type: Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const productCategorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    modelNo: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    materialList: {
      type: [materialListItemSchema],
      default: [],
    },
    totalBuildCost: {
      type: Number,
      default: 0,
    },
    category: {
      type: productCategorySchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search on name and modelNo
productSchema.index({ name: 'text', modelNo: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
