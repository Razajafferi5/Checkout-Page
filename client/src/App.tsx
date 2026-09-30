import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CustomCursor } from './components/common/CustomCursor';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { DemoBanner } from './components/common/DemoBanner';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Customer Pages
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MockGatewayPage } from './pages/MockGatewayPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Internal Pages
import { InternalLoginPage } from './pages/internal/InternalLoginPage';
import { OperationsPage } from './pages/operations/OperationsPage';
import { SandboxBenchPage } from './pages/sandbox/SandboxBenchPage';
import { AuditLogsPage } from './pages/internal/AuditLogsPage';

/**
 * Public Customer Shell:
 * Strictly isolated for end-customer e-commerce experience.
 * Contains customer Navbar, CartDrawer, and Footer.
 * Zero internal operations or sandbox controls are rendered here.
 */
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
              <CustomCursor />
              <ToastContainer />

              <Routes>
                {/* 1. PUBLIC CUSTOMER FLOWS (NO AUTHENTICATION REQUIRED) */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/mock-gateway" element={<MockGatewayPage />} />
                  <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/checkout/failed" element={<PaymentFailedPage />} />
                  <Route path="/checkout/cancelled" element={<PaymentCancelledPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* 2. DEDICATED INTERNAL LOGIN (SEPARATE TECHNICAL VIEW) */}
                <Route path="/internal/login" element={<InternalLoginPage />} />

                {/* 3. OPERATIONS CENTER (ROLE: OPERATIONS or SANDBOX_ADMIN) */}
                <Route
                  path="/operations"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <OperationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations/orders"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <OperationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations/payments"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <OperationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations/transactions"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <OperationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations/webhooks"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <OperationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operations/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'SANDBOX_ADMIN']}>
                      <AuditLogsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 4. SANDBOX BENCH (ROLE: SANDBOX_ADMIN ONLY) */}
                <Route
                  path="/sandbox"
                  element={
                    <ProtectedRoute allowedRoles={['SANDBOX_ADMIN']}>
                      <SandboxBenchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sandbox/scenarios"
                  element={
                    <ProtectedRoute allowedRoles={['SANDBOX_ADMIN']}>
                      <SandboxBenchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sandbox/transactions"
                  element={
                    <ProtectedRoute allowedRoles={['SANDBOX_ADMIN']}>
                      <SandboxBenchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sandbox/webhooks"
                  element={
                    <ProtectedRoute allowedRoles={['SANDBOX_ADMIN']}>
                      <SandboxBenchPage />
                    </ProtectedRoute>
                  }
                />

                {/* 5. BACKWARD COMPATIBLE ADMIN REDIRECTS */}
                <Route path="/admin" element={<Navigate to="/operations" replace />} />
                <Route path="/admin/payments" element={<Navigate to="/sandbox" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
