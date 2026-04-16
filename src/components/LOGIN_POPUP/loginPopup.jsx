import React, { useState, useRef } from 'react';
import { X, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import LOGO from '../../assets/logo.jpg';

const loginPopup = ({ isOpen, onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isError, setIsError] = useState(false);
    const modalRef = useRef();

    if (!isOpen) return null;

    // Regex for Indian Mobile Numbers (Starts with 6-9, followed by 9 digits)
    const mobileRegex = /^[6-9]\d{9}$/;

    const handleSignIn = (e) => {
        e.preventDefault();
        if (mobileRegex.test(mobileNumber)) {
            console.log("Valid Number:", mobileNumber);
            // Proceed to API call here
            setIsError(false);
        } else {
            // Trigger Shake Effect
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
        }
    };

    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <>
            <style>
                {`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
                `}
            </style>

            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
                onClick={handleBackdropClick}
            >
                <div 
                    ref={modalRef}
                    className={`relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300 ${isError ? 'animate-shake' : ''}`}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    {/* LEFT SIDE: Brand & Value Points */}
                    <div className="relative flex-1 p-8 md:p-12 bg-gradient-to-br from-[#1a1a1a] to-[#000000] flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#f7a221]/10 blur-[80px] rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <img 
                                    src={LOGO} 
                                    alt="Logo" 
                                    className="h-10 md:h-12 w-auto object-contain rounded-lg shadow-lg border border-white/5" 
                                />
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                    OFFERWALE<span className="text-[#f7a221]">BABA</span>
                                </h2>
                            </div>

                            <h3 className="text-lg md:text-xl text-gray-300 mb-8 font-medium leading-tight">
                                Join the club for <span className="text-white font-bold underline decoration-[#f7a221] decoration-2">exclusive wholesale</span> rates.
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { icon: <Zap size={18} />, title: "Lowest Price Guaranteed", desc: "Unbeatable wholesale rates" },
                                    { icon: <ShieldCheck size={18} />, title: "100% Secure Checkout", desc: "Encrypted & Spam-free" },
                                    { icon: <Sparkles size={18} />, title: "Priority Shipping", desc: "Faster delivery for members" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 group">
                                        <div className="p-2.5 rounded-lg bg-[#f7a221]/10 text-[#f7a221] border border-[#f7a221]/20">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase tracking-wide">{item.title}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Login Form */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#0d0d0d]">
                        <div className="max-w-sm mx-auto w-full">
                            <div className="text-center md:text-left mb-8">
                                <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Unlock Deals</h4>
                                <p className="text-gray-400 text-sm">Enter mobile number for instant access.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSignIn}>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className={`text-sm font-bold border-r border-white/10 pr-3 transition-colors ${mobileNumber.length === 10 ? 'text-[#f7a221]' : 'text-gray-600'}`}>+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        maxLength="10"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                        className={`w-full bg-white/[0.03] border rounded-xl py-4 pl-16 pr-4 text-white placeholder:text-gray-700 transition-all focus:outline-none ${isError ? 'border-red-500' : 'border-white/10 focus:border-[#f7a221]/50'}`}
                                        placeholder="00000 00000"
                                    />
                                </div>

                                <div className="flex items-center gap-3 px-1">
                                    <input type="checkbox" id="notify" className="accent-[#f7a221] w-4 h-4 rounded cursor-pointer" defaultChecked />
                                    <label htmlFor="notify" className="text-gray-500 text-[10px] md:text-xs cursor-pointer">
                                        Notify me for crazy deals and price drops
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={mobileNumber.length < 10}
                                    className={`group relative w-full font-black py-4 rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all shadow-[0_10px_20px_rgba(247,162,33,0.2)] uppercase
                                        ${mobileNumber.length === 10 
                                            ? 'bg-[#f7a221] text-black hover:scale-[1.02] active:scale-[0.98]' 
                                            : 'bg-[#f7a221] text-black cursor-not-allowed'}`}
                                >
                                    {mobileNumber.length === 10 && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                                    )}
                                    SIGN IN NOW <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-[#f7a221] text-xs font-bold italic mb-2 tracking-wide">
                                    "Loot Machao, Paise Bachao!"
                                </p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                    Secure Login • OfferwaleBaba
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default loginPopup;

// import React, { useState, useRef } from 'react';
// import { X, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
// import LOGO from '../../assets/logo.jpg';

// const loginPopup = ({ isOpen, onClose }) => {
//     const [mobileNumber, setMobileNumber] = useState('');
//     const modalRef = useRef();

//     if (!isOpen) return null;

//     // Handle click outside to close
//     const handleBackdropClick = (e) => {
//         if (modalRef.current && !modalRef.current.contains(e.target)) {
//             onClose();
//         }
//     };

//     return (
//         <div 
//             className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
//             onClick={handleBackdropClick}
//         >
//             {/* Main Container */}
//             <div 
//                 ref={modalRef}
//                 className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300"
//             >

//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full"
//                 >
//                     <X size={20} />
//                 </button>

//                 {/* LEFT SIDE: Brand & Value Points */}
//                 <div className="relative flex-1 p-8 md:p-12 bg-gradient-to-br from-[#1a1a1a] to-[#000000] flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
//                     {/* Glow Effect */}
//                     <div className="absolute top-0 left-0 w-32 h-32 bg-[#f7a221]/10 blur-[80px] rounded-full"></div>

//                     <div className="relative z-10">
//                         {/* LOGO & BRAND SECTION */}
//                         <div className="flex items-center gap-3 mb-8">
//                             <img 
//                                 src={LOGO} 
//                                 alt="OfferWaleBaba Logo" 
//                                 className="h-10 md:h-12 w-auto object-contain flex-shrink-0 rounded-lg shadow-lg border border-white/5" 
//                             />
//                             <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">
//                                 OFFERWALE<span className="text-[#f7a221]">BABA</span>
//                             </h2>
//                         </div>

//                         <h3 className="text-lg md:text-xl text-gray-300 mb-8 font-medium leading-tight">
//                             Join the club for <span className="text-white font-bold underline decoration-[#f7a221] decoration-2">exclusive wholesale</span> rates.
//                         </h3>

//                         {/* VALUE PROPS */}
//                         <div className="space-y-6">
//                             {[
//                                 { icon: <Zap size={18} />, title: "Lowest Price Guaranteed", desc: "Unbeatable wholesale rates" },
//                                 { icon: <ShieldCheck size={18} />, title: "100% Secure Checkout", desc: "Encrypted & Spam-free" },
//                                 { icon: <Sparkles size={18} />, title: "Priority Shipping", desc: "Faster delivery for members" }
//                             ].map((item, i) => (
//                                 <div key={i} className="flex items-start gap-4 group">
//                                     <div className="p-2.5 rounded-lg bg-[#f7a221]/10 text-[#f7a221] border border-[#f7a221]/20 group-hover:bg-[#f7a221]/20 transition-colors">
//                                         {item.icon}
//                                     </div>
//                                     <div>
//                                         <p className="text-white font-bold text-sm uppercase tracking-wide">{item.title}</p>
//                                         <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT SIDE: Login Form */}
//                 <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#0d0d0d]">
//                     <div className="max-w-sm mx-auto w-full">
//                         <div className="text-center md:text-left mb-8">
//                             <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Unlock Deals</h4>
//                             <p className="text-gray-400 text-sm">Enter mobile number for instant access.</p>
//                         </div>

//                         <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//                             <div className="relative group">
//                                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                     <span className="text-sm font-bold text-[#f7a221] border-r border-white/10 pr-3">+91</span>
//                                 </div>
//                                 <input
//                                     type="tel"
//                                     maxLength="10"
//                                     value={mobileNumber}
//                                     onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
//                                     className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-16 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#f7a221]/50 focus:bg-white/[0.07] transition-all"
//                                     placeholder="Enter Mobile Number"
//                                 />
//                             </div>

//                             <div className="flex items-center gap-3 px-1">
//                                 <input
//                                     type="checkbox"
//                                     id="notify"
//                                     className="accent-[#f7a221] w-4 h-4 rounded cursor-pointer"
//                                     defaultChecked
//                                 />
//                                 <label htmlFor="notify" className="text-gray-500 text-[10px] md:text-xs cursor-pointer select-none">
//                                     Notify me for crazy deals and price drops
//                                 </label>
//                             </div>

//                             <button className="group relative w-full bg-[#f7a221] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(247,162,33,0.2)] uppercase">
//                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
//                                 SIGN IN NOW <ArrowRight size={18} />
//                             </button>
//                         </form>

//                         <div className="mt-8 pt-8 border-t border-white/5 text-center">
//                             <p className="text-[#f7a221] text-xs font-bold italic mb-2">
//                                 "Loot Machao, Paise Bachao!"
//                             </p>
//                             <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
//                                 Secure Login • OfferwaleBaba
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default loginPopup;

// import React, { useState } from 'react';
// import { X, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

// const loginPopup = ({ isOpen, onClose }) => {
//   const [mobileNumber, setMobileNumber] = useState('');

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
//       {/* Main Container */}
//       <div className="relative w-full max-w-[850px] bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
        
//         {/* Close Button */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 p-1.5 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"
//         >
//           <X size={18} />
//         </button>

//         {/* LEFT SIDE: Clean Branding */}
//         <div className="hidden md:flex flex-1 p-10 bg-gradient-to-br from-[#111] to-[#000] flex-col justify-between border-r border-white/5">
//           <div>
//             <div className="flex items-center gap-3 mb-8">
//               <span className="w-1.5 h-8 bg-[#f7a221] rounded-full shadow-[0_0_15px_rgba(247,162,33,0.4)]"></span>
//               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
//                 OFFERWALE<span className="text-[#f7a221]">BABA</span>
//               </h2>
//             </div>
            
//             <h3 className="text-xl text-white font-bold leading-tight mb-4">
//               Unlock the Baba's <br />
//               <span className="text-[#f7a221]">Secret Loot Deals</span>
//             </h3>
            
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 text-gray-400">
//                 <Zap size={16} className="text-[#f7a221]" />
//                 <span className="text-sm">Lowest wholesale prices in India</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-400">
//                 <ShieldCheck size={16} className="text-[#f7a221]" />
//                 <span className="text-sm">Verified & Secure Checkout</span>
//               </div>
//             </div>
//           </div>

//           <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
//             Premium Access • Version 2.0
//           </p>
//         </div>

//         {/* RIGHT SIDE: Focus Form */}
//         <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
//           {/* Mobile Logo Only */}
//           <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
//             <span className="w-1 h-6 bg-[#f7a221] rounded-full"></span>
//             <h2 className="text-xl font-black text-white uppercase tracking-tighter">
//               OFFERWALE<span className="text-[#f7a221]">BABA</span>
//             </h2>
//           </div>

//           <div className="max-w-sm mx-auto w-full">
//             <div className="text-center md:text-left mb-8">
//               <h4 className="text-xl font-bold text-white mb-2">Welcome Back!</h4>
//               <p className="text-gray-500 text-sm">Enter mobile number to view deals</p>
//             </div>

//             <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-white/10 my-3">
//                   <span className="text-sm font-bold text-[#f7a221] pr-3">+91</span>
//                 </div>
//                 <input
//                   type="tel"
//                   maxLength="10"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
//                   className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-16 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#f7a221]/40 focus:bg-white/[0.05] transition-all"
//                   placeholder="00000-00000"
//                 />
//               </div>

//               <button className="group relative w-full bg-[#f7a221] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 overflow-hidden hover:brightness-110 active:scale-[0.98] transition-all">
//                 CONTINUE <ArrowRight size={18} />
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-500"></div>
//               </button>
//             </form>

//             <p className="mt-8 text-[10px] text-center text-gray-600 leading-relaxed">
//               By logging in, you agree to receive <span className="text-gray-400">OfferwaleBaba</span> updates.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default loginPopup;