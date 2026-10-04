import React from 'react';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="bg-[#FAF4E8] border-y border-[#D8C5A8] py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          
          {/* Benefit 1 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#D8C5A8]">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4E8] text-[#C99A2E] flex items-center justify-center flex-shrink-0 border border-[#D8C5A8]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0C2.678 5.57 2.25 6.05 2.25 6.618v1.92" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#3B2A1A] uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-[#6B5842] font-light mt-0.5">On orders above ₹999</p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#D8C5A8]">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4E8] text-[#C99A2E] flex items-center justify-center flex-shrink-0 border border-[#D8C5A8]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#3B2A1A] uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-[#6B5842] font-light mt-0.5">Within 7 days return policy</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#D8C5A8]">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4E8] text-[#C99A2E] flex items-center justify-center flex-shrink-0 border border-[#D8C5A8]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#3B2A1A] uppercase tracking-wider">Secure Payments</h4>
              <p className="text-[11px] text-[#6B5842] font-light mt-0.5">100% safe &amp; encrypted</p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#D8C5A8]">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4E8] text-[#C99A2E] flex items-center justify-center flex-shrink-0 border border-[#D8C5A8]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#3B2A1A] uppercase tracking-wider">24/7 Support</h4>
              <p className="text-[11px] text-[#6B5842] font-light mt-0.5">We are here to help anytime</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
