import React, { useState } from 'react';
import { ChevronRight, X, CreditCard, FileText, RefreshCw, ReceiptText, ShieldCheck } from 'lucide-react';

const PaymentTab = () => {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  const sections = [
    {
      title: "Payment modes",
      items: [
        {
          id: "online-payments",
          title: "Online payment modes",
          description: "Set how you want to accept payments online",
          icon: <CreditCard size={20} className="text-blue-500" />,
          modalContent: "Enable or disable credit cards, UPI, net banking, and digital wallets for your storefront."
        }
      ]
    },
    {
      title: "Invoices & settlements",
      items: [
        {
          id: "gst-billing",
          title: "GST billing",
          description: "Generate GST invoices for customer orders",
          icon: <ReceiptText size={20} className="text-blue-500" />,
          modalContent: "Configure your GST number, HSN codes, and tax percentage applied to your invoices."
        },
        {
          id: "settlement-cycle",
          title: "Settlement cycle",
          description: "Next day",
          icon: <RefreshCw size={20} className="text-blue-500" />,
          modalContent: "Choose your preferred settlement frequency: T+1 (Next Day), T+2, or Weekly cycles."
        },
        {
          id: "payment-invoices",
          title: "Customer payment invoices",
          description: "View customer payment and settlements",
          icon: <FileText size={20} className="text-blue-500" />,
          modalContent: "Access historical records of all generated invoices and their current settlement status."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-2xl text-gray-900 mb-8">Payment settings</h1>

      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Section Header */}
            <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                {section.title}
              </span>
            </div>

            {/* Section Items */}
            <div className="divide-y divide-gray-100">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item)}
                  className="w-full flex items-center cursor-pointer justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Dynamic Modal System --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {activeModal.icon}
                </div>
                <h2 className="text-lg text-gray-900">{activeModal.title}</h2>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                <ShieldCheck className="text-green-600 shrink-0" size={18} />
                <p className="text-xs text-gray-600 leading-relaxed">
                  {activeModal.modalContent}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configure Preference</label>
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium">
                    <option>Standard Configuration</option>
                    <option>Advanced Settings</option>
                    <option>Legacy Mode</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                Update Payment Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTab;