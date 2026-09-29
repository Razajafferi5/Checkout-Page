import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { CustomerInfo } from '../types';
import { api } from '../services/api';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PayoneerPaymentSection } from '../components/checkout/PayoneerPaymentSection';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
      showNotification('error', 'Please correct the highlighted fields in the form.', 'Validation Error');
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
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Checkout Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          You need at least one product in your cart to proceed with the Payoneer payment checkout.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your shipping address and review your order before paying.
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Store</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <CheckoutForm
            customer={customer}
            setCustomer={setCustomer}
            errors={errors}
            billingSameAsShipping={billingSameAsShipping}
            setBillingSameAsShipping={setBillingSameAsShipping}
          />
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
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
