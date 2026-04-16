import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Eye, Fingerprint } from 'lucide-react';
import LOGO from "../../../../assets/logo2.png";

const UserTab = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] p-6 font-sans relative overflow-hidden">
      {/* Subtle Background Detail */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,162,33,0.05),transparent)] pointer-events-none" />
      
      {/* Security Scanlines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(247,162,33,0.02)_0px,rgba(247,162,33,0.02)_1px,transparent_1px,transparent_2px)] pointer-events-none" />

      {/* VERTICAL CARD */}
      <div className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#f7a221]/30 hover:shadow-[0_0_50px_rgba(247,162,33,0.1)]">
        
        {/* Top Border Accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#f7a221] to-transparent" />

        {/* Logo Section */}
        <div className="pt-8 pb-4 flex justify-center border-b border-[#1f1f1f]">
          {/* <img src={LOGO} alt="logo" className="h-7 brightness-110 hover:brightness-150 transition-all duration-300" /> */}
        </div>

        {/* Icon Section */}
        <div className="py-6 flex justify-center">
          <div className="bg-[#f7a221]/10 p-4 rounded-full border border-[#f7a221]/20 group-hover:scale-110 transition-all">
            <ShieldCheck className="text-[#f7a221]" size={48} />
          </div>
        </div>

        {/* Message Content */}
        <div className="px-8 pb-6 text-center">
          <h2 className="text-white text-xl font-bold tracking-tight uppercase mb-3">
            Restricted <span className="text-[#f7a221]">Access</span>
          </h2>
          
          <div className="h-px w-12 bg-[#f7a221]/30 mx-auto my-4" />
          
          <p className="text-gray-400 text-sm leading-relaxed">
            You've reached a secure area reserved for administration. 
            For your security, please return to the public area of the platform.
          </p>
          
          <div className="mt-4 p-3 bg-black/40 rounded-lg border border-[#f7a221]/10">
            <p className="text-gray-200 text-[10px] font-mono">
              {`>_ Session logged: ${new Date().toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="px-8 pb-4 flex justify-center gap-4">
          <div className="flex items-center gap-1 text-[9px] text-white uppercase tracking-wider">
            <Eye size={10} />
            <span>Monitored</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white uppercase tracking-wider">
            <Fingerprint size={10} />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white uppercase tracking-wider">
            <Lock size={10} />
            <span>Encrypted</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 pb-8">
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#f7a221] hover:bg-[#f7a221]/90 text-black font-bold py-3 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(247,162,33,0.15)] hover:shadow-[0_6px_25px_rgba(247,162,33,0.25)]"
          >
            <ArrowLeft size={16} />
            Return to Homepage
          </button>
        </div>

        {/* Footer Note */}
        <div className="pb-6 text-center">
          <p className="text-[8px] text-gray-100 uppercase tracking-[0.2em] font-bold">
            Encrypted Session Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTab;