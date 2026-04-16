import React from 'react';
import { 
  Search, FileCheck, TextCursorInput, 
  Package, Scale, QrCode, MessageCircle, 
  Eraser, FileSearch, Calculator, Globe, 
  Store, LayoutDashboard, ArrowLeft
} from 'lucide-react';

const UtilitiesTab = () => {
  const latestReleases = [
    { title: "Trademark Registration", icon: () => <span className="font-bold text-xl">TM</span>, color: "bg-[#1e1b4b]" },
    { title: "GST Registration", icon: () => <div className="border-2 border-white/30 rounded px-1 py-0.5 text-[10px] font-bold">Register</div>, color: "bg-[#1e3a8a]" },
    { title: "Brand Name Generator", icon: () => <div className="border border-white/40 p-1 flex flex-col items-center"><div className="w-4 h-1 bg-white/40 mb-1"></div><span className="text-[8px] scale-75">Business</span></div>, color: "bg-[#3b82f6]" },
    { title: "Shipmozo", icon: Package, color: "bg-[#1e1b4b]" },
  ];

  const categories = [
    {
      name: "MARKETING & BRANDING",
      tools: [
        { title: "Talk to Lawyer", icon: Scale },
        { title: "Website QR Code", icon: QrCode, color: "text-blue-500" },
        { title: "WhatsApp Business", icon: MessageCircle, color: "text-green-500" },
        { title: "Shipmozo", icon: Package, color: "text-blue-900" },
        { title: "Brand Name Generator", icon: TextCursorInput, color: "text-blue-400" },
        { title: "Background Remover", icon: Eraser, color: "text-yellow-600" },
      ]
    },
    {
      name: "FINANCE",
      tools: [
        { title: "GST Registration", icon: () => <div className="border border-slate-400 rounded px-1 text-[10px] font-bold">Register</div> },
        { title: "GST Number Search", icon: () => <div className="border border-slate-400 rounded px-1 text-[10px] font-bold uppercase">Gst</div> },
        { title: "HSN Search", icon: () => <div className="border border-slate-400 rounded px-1 text-[10px] font-bold uppercase">Hsn</div> },
        { title: "EMI Calculator", icon: Calculator },
      ]
    },
    {
      name: "MORE",
      tools: [
        { title: "Trademark Registration", icon: () => <span className="font-bold text-lg border border-slate-900 rounded-full w-8 h-8 flex items-center justify-center">TM</span> },
        { title: "Website Performance Check", icon: Globe },
        { title: "Restaurant POS", icon: () => <span className="font-bold tracking-tighter">P <span className="text-[10px]">●</span> S</span> },
        { title: "Get Shopify Website", icon: Store, color: "text-green-600" },
      ]
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <ArrowLeft className="w-5 h-5 cursor-pointer text-slate-800" />
            <h1 className="text-xl font-semibold text-slate-900">Utilities</h1>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search tools" 
              className="pl-10 pr-4 py-2.5 bg-[#f3f4f6] border-none rounded-xl w-64 md:w-96 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          
          {/* LATEST RELEASES */}
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-10">
              <h2 className="text-[11px] font-bold text-slate-900 tracking-[0.15em] uppercase">Latest Releases</h2>
              <span className="bg-[#4f46e5] text-white text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-tight">New</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
              {latestReleases.map((tool, idx) => (
                <div key={idx} className="flex flex-col items-center group cursor-pointer">
                  <div className={`${tool.color} w-16 h-16 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-blue-900/10 group-hover:-translate-y-1 transition-all duration-300`}>
                    <tool.icon size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-700 mt-4 text-center leading-tight max-w-[80px]">
                    {tool.title}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CATEGORIES */}
          {categories.map((cat, idx) => (
            <section key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h2 className="text-[11px] font-bold text-slate-400 tracking-[0.15em] mb-10 uppercase">{cat.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-12 gap-x-6">
                {cat.tools.map((tool, tIdx) => (
                  <div key={tIdx} className="flex flex-col items-center group cursor-pointer transition-transform">
                    <div className={`w-14 h-14 flex items-center justify-center ${tool.color || 'text-slate-800'} group-hover:scale-110 transition-transform duration-200`}>
                      <tool.icon size={32} strokeWidth={1.2} />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600 mt-4 text-center leading-tight max-w-[90px]">
                      {tool.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UtilitiesTab;