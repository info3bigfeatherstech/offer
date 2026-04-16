import React from 'react';

// Feature data exactly as requested
const MEMBERSHIP_FEATURES = [
  { title: "Pan India Shipping", desc: "Pan India Deliveries. Deliver anything, anywhere. Now shipping over 26000 pincodes all over India. Go ahead & start shipping now", color: "bg-red-50", iconColor: "text-red-500" },
  { title: "Website Themes", desc: "Create a professional website with access to unlimited themes", color: "bg-amber-50", iconColor: "text-amber-500" },
  { title: "Coupons & Vouchers", desc: "Customers love discounts & offers. Create your own personalised coupons & generate more orders.", color: "bg-blue-50", iconColor: "text-blue-500" },
  { title: "Store Analytics", desc: "View traffic Analysis across domain", color: "bg-rose-50", iconColor: "text-rose-500" },
  { title: "Prepaid Orders", desc: "Upgrade your ordering experience for Customers. Let them make payment while placing the order.", color: "bg-indigo-50", iconColor: "text-indigo-500" },
  { title: "Payment Options", desc: "Now collect payment digitally using wallets, credit & debit cards from your customers, get money directly in your bank account", color: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "Google Analytics", desc: "Analyses the traffic & provides you real-time analysis, behaviour of your users on your website.", color: "bg-orange-50", iconColor: "text-orange-500" },
  { title: "Facebook Pixel", desc: "Verify your store with Facebook Business Manager and improve performance of Facebook ads with Pixel integration.", color: "bg-blue-100", iconColor: "text-blue-700" },
  { title: "Google Tag Manager", desc: "To track the effectiveness of your website, you can use Google tag to transfer data from your website to the associated products.", color: "bg-slate-50", iconColor: "text-slate-500" },
  { title: "Google Shopping", desc: "Lets you list your product and show them to users across all Google products: Search, Shopping, Maps & more.", color: "bg-yellow-50", iconColor: "text-yellow-600" },
  { title: "ePOS", desc: "Send digital bill & easily collect money online from your customers.", color: "bg-cyan-50", iconColor: "text-cyan-600" },
  { title: "Bulk Uploads", desc: "Easily manage your catalog by uploading & editing product details in bulk using excel sheet.", color: "bg-violet-50", iconColor: "text-violet-600" },
  { title: "Download Order Reports", desc: "Keep updated with your orders and accounts by downloading daily, monthly & quarterly order reports", color: "bg-pink-50", iconColor: "text-pink-600" },
  { title: "Staff Login", desc: "Run your online store with the help of your staffs by giving them permissions to manage your store.", color: "bg-gray-100", iconColor: "text-gray-600" },
  { title: "Inventory Management", desc: "Add, update & track stock of your products. Show low stock alert to customers on your site to boost orders.", color: "bg-lime-50", iconColor: "text-lime-600" },
  { title: "Customer Management", desc: "Manage, analyse and connect with your customers now to increase retention and get more orders.", color: "bg-teal-50", iconColor: "text-teal-600" },
  { title: "Lead Generation", desc: "Capture Email IDs/Phone number of customers visiting your store and convert them into sales", color: "bg-sky-50", iconColor: "text-sky-600" },
  { title: "Abandoned Cart", desc: "Connect with customers who have abandoned their carts and help them place orders!", color: "bg-amber-100", iconColor: "text-amber-700" },
  { title: "Out of Stock Query", desc: "Get your customer get notified when the product is back in stock", color: "bg-indigo-100", iconColor: "text-indigo-700" },
  { title: "Customer Reviews And Ratings", desc: "Allow your customers to share their experience with your products.", color: "bg-yellow-100", iconColor: "text-yellow-700" },
  { title: "GST Billing", desc: "Generate GST invoice for every order and download GST report of orders (GSTR – 1)", color: "bg-emerald-100", iconColor: "text-emerald-700" },
  { title: "Bulk Edit", desc: "Effortlessly manage your product catalog by making simultaneous edits to multiple items.", color: "bg-slate-200", iconColor: "text-slate-700" },
  { title: "Partial Payment", desc: "Boosting flexibility and trust, Pay a portion in advance rest on delivery with Partial Payment.", color: "bg-orange-100", iconColor: "text-orange-700" },
  { title: "Advance Custom SEO", desc: "Ability to create customised SEO settings for the products, categories, and collections.", color: "bg-blue-200", iconColor: "text-blue-900" }
];

const Ecomtab = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Dark Header Section */}
      <div className="bg-[#0A0A0A] text-white px-8 py-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <button className="mt-2 hover:bg-white/10 p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-3xl font-medium tracking-tight">
              Welcome to your <br />
              <span className="flex items-center gap-3 text-4xl mt-1">
                eCommerce 
                <span className="bg-[#B8860B]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ELITE
                </span>
                Membership
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-3 font-medium">
              Membership expires on 13/12/2026
            </p>
          </div>
        </div>
      </div>

      {/* Feature List Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-0">
          {MEMBERSHIP_FEATURES.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="flex items-start gap-6 py-8 px-4 hover:bg-slate-50 transition-all rounded-2xl cursor-pointer">
                {/* Colored Icon Container */}
                <div className={`w-14 h-14 shrink-0 rounded-2xl ${feature.color} flex items-center justify-center border border-white/10 shadow-sm`}>
                  <svg className={`w-7 h-7 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-2xl">
                    {feature.desc}
                  </p>
                </div>

                {/* Chevron */}
                <div className="flex items-center self-center text-slate-300 group-hover:text-slate-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Thin divider line */}
              {index !== MEMBERSHIP_FEATURES.length - 1 && (
                <div className="h-[1px] bg-slate-100 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecomtab;