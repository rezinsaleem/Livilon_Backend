import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>(
  {
    referenceImages: {
      type: [String],
      default: [],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    clientName: {
      type: String,
      trim: true,
      default: undefined,
    },
    soldPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ productId: 1 });

// Expose the populated product under `productDetails` (the stored FK remains
// `productId`). Reads populate this virtual; the raw `productId` and the
// default `id` virtual are stripped from API responses for a clean contract.
orderSchema.virtual('productDetails', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const out = ret as unknown as Record<string, unknown>;
    delete out.productId;
    delete out.id;
    return out;
  },
});
orderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
