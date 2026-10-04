import React from 'react';

interface ShippingFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ formData, onChange }) => {
  return (
    <div className="bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-6 space-y-4 shadow-lg">
      <h3 className="text-base font-bold font-serif text-[#3B2A1A] flex items-center gap-2">
        <span>1. Shipping Information</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#6B5842] mb-1">Street Address *</label>
        <input
          type="text"
          name="address"
          required
          placeholder="House/Flat No., Street, Landmark"
          value={formData.address}
          onChange={onChange}
          className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">City *</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">State *</label>
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6B5842] mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            required
            value={formData.pincode}
            onChange={onChange}
            className="w-full bg-[#FFFDF8] border border-[#D8C5A8] rounded-lg px-3 py-2 text-xs text-[#3B2A1A] focus:outline-none focus:border-[#C99A2E] font-mono"
          />
        </div>
      </div>
    </div>
  );
};
