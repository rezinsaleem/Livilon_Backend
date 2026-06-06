import { Material } from '../models/material.model';
import { AppError } from '../utils/customError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

type MaterialTypeInput = {
  materialType: string;
  price: number;
};

type MaterialInput = {
  materialCode: string;
  materialName: string;
  hasMultipleTypes: boolean;
  price?: number;
  materialTypes?: MaterialTypeInput[];
};

export const createMaterial = async (data: MaterialInput) => {
  const material = await Material.create(data);
  return material;
};

export const getMaterials = async (searchKey?: string) => {
  const filter: Record<string, unknown> = {};

  if (searchKey) {
    filter.$or = [
      { materialName: { $regex: searchKey, $options: 'i' } },
      { materialCode: { $regex: searchKey, $options: 'i' } },
    ];
  }

  const materials = await Material.find(filter).sort({ createdAt: -1 });
  return materials;
};

export const updateMaterial = async (
  id: string,
  data: Partial<MaterialInput>
) => {
  const set: Partial<MaterialInput> = { ...data };
  const unset: Record<string, ''> = {};

  // When the type-mode is switched, drop the now-irrelevant field so the
  // stored document always matches exactly one shape (price XOR materialTypes).
  if (data.hasMultipleTypes === true) {
    delete set.price;
    unset.price = '';
  } else if (data.hasMultipleTypes === false) {
    delete set.materialTypes;
    unset.materialTypes = '';
  }

  const updateQuery: Record<string, unknown> = { $set: set };
  if (Object.keys(unset).length > 0) {
    updateQuery.$unset = unset;
  }

  const material = await Material.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  });

  if (!material) {
    throw new AppError(MESSAGES.MATERIAL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return material;
};

export const deleteMaterial = async (id: string) => {
  const material = await Material.findByIdAndDelete(id);

  if (!material) {
    throw new AppError(MESSAGES.MATERIAL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return material;
};
