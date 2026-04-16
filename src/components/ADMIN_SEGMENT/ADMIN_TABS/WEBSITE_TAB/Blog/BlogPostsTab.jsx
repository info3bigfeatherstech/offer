import React, { useState } from 'react';

const BLOG_DATA = [
  // Example entry - structure for when you populate this from your backend
  { id: 1, name: "Summer Fashion Trends 2026", created: "Apr 08, 2026", updated: "Apr 10, 2026" }
];

const BlogPostsTab = () => {
  const [activeTab, setActiveTab] = useState('Published');

  const tabs = [
    { label: "Published", count: 0 },
    { label: "Scheduled", count: 0 },
    { label: "Draft", count: 0 },
    { label: "Trash", count: 4 },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Blog posts</h1>
          <button className="bg-[#2563eb] cursor-pointer text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Write a new post
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4">
          <div className="p-2 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-2 px-4 cursor-pointer py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.label 
                    ? "bg-blue-50 text-blue-600  border-blue-100" 
                    : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    activeTab === tab.label ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg">
              Sort ⇅
            </button>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Created on</th>
                  <th className="px-6 py-4">Last updated on</th>
                </tr>
              </thead>
              <tbody>
                {BLOG_DATA.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 2v4h4" /></svg>
                        <p className="text-xs font-medium">No posts found in {activeTab}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  BLOG_DATA.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{post.name}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{post.created}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{post.updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-[#F8FAFC]/50 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2">
              <select className="bg-white border border-slate-200 text-xs font-semibold px-2 py-1 rounded-md outline-none">
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-[11px] font-medium text-slate-400">Posts per page</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-7 h-7 bg-slate-900 text-white rounded text-xs font-bold">1</button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsTab;