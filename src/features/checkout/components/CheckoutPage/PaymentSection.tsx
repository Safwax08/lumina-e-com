import React from 'react';

interface PaymentSectionProps {
  paymentMethod: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ paymentMethod, onChange }) => {
  return (
    <div className="bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-6 space-y-4 shadow-lg">
      <h3 className="text-base font-bold font-serif text-[#3B2A1A]">2. Payment Method</h3>
      
      <div className="space-y-3">
        {[
          { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', desc: 'Instant 0% transaction fee' },
          { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
          { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Pay when order arrives' }
        ].map(pm => (
          <label
            key={pm.id}
            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === pm.id
                ? 'bg-[#FFFDF8] border-[#C99A2E] text-[#3B2A1A]'
                : 'bg-[#FAF4E8] border-[#D8C5A8] text-[#6B5842] hover:border-[#C99A2E]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value={pm.id}
                checked={paymentMethod === pm.id}
                onChange={onChange}
                className="accent-[#C99A2E]"
              />
              <div>
                <p className="text-xs font-bold">{pm.name}</p>
                <p className="text-[10px] text-[#6B5842]">{pm.desc}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#C99A2E] font-bold">Recommended</span>
          </label>
        ))}
      </div>
    </div>
  );
};
