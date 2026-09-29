# PayFlow REST API Reference

All requests and responses use JSON format (`application/json`).
All successful responses return `{ "success": true, "data": ... }`.
All error responses return `{ "success": false, "error": { "code": "...", "message": "..." } }`.

---

## 1. System Health & Environment
### `GET /api/health`
Checks server status, database connectivity, and current payment provider mode.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-09-29T11:45:00.000Z",
    "database": "connected",
    "paymentMode": "mock",
    "version": "1.0.0"
  }
}
```

---

## 2. Products
### `GET /api/products`
Retrieves all active catalog products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65b4c1000000000000000001",
      "name": "AudioPro Noise-Cancelling Headphones",
      "slug": "audiopro-noise-cancelling-headphones",
      "description": "Premium active noise cancelling over-ear studio monitors.",
      "price": 149.99,
      "currency": "USD",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "category": "Audio",
      "stock": 45,
      "active": true
    }
  ]
}
```

### `GET /api/products/:id`
Retrieves a single product by ID or slug.

---

## 3. Orders
### `POST /api/orders`
Validates customer details and items, calculates pricing on server, and creates a pending order.

**Request Body:**
```json
{
  "customer": {
    "firstName": "Alex",
    "lastName": "Morgan",
    "email": "alex.morgan@example.com",
    "phone": "+1 555-019-2834",
    "shippingAddress": {
      "address": "100 Innovation Way",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "US"
    },
    "billingAddress": {
      "address": "100 Innovation Way",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "US"
    }
  },
  "items": [
    {
      "productId": "65b4c1000000000000000001",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b4c1000000000000000099",
    "orderNumber": "PF-2026-894123",
    "subtotal": 149.99,
    "discount": 0.00,
    "tax": 12.37,
    "shipping": 9.99,
    "total": 172.35,
    "currency": "USD",
    "status": "PENDING_PAYMENT",
    "paymentStatus": "PENDING",
    "createdAt": "2026-09-29T11:45:00.000Z"
  }
}
```

### `GET /api/orders/:orderNumber`
Fetches order details along with associated payment records.

---

## 4. Payments
### `POST /api/payments/create`
Initializes a payment session for an order with the active payment provider (Payoneer or Mock).

**Request Body:**
```json
{
  "orderId": "65b4c1000000000000000099"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "65b4c1000000000000000201",
    "orderNumber": "PF-2026-894123",
    "provider": "mock",
    "providerPaymentId": "MOCK_LIST_65b4c100",
    "redirectUrl": "http://localhost:5173/checkout/mock-gateway?paymentId=65b4c1000000000000000201",
    "amount": 172.35,
    "currency": "USD",
    "status": "PENDING"
  }
}
```

### `GET /api/payments/:id`
Retrieves real-time status of a payment.

### `POST /api/payments/:id/cancel`
Marks a payment and order as cancelled by user request.

### `POST /api/payments/mock-action` (Development/Testing only)
Simulates state transitions (SUCCESS, FAILED, CANCELLED) when `PAYMENT_MODE=mock`.

**Request Body:**
```json
{
  "paymentId": "65b4c1000000000000000201",
  "action": "SUCCESS"
}
```

---

## 5. Webhooks
### `POST /api/webhooks/payoneer`
Webhook receiver for Payoneer payment notifications. Validates authorization token/secret, verifies payload integrity, and processes status idempotently.

---

## 6. Admin & Reporting
### `GET /api/admin/stats`
Returns aggregated analytics: Total Orders, Successful Payments, Revenue, Pending Payments, Failed Payments.

### `GET /api/admin/payments`
Lists transactions with filters (status, provider, date) and pagination.

### `GET /api/admin/orders`
Lists all orders with detailed customer information and payment associations.
