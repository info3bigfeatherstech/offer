    import React, { useState } from 'react';

const INQUIRY_DATA = [
  { id: 1, productImg: "https://via.placeholder.com/40", productName: "Mini Portable Money Counter Machin...", customerName: "Usman Memon", email: "usman.s.memon@gmail.com", status: "Inquiry Received", date: "10/04/26" },
  { id: 2, productImg: "https://via.placeholder.com/40", productName: "1 Pair Acupressure Reflexology Sock...", customerName: "cyber.teleorder@gmail.com", email: "cyber.teleorder@gmail.com", status: "Inquiry Received", date: "10/04/26" },
  { id: 3, productImg: "https://via.placeholder.com/40", productName: "Heavy Duty steel rope Length 5 Meter", customerName: "mandeepmr2550@gmail.com", email: "mandeepmr2550@gmail.com", status: "Inquiry Received", date: "10/04/26" },
  { id: 4, productImg: "https://via.placeholder.com/40", productName: "Pikstudio Perfume 50ml – Long-Lasti...", customerName: "rahultiwari34053@gmail.com", email: "rahultiwari34053@gmail.com", status: "Inquiry Received", date: "9/04/26" },
  { id: 5, productImg: "https://via.placeholder.com/40", productName: "Drain Pipe Cleaner Wire Spring – Unc...", customerName: "Vaijnath Kute", email: "vkute275@gmail.com", status: "Inquiry Received", date: "9/04/26" },
  { id: 6, productImg: "https://via.placeholder.com/40", productName: "i-FlashDevice HD 2TB USB 3.2 Flash ...", customerName: "ashish.shah1969@gmail.com", email: "ashish.shah1969@gmail.com", status: "Inquiry Received", date: "9/04/26" },
];

const OutOfStockTab = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 font-sans">
      {/* Header Section */}
      <div className="max-w-[1600px] mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font- text-slate-900 tracking-tight">Out of Stock Query</h1>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Settings
        </button>
      </div>

      {/* Filter Bar */}
      <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm mb-4 p-3 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search customer email, product name" 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg shadow-sm outline-none cursor-pointer">
            <option>Last 15 Days</option>
            <option>Last 30 Days</option>
          </select>
          <select className="bg-white border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg shadow-sm outline-none cursor-pointer">
            <option>All Inquiries</option>
            <option>Pending</option>
            <option>Responded</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Customer Info</th>
              <th className="px-6 py-4 text-center">Inquiry Status</th>
              <th className="px-6 py-4 text-right">Status Date ↓</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {INQUIRY_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img src={item.productImg} alt="" className="w-10 h-10 rounded-md border border-slate-200 object-cover" />
                    <span className="text-xs font- text-slate-800 group-hover:text-blue-600 transition-colors">{item.productName}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-xs font- text-slate-800">{item.customerName}</span>
                    <span className="text-[11px] font-medium text-blue-500 mt-0.5">{item.email}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-[10px] font- tracking-tight border border-slate-200">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xs font- text-slate-900">{item.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2 bg-[#F8FAFC]/50">
          <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {[1, 2, 3, 4, 5].map(page => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${currentPage === page ? 'bg-white border border-slate-200 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {page}
            </button>
          ))}
          <span className="text-slate-300 px-1">...</span>
          <button className="w-8 h-8 rounded-md text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">28</button>
          <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutOfStockTab;