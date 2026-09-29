import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomCursor } from './components/common/CustomCursor';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { DemoBanner } from './components/common/DemoBanner';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MockGatewayPage } from './pages/MockGatewayPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminPaymentDebugPage } from './pages/AdminPaymentDebugPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <CustomCursor />
            <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
              <DemoBanner />
              <Navbar />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/mock-gateway" element={<MockGatewayPage />} />
                  <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/checkout/failed" element={<PaymentFailedPage />} />
                  <Route path="/checkout/cancelled" element={<PaymentCancelledPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/payments" element={<AdminPaymentDebugPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <CartDrawer />
              <ToastContainer />
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
