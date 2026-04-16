import React, { useState } from 'react';

const INITIAL_ORDERS = [
  { id: "#13054878", contact: "7891083763", date: "Mar 25 at 2:47 PM", amount: "₹970", type: "Delivery", status: "COMPLETED", items: 2, mode: "Prepaid", paymentStatus: "Paid", email: "sachinsachdev4646@gmail.com", address: "12 Rudra Enclave Raipura chauraya road, KOTA RAJASTHAN 324004", customerName: "Sachin Sachdev" },
  { id: "#13054876", contact: "9827341122", date: "Mar 25 at 2:47 PM", amount: "₹500", type: "Delivery", status: "COMPLETED", items: 1, mode: "Prepaid", paymentStatus: "Paid", email: "user2@gmail.com", address: "Mumbai, Maharashtra", customerName: "Customer Two" },
  { id: "#13054574", contact: "8822334455", date: "Mar 25 at 2:01 PM", amount: "₹1109", type: "Delivery", status: "COMPLETED", items: 3, mode: "Prepaid", paymentStatus: "Paid", email: "user3@gmail.com", address: "Delhi, India", customerName: "Customer Three" },
];

const OrderTab = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const stats = [
    { label: "Total orders", value: "388" },
    { label: "Total revenue", value: "₹2,07,205" },
    { label: "Total pending orders", value: "276" },
    { label: "Total completed orders", value: "112" },
  ];

  const filters = [
    { label: "All", count: 388 },
    { label: "New", count: 0 },
    { label: "Bill Sent", count: 0 },
    { label: "Ready To Pick", count: 208 },
    { label: "In Transit", count: 68 },
    { label: "Completed", count: 112 },
    { label: "Others", count: 0 },
  ];

  const handleDownloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Order ID,Contact,Date,Amount,Type,Status,Items,Mode,Payment\n" 
      + orders.map(o => `${o.id},${o.contact},${o.date},${o.amount},${o.type},${o.status},${o.items},${o.mode},${o.paymentStatus}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Orders_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (viewingOrder) {
    return (
      <div className="p-6 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setViewingOrder(null)} 
            className="flex items-center gap-2 text-slate-600 mb-6 font-medium hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Order ID: {viewingOrder.id} | {viewingOrder.date}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-4">
                  <span className="text-xs  uppercase tracking-wider text-slate-400">Items ({viewingOrder.items})</span>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border border-emerald-100">Delivered</span>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300">📦</div>
                   <div className="flex-1">
                     <p className="text-sm  text-slate-800">Product details and specifications</p>
                     <p className="text-xs text-slate-500 mt-1">Qty: {viewingOrder.items} • {viewingOrder.amount}</p>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-xs  uppercase tracking-wider text-slate-400 mb-4 border-b pb-4">Address Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400  uppercase">Name & Contact</p>
                    <p className="text-sm  text-slate-800">{viewingOrder.customerName} | {viewingOrder.contact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400  uppercase">Email</p>
                    <p className="text-sm font-medium text-blue-600">{viewingOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400  uppercase">Delivery Address</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{viewingOrder.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 h-fit">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-xs  uppercase tracking-wider text-slate-400 mb-4 border-b pb-4">Payment Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Bill Amount</span>
                    <span className=" text-slate-900">{viewingOrder.amount}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 mt-3">
                    <span className=" text-slate-900">Grand Total</span>
                    <span className="font-black text-slate-900 text-lg">{viewingOrder.amount}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-slate-900 text-white text-xs  py-3 rounded-lg hover:bg-slate-800 transition-all">
                  Generate Shipping Label
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col gap-1">
                <button className="text-left p-3 hover:bg-slate-50 rounded-lg text-xs  text-slate-600 flex items-center gap-3">
                  <span>📱</span> Send via WhatsApp
                </button>
                <button className="text-left p-3 hover:bg-slate-50 rounded-lg text-xs  text-slate-600 flex items-center gap-3">
                  <span>✉️</span> Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders</h1>
          <select className="bg-white border border-slate-200 text-xs  px-3 py-1.5 rounded-lg shadow-sm outline-none">
            <option>Last 30 days</option>
            <option>Today</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 text-xs  text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            Order report
          </button>
          <button className="px-4 py-2 text-xs  text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Create a manual order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between p-2 gap-4 border-b border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto">
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs  whitespace-nowrap transition-all ${
                  activeFilter === f.label ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === f.label ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto px-2">
            <input type="text" placeholder="Search orders..." className="w-full lg:w-64 pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-4 bg-blue-50 p-3 border-b border-blue-100 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs  text-blue-700">{selectedOrders.length} selected</span>
            <div className="relative">
              <button 
                onClick={() => setShowBulkMenu(!showBulkMenu)}
                className="bg-white border border-blue-200 text-blue-700 text-[10px] font-black px-3 py-1 rounded uppercase flex items-center gap-2"
              >
                Bulk actions ▾
              </button>
              {showBulkMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
                  <button className="w-full text-left px-4 py-2 text-xs  text-slate-600 hover:bg-slate-50">Mark as Ready</button>
                  <button className="w-full text-left px-4 py-2 text-xs  text-slate-600 hover:bg-slate-50">In Transit</button>
                  <button className="w-full text-left px-4 py-2 text-xs  text-slate-600 hover:bg-slate-50 border-t">Mark Completed</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-slate-200">
              <tr className="text-[11px]  text-slate-900 uppercase tracking-tight">
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" className="rounded border-slate-300" onChange={toggleSelectAll} checked={selectedOrders.length === orders.length} />
                </th>
                <th className="px-4 py-4 text-[#2563eb]">Order ID</th>
                <th className="px-4 py-4 text-[#2563eb]">Contact</th>
                <th className="px-4 py-4 text-[#2563eb]">Date</th>
                <th className="px-4 py-4 text-[#2563eb] text-right">Amount</th>
                <th className="px-4 py-4 text-[#2563eb] text-center">Status</th>
                <th className="px-4 py-4 text-[#2563eb] text-center">Items</th>
                <th className="px-4 py-4 text-[#2563eb] text-center">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => setViewingOrder(order)}
                  className={`hover:bg-blue-50/30 transition-colors text-[13px] text-slate-700 cursor-pointer ${selectedOrders.includes(order.id) ? 'bg-blue-50/40' : ''}`}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" checked={selectedOrders.includes(order.id)} onChange={() => toggleSelectOrder(order.id)} />
                  </td>
                  <td className="px-4 py-4  text-slate-900">{order.id}</td>
                  <td className="px-4 py-4 font-medium text-slate-500">{order.contact}</td>
                  <td className="px-4 py-4 text-slate-400 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-4  text-slate-900 text-right">{order.amount}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                  </td>
                  <td className="px-4 py-4 text-center ">{order.items}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-emerald-600  text-[11px] uppercase">{order.paymentStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTab;