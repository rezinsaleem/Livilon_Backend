import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { IOrder, IPaginatedResponse } from '../types';

export const createOrder = async (data: Partial<IOrder>) => {
  const product = await Product.findById(data.productId);
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
  }

  const order = await Order.create(data);
  await order.populate('productDetails');
  return order;
};

export const getOrders = async (
  searchKey?: string,
  page: number = 1,
  limit: number = 10
): Promise<IPaginatedResponse<IOrder>> => {
  const filter: Record<string, unknown> = {};

  if (searchKey) {
    filter.clientName = { $regex: searchKey, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate('productDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    data: data as IOrder[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getOrderById = async (id: string) => {
  const order = await Order.findById(id).populate('productDetails');

  if (!order) {
    throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

export const updateOrder = async (id: string, data: Partial<IOrder>) => {
  if (data.productId) {
    const product = await Product.findById(data.productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }
  }

  const order = await Order.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('productDetails');

  if (!order) {
    throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return order;
};

export const deleteOrder = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new AppError(MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return order;
};
