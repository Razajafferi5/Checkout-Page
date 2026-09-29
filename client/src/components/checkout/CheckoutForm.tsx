import React from 'react';
import { CustomerInfo } from '../../types';
import { User, Mail, Phone, MapPin, Building, Globe } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            1. Customer Contact
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              value={customer.firstName}
              onChange={e => setCustomer({ ...customer, firstName: e.target.value })}
              placeholder="e.g. Alex"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.firstName
                  ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
            />
            {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={customer.lastName}
              onChange={e => setCustomer({ ...customer, lastName: e.target.value })}
              placeholder="e.g. Morgan"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.lastName
                  ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
            />
            {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={customer.email}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                placeholder="alex.morgan@example.com"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            2. Shipping Address
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              value={customer.shippingAddress.address}
              onChange={e => handleShippingChange('address', e.target.value)}
              placeholder="100 Innovation Way, Suite 400"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
            />
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={customer.shippingAddress.city}
                onChange={e => handleShippingChange('city', e.target.value)}
                placeholder="Austin"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.city
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province *</label>
              <input
                type="text"
                value={customer.shippingAddress.state}
                onChange={e => handleShippingChange('state', e.target.value)}
                placeholder="TX"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.state
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code *</label>
              <input
                type="text"
                value={customer.shippingAddress.postalCode}
                onChange={e => handleShippingChange('postalCode', e.target.value)}
                placeholder="78701"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.postalCode
                    ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
              {errors.postalCode && <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={customer.shippingAddress.country}
                onChange={e => handleShippingChange('country', e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
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
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            3. Billing Information
          </h3>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
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
            className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
          />
          <span>Billing address is identical to shipping address</span>
        </label>

        {!billingSameAsShipping && (
          <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address *</label>
              <input
                type="text"
                value={customer.billingAddress.address}
                onChange={e => handleBillingChange('address', e.target.value)}
                placeholder="Street address"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={customer.billingAddress.city}
                  onChange={e => handleBillingChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  value={customer.billingAddress.state}
                  onChange={e => handleBillingChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={customer.billingAddress.postalCode}
                  onChange={e => handleBillingChange('postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
