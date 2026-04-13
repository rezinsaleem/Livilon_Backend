import { Category } from '../models/category.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const createCategory = async (data: { name: string; image: string }) => {
  const category = await Category.create(data);
  return category;
};

export const getCategories = async (searchKey?: string) => {
  const filter: Record<string, unknown> = {};

  if (searchKey) {
    filter.name = { $regex: searchKey, $options: 'i' };
  }

  const categories = await Category.find(filter).sort({ createdAt: -1 });
  return categories;
};

export const updateCategory = async (
  id: string,
  data: Partial<{ name: string; image: string }>
) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return category;
};
