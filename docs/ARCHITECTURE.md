# PayFlow Architecture Documentation

## 1. System Architecture Diagram

```
                                  +------------------------------------+
                                  |         React 18 + Vite            |
                                  |   (Tailwind CSS + Lucide Icons)    |
                                  +------------------------------------+
                                                    |
                                          REST API (Axios / Fetch)
                                                    |
                                                    v
                                  +------------------------------------+
                                  |          Express.js 4 API          |
                                  |    (Helmet, CORS, RateLimiter)     |
                                  +------------------------------------+
                                       /            |            \
                                      /             |             \
                         +---------------+  +---------------+  +---------------+
                         | Order Service |  |Payment Service|  |Product Service|
                         +---------------+  +---------------+  +---------------+
                                 |                  |                  |
                                 v                  v                  v
                         +---------------+  +---------------+  +---------------+
                         | MongoDB Store |  |Payment Provider| | MongoDB Store |
                         +---------------+  |   Interface   |  +---------------+
                                            +---------------+
                                             /             \
                                            /               \
                       +------------------------+      +------------------------+
                       |   Payoneer Provider    |      |     Mock Provider      |
                       | (Official Sandbox/Live)|      | (Isolated Dev Sandbox) |
                       +------------------------+      +------------------------+
                                    |                               |
                                    v                               v
                       +------------------------+      +------------------------+
                       | Payoneer Oscato API    |      | Simulated State Machine|
                       |  https://api.sandbox...|      |  (Success/Fail/Cancel) |
                       +------------------------+      +------------------------+
```

## 2. Core Architectural Principles

### A. Provider Pattern for Payments
The system is decoupled from any single payment vendor. The core domain layer talks exclusively to `IPaymentProvider`. Switching between Mock mode and Real Payoneer Sandbox is controlled dynamically via `PAYMENT_MODE` environment variable.

### B. Zero-Trust Frontend Amounts
- Frontend shopping carts send only product IDs and requested quantities.
- The server retrieves verified product records from the database, enforces active inventory checks, and performs server-side math for subtotals, tax calculation (e.g. standard state/jurisdiction rate), flat or tier-based shipping, and discounts.
- Payment intents are created strictly with backend-calculated totals.

### C. Idempotency & Concurrency Safety
- Every order is assigned an immutable alphanumeric identifier (e.g. `PF-2026-XXXXXX`).
- Payment requests check whether a non-terminal payment already exists for the given order to prevent double-charging.
- Webhook events are de-duplicated using a persistent `WebhookEvent` model with unique indices on `eventId` and `providerPaymentId`.

### D. Zero-Sensitive-Data Footprint (PCI DSS Compliance)
- The database schema never contains fields for credit card numbers, CVVs, expiration dates, or bank credentials.
- All payment interactions occur either via the official Payoneer Hosted Payment Page redirect or through verified provider tokens.

### E. Resilience & Zero-Configuration Local Development
- Automatic in-memory MongoDB fallback ensures the application runs out of the box even if a local MongoDB service is not running on the developer's computer.
- When `MONGODB_URI` is provided, the system seamlessly connects to standard local or cloud MongoDB instances (e.g., MongoDB Atlas).
