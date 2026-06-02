# Livilon Backend — API Documentation

**Base URL:** `http://localhost:5000/api`

## Authentication transports

All protected routes accept a JWT through **either** of two transports — pick whichever fits your client. Both are checked on every request, so existing browser sessions and new mobile / Dart / SPA clients can coexist.

1. **`Authorization` header (recommended for mobile / Flutter / non-browser clients):**
   ```
   Authorization: Bearer <token>
   ```
   The `Bearer ` prefix is required. The token is returned in the login response body (see `POST /api/auth/login` below) and should be stored client-side (e.g. `localStorage` on web, `flutter_secure_storage` on mobile).

2. **HTTP-only cookie (default for browser sessions):**
   The login endpoint also sets a `token` cookie automatically. Browser clients that send `credentials: 'include'` / `withCredentials: true` will be authenticated transparently.

**Precedence:** when both are present, the `Authorization` header wins.

A request that omits both returns `401 Access token is missing`. An invalid/expired token returns `401 Access token is invalid or expired`.

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
  "data": {
    "id": "...",
    "email": "admin@livilon.com",
    "userId": "ADMIN001",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

The response **both** sets an HTTP-only `token` cookie (for browser clients) **and** returns the JWT in `data.token` (for clients that auth via the `Authorization: Bearer <token>` header — e.g. Flutter, mobile, any non-browser caller).

Clients that use Bearer auth should:

1. Read `response.data.data.token` from this endpoint.
2. Persist it (localStorage / `flutter_secure_storage` / Keychain).
3. Attach it to every subsequent request as `Authorization: Bearer <token>`.
4. On any `401`, clear the stored token and route back to login. Logout is purely client-side — delete the stored token.

> **Compatibility:** `id`, `email`, `userId` remain in `data` exactly as before — only the additional `token` key has been added. Existing browser flows that read `data.id` / `data.email` continue to work unchanged.

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

### Material Category enum

A Material can optionally be tagged with one of the following **predefined** categories (case-sensitive). The list is owned by the backend and exposed via [`GET /api/materials/categories`](#get-apimaterialscategories).

```
Plywood
MDF
PU foam sheet
EP sheet
Pins
Screws
Show beedings
Legs
```

`materialCategory` is optional everywhere: omit it, send `null`, or send one of the values above.

---

### GET `/api/materials/categories`

Returns the predefined list of material categories the frontend should render in dropdowns / filters.

**Success (200):**
```json
{
  "success": true,
  "message": "Material categories fetched successfully",
  "data": [
    "Plywood",
    "MDF",
    "PU foam sheet",
    "EP sheet",
    "Pins",
    "Screws",
    "Show beedings",
    "Legs"
  ]
}
```

**Errors:** `401` missing/invalid token

---

### POST `/api/materials`

**Request Body:**
```json
{
  "materialId": "MAT001",
  "name": "Teak Wood",
  "price": 500,
  "materialCategory": "Plywood"
}
```

| Field | Type | Required | Rule |
|---|---|---|---|
| `materialId` | string | yes | non-empty, unique |
| `name` | string | yes | non-empty |
| `price` | number | yes | `>= 0` |
| `materialCategory` | string \| null | no | If present, must be one of the 8 enum values (or `null`); omit to leave unset |

**Success (201):**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": {
    "_id": "...",
    "materialId": "MAT001",
    "name": "Teak Wood",
    "price": 500,
    "materialCategory": "Plywood",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `400` validation (e.g. invalid `materialCategory` value) · `401` missing/invalid token · `409` Duplicate materialId

---

### GET `/api/materials?searchKey=&materialCategory=`

| Query Param | Type | Description |
|---|---|---|
| `searchKey` | string | Partial case-insensitive match on `name` or `materialId` |
| `materialCategory` | string | Exact-match filter on the enum value (e.g. `Plywood`); unknown values simply return an empty list |

Both query params are optional and can be combined.

**Success (200):**
```json
{
  "success": true,
  "message": "Materials fetched successfully",
  "data": [
    {
      "_id": "...",
      "materialId": "MAT001",
      "name": "Teak Wood",
      "price": 500,
      "materialCategory": "Plywood",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> Documents created before this field was introduced will return `materialCategory: null` (Mongoose default).

**Errors:** `401` missing/invalid token

---

### PUT `/api/materials/:id`

**Request Body** *(partial — any subset of create fields):*
```json
{ "price": 600 }
```

To assign or change the category:
```json
{ "materialCategory": "MDF" }
```

To clear an existing category:
```json
{ "materialCategory": null }
```

**Errors:** `400` validation (e.g. invalid `materialCategory` value) · `401` missing/invalid token · `404` Material not found · `409` duplicate materialId

---

### DELETE `/api/materials/:id`

**Errors:** `401` missing/invalid token · `404` Material not found

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
    {
      "materialId": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Teak Wood",
      "price": 500,
      "quantity": 2,
      "totalPrice": 1000
    }
  ],
  "totalBuildCost": 30000,
  "category": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Living Room"
  }
}
```

**`materialList[]` item fields:**

| Field | Type | Required | Rule | Notes |
|---|---|---|---|---|
| `materialId` | string (ObjectId) | yes | non-empty | `_id` of a `Material` document; stored as ObjectId reference |
| `name` | string | yes | non-empty | Snapshot of material name at time of creation |
| `price` | number | yes | `>= 0` | Unit price snapshot |
| `quantity` | number | yes | `>= 1` | Number of units of this material used in the product |
| `totalPrice` | number | yes | `>= 0` | Line total (typically `price × quantity`); client-supplied, not auto-computed |

**Success (201):**
```json
{ "success": true, "message": "Product created successfully", "data": { ... } }
```

**Errors:** `400` validation (missing or invalid `quantity` / `totalPrice` etc.) · `401` missing/invalid token

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

**Request Body** *(partial — any subset of create-fields):*
```json
{ "mrp": 50000 }
```

When `materialList` is included in the update, every item must conform to the **same shape** as in `POST /api/products` (i.e. `materialId`, `name`, `price`, `quantity`, `totalPrice` are all required on every item — partial updates of individual line items are not supported).

**Errors:** `400` validation · `401` missing/invalid token · `404` Product not found

---

### DELETE `/api/products/:id`

**Errors:** `404` Product not found

---

## Order APIs *(Protected)*

> All routes mount `authMiddleware` and require the `token` cookie issued at login.  
> **Note on field naming:** the original `reference_images` field was renamed to `referenceImages` to match the camelCase convention used everywhere else in the project (`materialId`, `modelNo`, `totalBuildCost`, `clientName`, `soldPrice`, `productId`, etc.).

### POST `/api/orders`

**Request Body:**
```json
{
  "referenceImages": ["orders/sample-1.jpg", "orders/sample-2.jpg"],
  "productId": "66f1a2b3c4d5e6f7a8b9c0d1",
  "clientName": "John",
  "soldPrice": 100000
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `referenceImages` | string[] | no (defaults to `[]`) | Image paths/keys (same convention as `Product.images`) |
| `productId` | string (ObjectId) | yes | Must reference an existing `Product` document |
| `clientName` | string | no | Optional; if present must be non-empty |
| `soldPrice` | number | yes | `>= 0` |

**Success (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "referenceImages": ["..."],
    "productId": { "_id": "...", "modelNo": "...", "name": "...", "category": { ... }, ... },
    "clientName": "John",
    "soldPrice": 100000,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

> `productId` in the response contains the **fully populated Product document** (via Mongoose `populate`).

**Errors:** `400` validation / `productId` does not reference an existing product · `401` missing/invalid token

---

### GET `/api/orders?searchKey=&page=&limit=`

| Query Param | Type | Default | Description |
|---|---|---|---|
| `searchKey` | string | — | Partial case-insensitive match on `clientName` |
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

**Success (200):**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "data": [
      {
        "_id": "...",
        "referenceImages": ["..."],
        "productId": { "_id": "...", "modelNo": "...", "name": "...", ... },
        "clientName": "John",
        "soldPrice": 100000,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

Each item's `productId` is the populated `Product` document.

**Errors:** `401` missing/invalid token

---

### GET `/api/orders/:id`

Returns one order with the populated product.

**Errors:** `401` · `404` Order not found

---

### PUT `/api/orders/:id`

**Request Body** *(partial — any subset of the create fields):*
```json
{ "soldPrice": 95000 }
```

If `productId` is included in the update, it must reference an existing product.

**Errors:** `400` validation or unknown `productId` · `401` · `404` Order not found

---

### DELETE `/api/orders/:id`

**Errors:** `401` · `404` Order not found

---

## Dashboard APIs *(Protected)*

> All routes mount `authMiddleware` and require the `token` cookie.

### GET `/api/dashboard/overview`

Headline tile metrics for the admin dashboard home.

**Success (200):**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "totals": {
      "orders": 120,
      "sales": 4250000,
      "products": 32,
      "categories": 6,
      "materials": 48,
      "averageOrderValue": 35416.67
    },
    "today": { "orders": 2, "sales": 85000 },
    "thisMonth": { "orders": 17, "sales": 540000 }
  }
}
```

---

### GET `/api/dashboard/sales/monthly?year=YYYY`

Always returns a **dense 12-point series** (Jan → Dec) for the requested year, ready for chart consumption.

| Query Param | Type | Default | Notes |
|---|---|---|---|
| `year` | number | current year | `2000–2100` |

**Success (200):**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "year": 2026,
    "data": [
      { "month": 1, "label": "Jan", "totalSales": 0, "orderCount": 0 },
      { "month": 2, "label": "Feb", "totalSales": 120000, "orderCount": 3 },
      ...
      { "month": 12, "label": "Dec", "totalSales": 0, "orderCount": 0 }
    ]
  }
}
```

Months with no orders return `totalSales: 0`, `orderCount: 0` (so the frontend never has to backfill gaps).

---

### GET `/api/dashboard/sales/yearly`

Aggregated totals per year that has at least one order, sorted ascending.

**Success (200):**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": [
    { "year": 2024, "totalSales": 1200000, "orderCount": 22 },
    { "year": 2025, "totalSales": 3050000, "orderCount": 78 },
    { "year": 2026, "totalSales": 540000, "orderCount": 17 }
  ]
}
```

---

### GET `/api/dashboard/top-products?limit=5`

Top-selling products ranked by total revenue (sum of `soldPrice`).

| Query Param | Type | Default | Notes |
|---|---|---|---|
| `limit` | number | 5 | `1–100` |

**Success (200):**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": [
    {
      "productId": "66f1...",
      "totalSales": 850000,
      "orderCount": 7,
      "product": { "_id": "66f1...", "modelNo": "LIV-001", "name": "Royal Sofa Set", "category": { ... }, ... }
    }
  ]
}
```

`product` is the full Product document joined via `$lookup`; will be `null` if the underlying product has been deleted.

---

### GET `/api/dashboard/reports/csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Streams a CSV file containing all orders in the inclusive date range.

| Query Param | Type | Required | Notes |
|---|---|---|---|
| `startDate` | date (ISO string) | yes | Any value `new Date()` accepts |
| `endDate` | date (ISO string) | yes | Must be `>= startDate`; treated as end-of-day inclusive |

**Response headers:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="sales-report-<start>_to_<end>.csv"
```

**Columns:** `Order ID, Date, Client Name, Product Model No, Product Name, Category, Sold Price`  
A trailing block adds `Total Orders` and `Total Sales` summary rows.

**Errors:** `400` invalid date range · `401`

---

### GET `/api/dashboard/reports/pdf?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Streams a printable PDF sales report for the same date range, generated server-side via `pdfkit`.

| Query Param | Type | Required | Notes |
|---|---|---|---|
| `startDate` | date (ISO string) | yes | Same rules as CSV export |
| `endDate` | date (ISO string) | yes | Same rules as CSV export |

**Response headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="sales-report-<start>_to_<end>.pdf"
```

Contains: title, date range, paginated tabular order list, and `Total Orders` / `Total Sales` footer.

**Errors:** `400` invalid date range · `401`

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
