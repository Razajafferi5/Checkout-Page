import React from 'react';
import { CustomerInfo } from '../../types';
import { Mail, Phone, MapPin, Building, Globe, Check, AlertCircle } from 'lucide-react';
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
    <div className="space-y-8">
      {/* 01 CONTACT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 shadow-subtle p-7 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-warm dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-900 text-champagne font-mono text-xs font-bold flex items-center justify-center border border-champagne/30">
              01
            </span>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-charcoal dark:text-ivory">
              Contact Identification
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted">
            Step 1 of 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              First Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customer.firstName}
                onChange={e => setCustomer({ ...customer, firstName: e.target.value })}
                placeholder="Jane"
                className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.firstName
                    ? 'border-rose-400 bg-rose-50/20'
                    : customer.firstName.trim().length > 1
                    ? 'border-emerald-800 dark:border-champagne/60 focus:ring-1 focus:ring-champagne'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {customer.firstName.trim().length > 1 && !errors.firstName && (
                <Check className="w-3.5 h-3.5 text-champagne absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.firstName && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              Last Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customer.lastName}
                onChange={e => setCustomer({ ...customer, lastName: e.target.value })}
                placeholder="Doe"
                className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.lastName
                    ? 'border-rose-400 bg-rose-50/20'
                    : customer.lastName.trim().length > 1
                    ? 'border-emerald-800 dark:border-champagne/60 focus:ring-1 focus:ring-champagne'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {customer.lastName.trim().length > 1 && !errors.lastName && (
                <Check className="w-3.5 h-3.5 text-champagne absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.lastName && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={customer.email}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                placeholder="jane.doe@example.com"
                className={`w-full pl-9 pr-8 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.email
                    ? 'border-rose-400 bg-rose-50/20'
                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
                    ? 'border-emerald-800 dark:border-champagne/60 focus:ring-1 focus:ring-champagne'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) && !errors.email && (
                <Check className="w-3.5 h-3.5 text-champagne absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+1 (555) 0144"
                className={`w-full pl-9 pr-8 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.phone
                    ? 'border-rose-400 bg-rose-50/20'
                    : customer.phone.trim().length >= 7
                    ? 'border-emerald-800 dark:border-champagne/60 focus:ring-1 focus:ring-champagne'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {customer.phone.trim().length >= 7 && !errors.phone && (
                <Check className="w-3.5 h-3.5 text-champagne absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* 02 SHIPPING DETAILS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 shadow-subtle p-7 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-warm dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-900 text-champagne font-mono text-xs font-bold flex items-center justify-center border border-champagne/30">
              02
            </span>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-charcoal dark:text-ivory">
              Shipping Destination
            </h3>
          </div>
          <MapPin className="w-4 h-4 text-stone-muted" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              Street Address *
            </label>
            <input
              type="text"
              value={customer.shippingAddress.address}
              onChange={e => handleShippingChange('address', e.target.value)}
              placeholder="742 Evergreen Terrace"
              className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                errors.address
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.city}
                onChange={e => handleShippingChange('city', e.target.value)}
                placeholder="Springfield"
                className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.city
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {errors.city && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                State / Province *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.state}
                onChange={e => handleShippingChange('state', e.target.value)}
                placeholder="OR"
                className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.state
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {errors.state && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                Postal Code *
              </label>
              <input
                type="text"
                value={customer.shippingAddress.postalCode}
                onChange={e => handleShippingChange('postalCode', e.target.value)}
                placeholder="97477"
                className={`w-full px-4 py-2.5 rounded-lg border text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none transition-all ${
                  errors.postalCode
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-stone-warm dark:border-white/10 focus:border-emerald-800 dark:focus:border-champagne'
                }`}
              />
              {errors.postalCode && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
              Country *
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={customer.shippingAddress.country}
                onChange={e => handleShippingChange('country', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none focus:border-emerald-800 dark:focus:border-champagne font-mono"
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

      {/* 03 BILLING INFO */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 shadow-subtle p-7 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-warm dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-900 text-champagne font-mono text-xs font-bold flex items-center justify-center border border-champagne/30">
              03
            </span>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-charcoal dark:text-ivory">
              Billing Method
            </h3>
          </div>
          <Building className="w-4 h-4 text-stone-muted" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-charcoal dark:text-ivory select-none">
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
            className="w-4 h-4 rounded text-emerald-800 border-stone-warm dark:border-white/20 focus:ring-champagne"
          />
          <span>Billing address matches shipping destination</span>
        </label>

        {!billingSameAsShipping && (
          <div className="pt-4 border-t border-stone-warm dark:border-white/10 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                Billing Street Address *
              </label>
              <input
                type="text"
                value={customer.billingAddress.address}
                onChange={e => handleBillingChange('address', e.target.value)}
                placeholder="Billing address"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.city}
                  onChange={e => handleBillingChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none focus:border-emerald-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.state}
                  onChange={e => handleBillingChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none focus:border-emerald-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mb-1.5">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={customer.billingAddress.postalCode}
                  onChange={e => handleBillingChange('postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
