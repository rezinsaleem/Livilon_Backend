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
export interface IMaterial extends Document {
  materialId: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Product ─────────────────────────────────────────────
export interface IMaterialListItem {
  materialId: Types.ObjectId;
  name: string;
  price: number;
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
  category: IProductCategory;
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
