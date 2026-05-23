export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized. Please login to continue',
  TOKEN_MISSING: 'Access token is missing',
  TOKEN_INVALID: 'Access token is invalid or expired',
  OTP_SENT: 'OTP sent to your email',
  OTP_VERIFIED: 'OTP verified successfully',
  OTP_INVALID: 'Invalid or expired OTP',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  OTP_NOT_VERIFIED: 'Please verify OTP before resetting password',
  USER_NOT_FOUND: 'User not found',

  // Category
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_FETCHED: 'Categories fetched successfully',

  // Material
  MATERIAL_CREATED: 'Material created successfully',
  MATERIAL_UPDATED: 'Material updated successfully',
  MATERIAL_DELETED: 'Material deleted successfully',
  MATERIAL_NOT_FOUND: 'Material not found',
  MATERIAL_FETCHED: 'Materials fetched successfully',

  // Product
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_FETCHED: 'Products fetched successfully',

  // Order
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_DELETED: 'Order deleted successfully',
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_FETCHED: 'Orders fetched successfully',

  // Dashboard
  DASHBOARD_FETCHED: 'Dashboard data fetched successfully',

  // Generic
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
} as const;
