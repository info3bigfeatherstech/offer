import React, { useState } from 'react';

const REVIEWS_DATA = [
  { id: 1, productImg: "https://via.placeholder.com/40", productName: "FunBlast Elephant Toy with Levitation Ball", customerName: "Rohit", contact: "9716081775", rating: 5.0, date: "Dec 14, 2025", isPublished: true, comment: "Excellent quality and my kid loves it!" },
  { id: 2, productImg: "https://via.placeholder.com/40", productName: "7 in 1 Ultra Sport Version Watch 49 MM", customerName: "Minku", contact: "9115571611", rating: 1.0, date: "Dec 12, 2025", isPublished: false, comment: "Defective product received." },
  { id: 3, productImg: "https://via.placeholder.com/40", productName: "Stainless Steel Kitchen Knife Set", customerName: "Manoj", contact: "9312850375", rating: 5.0, date: "Dec 11, 2025", isPublished: true, comment: "Very sharp and professional." },
  { id: 4, productImg: "https://via.placeholder.com/40", productName: "Pure Copper Water Bottle 950ml", customerName: "AMIR", contact: "8451891530", rating: 3.0, date: "Dec 7, 2025", isPublished: true, comment: "Ok ok" },
];

const CustomerReviewTab = () => {
  const [reviews, setReviews] = useState(REVIEWS_DATA);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const togglePublish = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isPublished: !r.isPublished } : r));
    if (selectedReview?.id === id) {
      setSelectedReview(prev => ({ ...prev, isPublished: !prev.isPublished }));
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Customer Reviews</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Settings</button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Help</button>
        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-center">Rating</th>
              <th className="px-6 py-4 text-center">Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <img src={review.productImg} alt="" className="w-10 h-10 rounded border border-slate-100" />
                    <span className="text-[13px] font-medium text-slate-700 truncate">{review.productName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-[13px]">
                    <span className="font-semibold text-slate-900">{review.customerName}</span>
                    <span className="text-slate-500">{review.contact}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-medium text-slate-700">{review.rating.toFixed(1)} ⭐</span>
                </td>
                <td className="px-6 py-4 text-center text-xs text-slate-500">{review.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${
                    review.isPublished 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                    {review.isPublished ? "Published" : "New"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedReview(review)}
                    className="text-blue-600 hover:text-blue-800 text-[13px] font-medium px-4 py-1.5 border border-blue-100 rounded-lg hover:bg-blue-50"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            <button 
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Media Area (Left) */}
            <div className="md:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-8 border-r border-slate-100">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-slate-400 text-sm italic">No media attached</p>
            </div>

            {/* Details Area (Right) */}
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Customer review</h3>
                <button 
                  onClick={() => togglePublish(selectedReview.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedReview.isPublished 
                    ? "text-red-500 border-red-100 hover:bg-red-50" 
                    : "text-blue-600 border-blue-100 hover:bg-blue-50"
                  }`}
                >
                  {selectedReview.isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>

              <div className="space-y-6 flex-1">
                {/* Product Snippet */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={selectedReview.productImg} alt="" className="w-10 h-10 rounded-md shadow-sm" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{selectedReview.productName}</p>
                    <p className="text-[10px] text-slate-500">Avg. Rating: {selectedReview.rating}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Customer info</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedReview.customerName}</p>
                      <p className="text-xs text-slate-500">{selectedReview.contact}</p>
                    </div>
                    <button className="text-emerald-500 hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.011 3C8.13 3 5 6.111 5 10.011c0 1.254.324 2.482.956 3.535L4 19l5.655-1.51c1.104.593 2.336.91 3.596.91 3.86 0 6.99-3.11 6.99-7.01C20.241 7.11 17.111 4 13.23 4z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Status</p>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-1 rounded border border-emerald-100">
                      {selectedReview.isPublished ? "PUBLISHED" : "NEW"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Rating</p>
                    <p className="text-xs font-medium">{selectedReview.rating} ⭐</p>
                  </div>
                </div>

                {/* Review Body */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Reviewed on {selectedReview.date}</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">"{selectedReview.comment}"</p>
                </div>

                {/* Reply Box */}
                <div className="pt-4 mt-auto">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-50 transition-all resize-none h-20"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-6 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviewTab;
