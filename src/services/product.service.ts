import { Product } from '../models/product.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import { IPaginatedResponse, IProduct } from '../types';

export const createProduct = async (data: Partial<IProduct>) => {
  const product = await Product.create(data);
  return product;
};

export const getProducts = async (
  searchKey?: string,
  page: number = 1,
  limit: number = 10
): Promise<IPaginatedResponse<IProduct>> => {
  const filter: Record<string, unknown> = {};

  if (searchKey) {
    filter.$or = [
      { name: { $regex: searchKey, $options: 'i' } },
      { modelNo: { $regex: searchKey, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    data: data as IProduct[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return product;
};
