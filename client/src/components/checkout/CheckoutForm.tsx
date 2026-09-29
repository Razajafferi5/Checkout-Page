import React from 'react';
import { CustomerInfo } from '../../types';
import { User, Mail, Phone, MapPin, Building, Globe, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  customer: CustomerInfo;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  errors: Record<string, string>;
  billingSameAsShipping: boolean;
  setBillingSameAsShipping: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customer,
  setCustomer,
  errors,
  billingSameAsShipping,
  setBillingSameAsShipping,
}) => {
  const handleShippingChange = (field: keyof CustomerInfo['shippingAddress'], value: string) => {
    setCustomer(prev => {
      const updatedShipping = { ...prev.shippingAddress, [field]: value };
      return {
        ...prev,
        shippingAddress: updatedShipping,
        billingAddress: billingSameAsShipping ? updatedShipping : prev.billingAddress,
      };
    });
  };

  const handleBillingChange = (field: keyof CustomerInfo['billingAddress'], value: string) => {
    setCustomer(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Contact Details */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold flex items-center justify-center">
              01
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-sans">
              Contact Information
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">* Required fields</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              First Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customer.firstName}
                onChange={e => setCustomer({ ...customer, firstName: e.target.value })}
                placeholder="Jane"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : customer.firstName.trim().length > 1
                    ? 'border-emerald-400 dark:border-emerald-500/60 focus:ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {customer.firstName.trim().length > 1 && !errors.firstName && (
                <Check className="w-3.5 h-3.5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.firstName && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Last Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customer.lastName}
                onChange={e => setCustomer({ ...customer, lastName: e.target.value })}
                placeholder="Doe"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : customer.lastName.trim().length > 1
                    ? 'border-emerald-400 dark:border-emerald-500/60 focus:ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {customer.lastName.trim().length > 1 && !errors.lastName && (
                <Check className="w-3.5 h-3.5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.lastName && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={customer.email}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                placeholder="jane.doe@example.com"
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
                    ? 'border-emerald-400 dark:border-emerald-500/60 focus:ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) && !errors.email && (
                <Check className="w-3.5 h-3.5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+1 (555) 0144"
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : customer.phone.trim().length >= 7
                    ? 'border-emerald-400 dark:border-emerald-500/60 focus:ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {customer.phone.trim().length >= 7 && !errors.phone && (
                <Check className="w-3.5 h-3.5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold flex items-center justify-center">
              02
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-sans">
              Shipping Destination
            </h3>
          </div>
          <MapPin className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={customer.shippingAddress.address}
              onChange={e => handleShippingChange('address', e.target.value)}
              placeholder="742 Evergreen Terrace"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.city}
                onChange={e => handleShippingChange('city', e.target.value)}
                placeholder="Springfield"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.city
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.city && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                State / Province *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.state}
                onChange={e => handleShippingChange('state', e.target.value)}
                placeholder="OR"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.state
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.state && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.postalCode}
                onChange={e => handleShippingChange('postalCode', e.target.value)}
                placeholder="97477"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.postalCode
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.postalCode && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Country *
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={customer.shippingAddress.country}
                onChange={e => handleShippingChange('country', e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="US">United States (US)</option>
                <option value="CA">Canada (CA)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="AU">Australia (AU)</option>
                <option value="SG">Singapore (SG)</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Billing Address */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold flex items-center justify-center">
              03
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-sans">
              Billing Method
            </h3>
          </div>
          <Building className="w-4 h-4 text-slate-400" />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={billingSameAsShipping}
            onChange={e => {
              const checked = e.target.checked;
              setBillingSameAsShipping(checked);
              if (checked) {
                setCustomer(prev => ({
                  ...prev,
                  billingAddress: { ...prev.shippingAddress },
                }));
              }
            }}
            className="w-4 h-4 rounded text-brand-600 border-slate-300 dark:border-slate-700 focus:ring-brand-500 bg-slate-50 dark:bg-slate-800"
          />
          <span>Billing address matches shipping address</span>
        </label>

        {!billingSameAsShipping && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Street Address *
              </label>
              <input
                type="text"
                value={customer.billingAddress.address}
                onChange={e => handleBillingChange('address', e.target.value)}
                placeholder="Billing address"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.city}
                  onChange={e => handleBillingChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.state}
                  onChange={e => handleBillingChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.postalCode}
                  onChange={e => handleBillingChange('postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
