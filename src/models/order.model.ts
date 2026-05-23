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

export const Order = mongoose.model<IOrder>('Order', orderSchema);
