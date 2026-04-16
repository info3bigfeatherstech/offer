import React, { useEffect, useState } from 'react';
import { ChevronRight, X, Truck, Wallet, MapPin, BadgeDollarSign, ShoppingBag } from 'lucide-react';

const DeliveryTab = () => {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Adds smooth animation
    });
  }, []);
  // Configuration for the menu items
  const sections = [
    {
      title: "Delivery charges",
      items: [
        {
          id: "min-order",
          title: "Minimum order value for delivery",
          description: "Set a minimum value for orders to be eligible for delivery",
          icon: <ShoppingBag size={20} className="text-blue-500" />
        },
        {
          id: "delivery-charge",
          title: "Delivery charge",
          description: "Set charges for delivery",
          icon: <Truck size={20} className="text-blue-500" />
        },
        {
          id: "cod-charge",
          title: "Cash on delivery charges",
          description: "Switch on Cash on Delivery to set charges",
          icon: <Wallet size={20} className="text-blue-500" />
        }
      ]
    },
    {
      title: "Shipping",
      items: [
        {
          id: "delivery-partners",
          title: "Deliver using Delivery Partners",
          description: "Set up delivery using our delivery partners",
          icon: <BadgeDollarSign size={20} className="text-blue-500" />
        },
        {
          id: "pickup-address",
          title: "Pickup addresses",
          description: "Set up & manage your pickup addresses",
          icon: <MapPin size={20} className="text-blue-500" />
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-2xl  text-gray-900 mb-8">Delivery settings</h1>

      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Section Header */}
            <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-200">
              <span className="text-xs  text-gray-500 uppercase tracking-widest">
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
                      <h3 className="text-sm  text-gray-800 group-hover:text-blue-600 transition-colors">
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

      {/* --- Simple Modal System --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg  text-gray-900">{activeModal.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <p className="text-sm text-gray-500 mb-6">
                Configure your <span className=" text-gray-700">{activeModal.title.toLowerCase()}</span> settings below.
              </p>

              {/* Dummy Input for visual completeness */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs  text-gray-400 uppercase tracking-wider">Amount / Value</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2 text-sm  text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm  rounded-xl shadow-md transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTab;