import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { CustomerInfo } from '../types';
import { api } from '../services/api';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PayoneerPaymentSection } from '../components/checkout/PayoneerPaymentSection';
import { ShoppingBag, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const { items, total } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555-0144',
    shippingAddress: {
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'US',
    },
    billingAddress: {
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
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
      showNotification('error', 'Your shopping bag is empty. Please select products first.');
      return;
    }

    if (!validateForm()) {
      showNotification('error', 'Please complete the required destination fields.', 'Validation Error');
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
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-stone-warm/50 dark:bg-ivory-elevated rounded-3xl flex items-center justify-center mx-auto mb-6 text-charcoal-muted dark:text-champagne shadow-subtle border border-stone-warm dark:border-white/10"
        >
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </motion.div>
        <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-ivory tracking-tight">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-charcoal-muted dark:text-stone-muted text-xs font-mono uppercase tracking-wider mt-2 max-w-sm mx-auto leading-relaxed">
          Please select items from the catalog before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-ivory font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-emerald border border-emerald-700/40"
        >
          <ArrowLeft className="w-4 h-4 text-champagne" />
          <span>Explore Store</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 pb-24 space-y-10">
      {/* Checkout Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-warm dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 dark:text-champagne font-bold block mb-1">
            Certified Gateway Session
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-charcoal dark:text-ivory">
            Checkout
          </h1>
        </div>

        {/* Stepped Progress Bar */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-wider">
          <span className="flex items-center gap-1.5 text-emerald-900 dark:text-champagne font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-900 text-champagne text-[10px] flex items-center justify-center border border-champagne/40">1</span>
            Contact
          </span>
          <span className="text-stone-warm dark:text-white/20">───</span>
          <span className="flex items-center gap-1.5 text-charcoal-muted dark:text-stone-muted">
            <span className="w-5 h-5 rounded-full border border-stone-warm dark:border-white/20 text-[10px] flex items-center justify-center">2</span>
            Details
          </span>
          <span className="text-stone-warm dark:text-white/20">───</span>
          <span className="flex items-center gap-1.5 text-charcoal-muted dark:text-stone-muted">
            <span className="w-5 h-5 rounded-full border border-stone-warm dark:border-white/20 text-[10px] flex items-center justify-center">3</span>
            Payoneer
          </span>
        </div>
      </div>

      {/* 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Billing Info */}
        <div className="lg:col-span-7 space-y-6">
          <CheckoutForm
            customer={customer}
            setCustomer={setCustomer}
            errors={errors}
            billingSameAsShipping={billingSameAsShipping}
            setBillingSameAsShipping={setBillingSameAsShipping}
          />
        </div>

        {/* Right: Payoneer Payment Section & Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <PayoneerPaymentSection />
          <OrderSummary
            onPay={handleInitiatePayment}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};
