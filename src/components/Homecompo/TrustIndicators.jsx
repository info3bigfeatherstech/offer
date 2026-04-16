import React, { useState, useEffect, useRef } from 'react';
import { Truck, RefreshCw, ShieldCheck, Star } from 'lucide-react';

const TrustIndicators = () => {
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef(null);

    const indicators = [
        { 
            icon: <Truck size={24} />, 
            title: "Free Shipping", 
            subtitle: "Over ₹999",
            animClass: "anim-truck"
        },
        { 
            icon: <RefreshCw size={24} />, 
            title: "7 Days Return", 
            subtitle: "Easy refund",
            animClass: "anim-refresh"
        },
        { 
            icon: <ShieldCheck size={24} />, 
            title: "100% Secure", 
            subtitle: "Safe payment",
            animClass: "anim-shield"
        },
        { 
            icon: <Star size={24} />, 
            title: "Premium", 
            subtitle: "Top Quality",
            animClass: "anim-star"
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="px-4 py-8 md:py-12">
            {/* INJECTED ANIMATIONS - No layout changes here */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes truck-drive {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
                @keyframes refresh-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes shield-glow {
                    0%, 100% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.2); filter: brightness(1.2); }
                }
                @keyframes star-pop {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }

                .indicator-card:hover .anim-truck { animation: truck-drive 0.8s ease-in-out infinite; }
                .indicator-card:hover .anim-refresh { animation: refresh-spin 0.6s linear infinite; }
                .indicator-card:hover .anim-shield { animation: shield-glow 0.8s ease-in-out infinite; }
                .indicator-card:hover .anim-star { animation: star-pop 0.5s ease-in-out infinite; }
            `}} />

            <section
                ref={sectionRef}
                className={`container mx-auto bg-[#0a0a0a] p-6 sm:p-10 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 md:gap-8 transition-all duration-700 ease-out ${
                    isInView 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                }`}
            >
                {indicators.map((item, idx) => (
                    <div
                        key={idx}
                        className={`indicator-card group flex flex-col items-center text-center space-y-3 md:space-y-4 transition-all duration-500 ${
                            isInView 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-90'
                        }`}
                        style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                        {/* ICON CONTAINER - Restored to exact original size and rounding */}
                        <div className="relative p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 group-hover:border-[#f7a221]/50 group-hover:bg-[#f7a221] group-hover:text-black text-[#f7a221] transition-all duration-500 shadow-2xl overflow-hidden">
                            <div className={`relative z-10 transition-transform duration-300 ${item.animClass}`}>
                                {item.icon}
                            </div>
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-[#f7a221]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="font-black text-white text-[12px] md:text-base uppercase tracking-tight md:tracking-tighter">
                                {item.title}
                            </h4>
                            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">
                                {item.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default TrustIndicators;
