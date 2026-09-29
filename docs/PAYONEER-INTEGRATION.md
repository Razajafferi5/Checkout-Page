# Official Payoneer Checkout Integration Specification

## 1. Overview & Architecture
Payoneer Checkout (powered by the Optile enterprise payment orchestration platform) provides a secure, PCI DSS Level 1 compliant hosted checkout solution. Under this architecture:
- Cardholder data (PAN, CVV, expiry dates) is entered directly on Payoneer's secure hosted payment page.
- Our merchant server **never** touches, transmits, or stores sensitive credit/debit card credentials.
- Transaction amounts, product prices, discounts, and shipping are strictly calculated and validated on the backend before the session is generated.

```
+---------------+              +-----------------+             +-------------------+
|  React Client |              | Express Backend |             | Payoneer Sandbox  |
+---------------+              +-----------------+             +-------------------+
        |                               |                                |
        |  1. POST /api/orders          |                                |
        |------------------------------>|                                |
        |     (Items & Shipping Info)   |                                |
        |                               | 2. Server calculates totals    |
        |                               |    Saves internal Order        |
        |                               |                                |
        |  3. POST /api/payments/create |                                |
        |------------------------------>| 4. Server calls Payoneer       |
        |     (orderId)                 |    POST /api/lists             |
        |                               |------------------------------->|
        |                               |    (Basic Auth + Order Data)   |
        |                               |                                |
        |                               |<-------------------------------|
        |                               |    5. Returns redirect URL &   |
        |                               |       identification.longId    |
        |                               |                                |
        |  6. Returns redirect URL      | 7. Records Payment as PENDING  |
        |<------------------------------|                                |
        |                               |                                |
        |  8. Redirects browser         |                                |
        |--------------------------------------------------------------->|
        |                               |                                |
        |                               |   9. Customer completes payment|
        |                               |                                |
        |                               |<-------------------------------|
        |                               |   10. Webhook / Notification   |
        |                               |       POST /api/webhooks/payoneer
        |                               |       Backend updates status   |
        |                               |                                |
        | 11. Customer redirected to    |                                |
        |     frontend returnUrl        |                                |
        |     (/checkout/confirmation)  |                                |
        |<---------------------------------------------------------------|
        |                               |                                |
        | 12. GET /api/orders/:orderNum |                                |
        |------------------------------>| 13. Returns verified state     |
        |<------------------------------|                                |
```

---

## 2. API Endpoints & Environments

| Environment | Base URL | Purpose |
| :--- | :--- | :--- |
| **Sandbox (Test)** | `https://api.sandbox.oscato.com/api/lists` | Integration testing, mock transactions, test cards |
| **Production (Live)** | `https://api.live.oscato.com/api/lists` | Live payment processing with real accounts |

---

## 3. Authentication Mechanism
Payoneer Checkout server-to-server API calls require **HTTP Basic Authentication**:
- **Username**: Payoneer Merchant Code (e.g., `store_alpha`)
- **Password**: Payoneer Payment API Token (generated in portal under *Integration > API access*)
- **HTTP Header**:
  ```http
  Authorization: Basic base64(MERCHANT_CODE:PAYMENT_API_TOKEN)
  Content-Type: application/json
  Accept: application/json
  ```
> **Security Rule**: API tokens and merchant credentials are strictly maintained on the backend in environment variables. They are never sent to or accessible by client-side code.

---

## 4. Payment Creation Request: `POST /api/lists`

When a customer proceeds to checkout, the server constructs the payment session payload:

```json
{
  "integration": "HOSTED",
  "division": "YOUR_STORE_DIVISION_CODE",
  "transactionId": "PF-2026-894123",
  "customer": {
    "number": "CUST_64f128",
    "email": "customer@example.com",
    "name": {
      "firstName": "Alex",
      "lastName": "Morgan"
    },
    "addresses": {
      "billing": {
        "street": "100 Innovation Way",
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "US"
      },
      "shipping": {
        "street": "100 Innovation Way",
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "US"
      }
    }
  },
  "payment": {
    "reference": "Order PF-2026-894123",
    "amount": 239.98,
    "currency": "USD"
  },
  "style": {
    "language": "en"
  },
  "callback": {
    "returnUrl": "http://localhost:5173/checkout/confirmation?orderNumber=PF-2026-894123",
    "cancelUrl": "http://localhost:5173/checkout/cancelled?orderNumber=PF-2026-894123",
    "notificationUrl": "http://localhost:5000/api/webhooks/payoneer?token=WEBHOOK_SECRET"
  }
}
```

### Response from Payoneer Sandbox
The response contains session identification and the redirect link:
```json
{
  "identification": {
    "longId": "65b4c100000000000001",
    "shortId": "912-384-551",
    "transactionId": "PF-2026-894123"
  },
  "resultInfo": "Transaction created successfully",
  "status": {
    "code": "LISTED"
  },
  "links": {
    "self": "https://api.sandbox.oscato.com/api/lists/65b4c100000000000001",
    "redirect": "https://api.sandbox.oscato.com/hosted/65b4c100000000000001"
  }
}
```

Our frontend receives `links.redirect` and navigates the user directly to the hosted payment page.

---

## 5. Payment Status Lifecycle & Verification

Never assume that a client return means a transaction is finalized. Verification is conducted via two complementary mechanisms:
1. **Server-to-Server Session Query**: `GET /api/lists/{longId}`
2. **Asynchronous Webhook Notifications** received at `notificationUrl`.

### Status Mapping Table

| Payoneer Status / Interaction | PayFlow Internal State | Order Status | Notes |
| :--- | :--- | :--- | :--- |
| `LISTED` | `PENDING` | `PENDING_PAYMENT` | Checkout session created, awaiting card entry |
| `PROCEED` (Reason: `OK`) | `PAID` | `PROCESSING` | Charge captured and verified |
| `PENDING` / `WAITING` | `PROCESSING` | `PENDING_PAYMENT` | 3D Secure verification or asynchronous banking settlement |
| `REJECT` / `ABORT` | `FAILED` | `PAYMENT_FAILED` | Insufficient funds, card decline, or invalid details |
| `CANCELLED` (via cancelUrl) | `CANCELLED` | `CANCELLED` | Customer aborted transaction |
| `EXPIRED` | `EXPIRED` | `CANCELLED` | Session TTL exceeded without submission |
| `REFUNDED` | `REFUNDED` | `REFUNDED` | Administrative refund issued |

---

## 6. Webhook / Notification Flow
- **Endpoint**: `POST /api/webhooks/payoneer`
- **Security**: Validated via secret query token / shared HMAC signature header `X-Signature` or query parameter configured during merchant registration.
- **Idempotency**: Webhook payload contains `identification.longId` and `transactionId`. Every incoming event is recorded in the `WebhookEvent` collection. If the event ID or transaction status has already reached terminal state (`PAID`), duplicate events are acknowledged with `200 OK` without reprocessing.

---

## 7. Sandbox vs Production Differences
| Aspect | Sandbox (`PAYONEER_SANDBOX=true`) | Production (`PAYONEER_SANDBOX=false`) |
| :--- | :--- | :--- |
| Base URL | `https://api.sandbox.oscato.com/api/lists` | `https://api.live.oscato.com/api/lists` |
| Portal Access | Payoneer Sandbox Portal | Payoneer Production Merchant Portal |
| Test Cards | Synthetic test cards (Magic amounts / test PANs) | Real consumer debit & credit cards |
| Settlement | Instant simulated settlement | Actual multi-currency merchant bank settlement |
| CORS | Permitted for sandbox tools | Strictly forbidden (backend calls only) |

---

## 8. Provider Pattern & Mock Sandbox Mode
To enable uninterrupted development, presentation, and unit testing even before official sandbox credentials are authenticated:
- **`PAYMENT_MODE=mock`**: Activates `MockPaymentProvider`. Simulates session initialization, synthetic hosted redirect/interactive modal, webhook emission, and state transitions (SUCCESS, FAILED, CANCELLED, PENDING).
- **`PAYMENT_MODE=payoneer`**: Activates `PayoneerProvider`, making authentic network calls to the official Payoneer API.

Both implement the unified `IPaymentProvider` interface:
```typescript
export interface IPaymentProvider {
  createPaymentSession(order: IOrder): Promise<PaymentSessionResult>;
  verifyPaymentStatus(providerPaymentId: string): Promise<PaymentVerificationResult>;
  cancelPaymentSession(providerPaymentId: string): Promise<PaymentCancelResult>;
  processWebhook(payload: unknown, headers: Record<string, string>): Promise<WebhookProcessResult>;
}
```

---

## 9. How to Test
1. **Mock Mode (Instant Testing)**:
   - Set `PAYMENT_MODE=mock` in `.env`.
   - Place an order on the checkout page.
   - Choose between instant Simulated Success, Failure, or Cancellation in the interactive testing simulator.
2. **Official Payoneer Sandbox Mode**:
   - Register for a Payoneer Sandbox Merchant account.
   - Obtain `PAYONEER_MERCHANT_CODE`, `PAYONEER_API_TOKEN`, and `PAYONEER_DIVISION`.
   - Set `PAYMENT_MODE=payoneer` in `.env`.
   - Execute the checkout flow to be redirected to Payoneer's live sandbox hosted payment page.
