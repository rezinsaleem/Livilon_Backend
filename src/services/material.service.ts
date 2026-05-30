import { Material } from '../models/material.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';
import {
  MATERIAL_CATEGORIES,
  MaterialCategory,
} from '../constants/materialCategories';

type MaterialInput = {
  materialId: string;
  name: string;
  price: number;
  materialCategory?: MaterialCategory | null;
};

export const createMaterial = async (data: MaterialInput) => {
  const material = await Material.create(data);
  return material;
};

export const getMaterials = async (
  searchKey?: string,
  materialCategory?: string
) => {
  const filter: Record<string, unknown> = {};

  if (searchKey) {
    filter.$or = [
      { name: { $regex: searchKey, $options: 'i' } },
      { materialId: { $regex: searchKey, $options: 'i' } },
    ];
  }

  if (materialCategory) {
    filter.materialCategory = materialCategory;
  }

  const materials = await Material.find(filter).sort({ createdAt: -1 });
  return materials;
};

export const updateMaterial = async (
  id: string,
  data: Partial<MaterialInput>
) => {
  const material = await Material.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!material) {
    throw new AppError(MESSAGES.MATERIAL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return material;
};

export const getMaterialCategories = () => {
  return [...MATERIAL_CATEGORIES];
};

export const deleteMaterial = async (id: string) => {
  const material = await Material.findByIdAndDelete(id);

  if (!material) {
    throw new AppError(MESSAGES.MATERIAL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return material;
};
