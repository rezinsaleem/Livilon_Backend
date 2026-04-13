# Livilon Backend — API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require a valid JWT token in an HTTP-only cookie (set automatically on login).

---

## Health Check

| | |
|---|---|
| **GET** | `/health` |

**Response:**
```json
{ "success": true, "message": "Server is running" }
```

---

## Auth APIs

### POST `/api/auth/login`

Login with admin credentials.

**Request Body:**
```json
{ "email": "admin@livilon.com", "password": "Admin@123" }
```

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "id": "...", "email": "admin@livilon.com", "userId": "ADMIN001" }
}
```
Sets `token` HTTP-only cookie.

**Errors:** `401` Invalid credentials

---

### POST `/api/auth/forgot-password`

Sends a 6-digit OTP to the admin's email.

**Request Body:**
```json
{ "email": "admin@livilon.com" }
```

**Success (200):**
```json
{ "success": true, "message": "OTP sent to your email" }
```

**Errors:** `404` User not found

---

### POST `/api/auth/verify-otp`

Validates the OTP received via email.

**Request Body:**
```json
{ "email": "admin@livilon.com", "otp": "123456" }
```

**Success (200):**
```json
{ "success": true, "message": "OTP verified successfully" }
```

**Errors:** `400` Invalid/expired OTP · `404` User not found

---

### POST `/api/auth/reset-password`

Resets password. OTP must be verified first.

**Request Body:**
```json
{ "email": "admin@livilon.com", "newPassword": "NewPass@456" }
```

**Success (200):**
```json
{ "success": true, "message": "Password reset successful" }
```

**Errors:** `400` OTP not verified · `404` User not found

---

## Category APIs *(🔒 Protected)*

### POST `/api/categories`

**Request Body:**
```json
{ "name": "Living Room", "image": "categories/living-room.jpg" }
```

**Success (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "_id": "...", "name": "Living Room", "image": "categories/living-room.jpg", ... }
}
```

---

### GET `/api/categories?searchKey=`

| Query Param | Type | Description |
|---|---|---|
| `searchKey` | string | Partial match on name (case-insensitive) |

**Success (200):**
```json
{ "success": true, "message": "Categories fetched successfully", "data": [...] }
```

---

### PUT `/api/categories/:id`

**Request Body** *(partial)*:
```json
{ "name": "Updated Name" }
```

**Errors:** `404` Category not found

---

### DELETE `/api/categories/:id`

**Success (200):**
```json
{ "success": true, "message": "Category deleted successfully" }
```

**Errors:** `404` Category not found

---

## Material APIs *(🔒 Protected)*

### POST `/api/materials`

**Request Body:**
```json
{ "materialId": "MAT001", "name": "Teak Wood", "price": 500 }
```

**Success (201):**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": { "_id": "...", "materialId": "MAT001", "name": "Teak Wood", "price": 500, ... }
}
```

**Errors:** `409` Duplicate materialId

---

### GET `/api/materials?searchKey=`

| Query Param | Type | Description |
|---|---|---|
| `searchKey` | string | Partial match on name or materialId |

**Success (200):**
```json
{ "success": true, "message": "Materials fetched successfully", "data": [...] }
```

---

### PUT `/api/materials/:id`

**Request Body** *(partial)*:
```json
{ "price": 600 }
```

**Errors:** `404` Material not found

---

### DELETE `/api/materials/:id`

**Errors:** `404` Material not found

---

## Product APIs *(🔒 Protected)*

### POST `/api/products`

**Request Body:**
```json
{
  "modelNo": "LIV-001",
  "name": "Royal Sofa Set",
  "images": ["products/sofa-1.jpg", "products/sofa-2.jpg"],
  "mrp": 45000,
  "materialList": [
    { "materialId": "66f1a2b3c4d5e6f7a8b9c0d1", "name": "Teak Wood", "price": 500 }
  ],
  "totalBuildCost": 30000,
  "category": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Living Room"
  }
}
```

**Success (201):**
```json
{ "success": true, "message": "Product created successfully", "data": { ... } }
```

---

### GET `/api/products?searchKey=&page=&limit=`

| Query Param | Type | Default | Description |
|---|---|---|---|
| `searchKey` | string | — | Partial match on name or modelNo |
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

**Success (200):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "data": [...],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### GET `/api/products/:id`

**Errors:** `404` Product not found

---

### PUT `/api/products/:id`

**Request Body** *(partial)*:
```json
{ "mrp": 50000 }
```

**Errors:** `404` Product not found

---

### DELETE `/api/products/:id`

**Errors:** `404` Product not found

---

## Error Response Format

All errors follow:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Validation errors** include field details:
```json
{
  "success": false,
  "message": "Validation error",
  "data": [{ "field": "email", "message": "Invalid email address" }]
}
```

## Common Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 429 | Rate Limited |
| 500 | Internal Server Error |
