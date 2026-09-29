import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { CustomerInfo } from '../types';
import { api } from '../services/api';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PayoneerPaymentSection } from '../components/checkout/PayoneerPaymentSection';
import { ShoppingBag, ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const { items, total } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 555-234-5678',
    shippingAddress: {
      address: '100 Innovation Way',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
    billingAddress: {
      address: '100 Innovation Way',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!customer.lastName.trim()) newErrors.lastName = 'Last name is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(customer.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!customer.phone.trim() || customer.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid contact phone number.';
    }

    if (!customer.shippingAddress.address.trim()) newErrors.address = 'Street address is required.';
    if (!customer.shippingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!customer.shippingAddress.state.trim()) newErrors.state = 'State / Province is required.';
    if (!customer.shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiatePayment = async () => {
    if (items.length === 0) {
      showNotification('error', 'Your shopping cart is empty. Please add products before checking out.');
      return;
    }

    if (!validateForm()) {
      showNotification('error', 'Please complete the required shipping information.', 'Validation Error');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customer,
        items: items.map(i => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
      };

      const order = await api.createOrder(orderPayload);
      const paymentSession = await api.createPayment(order._id);

      showNotification('info', 'Connecting to Payoneer Payment Gateway...', 'Session Initialized');

      if (paymentSession.redirectUrl.startsWith('http://') || paymentSession.redirectUrl.startsWith('https://')) {
        if (paymentSession.redirectUrl.includes('/checkout/mock-gateway')) {
          const url = new URL(paymentSession.redirectUrl);
          navigate(`${url.pathname}${url.search}`);
        } else {
          window.location.href = paymentSession.redirectUrl;
        }
      } else {
        navigate(paymentSession.redirectUrl);
      }
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.error?.message || (err as Error).message || 'Payment initiation failed.';
      showNotification('error', message, 'Payment Error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400 shadow-subtle"
        >
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </motion.div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Checkout Cart is Empty
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
          Please select products from the store before proceeding to the Payoneer hosted payment gateway.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 space-y-8">
      {/* Checkout Header & Steps */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted Session</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Checkout
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center">1</span>
            Details
          </span>
          <span className="text-slate-300 dark:text-slate-700">───</span>
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center">2</span>
            Payoneer Portal
          </span>
          <span className="text-slate-300 dark:text-slate-700">───</span>
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center">3</span>
            Confirmation
          </span>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Shipping details */}
        <div className="lg:col-span-7 space-y-6">
          <CheckoutForm
            customer={customer}
            setCustomer={setCustomer}
            errors={errors}
            billingSameAsShipping={billingSameAsShipping}
            setBillingSameAsShipping={setBillingSameAsShipping}
          />
        </div>

        {/* Right Column: Order Summary + Payoneer Gateway CTA */}
        <div className="lg:col-span-5 space-y-6">
          <OrderSummary />
          <PayoneerPaymentSection
            onPay={handleInitiatePayment}
            loading={loading}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};
