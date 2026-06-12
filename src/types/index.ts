import { Document, Types } from 'mongoose';

// ─── User ────────────────────────────────────────────────
export interface IUser extends Document {
  userId: string;
  email: string;
  mobile: string;
  password: string;
  otp?: string;
  otpExpiry?: Date;
  isOtpVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Category ────────────────────────────────────────────
export interface ICategory extends Document {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Material ────────────────────────────────────────────
export interface IMaterialType {
  materialType: string;
  price: number;
}

export interface IMaterial extends Document {
  // Admin-entered business code (e.g. "MAT001"), unique. Distinct from the
  // Mongo _id. Product.materialList[].materialId references the Material _id.
  materialCode: string;
  materialName: string;
  hasMultipleTypes: boolean;
  // Present only when hasMultipleTypes is false
  price?: number;
  // Present only when hasMultipleTypes is true
  materialTypes?: IMaterialType[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Product ─────────────────────────────────────────────
export interface IMaterialListItem {
  // Mongo ObjectId referencing Material._id (NOT the Material.materialCode)
  materialId: Types.ObjectId;
  materialName: string;
  // Selected type name when the source material has multiple types
  materialType?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface IProductCategory {
  _id: Types.ObjectId;
  name: string;
}

export interface IProduct extends Document {
  modelNo: string;
  name: string;
  images: string[];
  mrp: number;
  materialList: IMaterialListItem[];
  totalBuildCost?: number;
  seats?: number;
  category: IProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Order ───────────────────────────────────────────────
export interface IOrder extends Document {
  referenceImages: string[];
  // Stored FK to Product._id. In API responses the populated product is
  // exposed under the `productDetails` virtual and this raw key is stripped.
  productId: Types.ObjectId;
  clientName?: string;
  soldPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Pagination ──────────────────────────────────────────
export interface IPaginationQuery {
  searchKey?: string;
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── API Response ────────────────────────────────────────
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
