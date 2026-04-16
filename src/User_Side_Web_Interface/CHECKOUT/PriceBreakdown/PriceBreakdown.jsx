import React from "react";
import { Tag, Truck, Receipt, ShieldCheck } from "lucide-react";

const fmt = (n) => {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

/**
 * PriceBreakdown
 *
 * Pure presentational — receives quote data and renders breakdown.
 * No Redux, no API calls.
 *
 * Props:
 *   quote           — quote object from checkoutSlice (fetchCheckoutQuote result)
 *   itemCount       — number of items in cart
 *   paymentMethod   — "cod" | "online"
 *   compact         — smaller version for sidebar/summary
 */
const PriceBreakdown = ({ quote, itemCount, paymentMethod = "cod", compact = false }) => {
  if (!quote) return null;

  const {
    itemsSubtotal,
    promotionDiscount,
    deliveryCharges,
    taxes,
    amountPayable,
    couponApplied,
    deliveryEstimate,
    codAvailable,
  } = quote;

  const rows = [
    {
      label: `Item Total${itemCount ? ` (${itemCount} item${itemCount > 1 ? "s" : ""})` : ""}`,
      value: fmt(itemsSubtotal),
      icon: null,
    },
    {
      label: "Delivery Charges",
      value: deliveryCharges === 0 ? (
        <span className="text-green-600 font-black">FREE</span>
      ) : fmt(deliveryCharges),
      icon: <Truck size={12} className="text-gray-400" />,
    },
    ...(promotionDiscount > 0
      ? [{
          label: `Discount${couponApplied ? ` (${couponApplied})` : ""}`,
          value: <span className="text-green-600">- {fmt(promotionDiscount)}</span>,
          icon: <Tag size={12} className="text-green-500" />,
        }]
      : []),
    {
      label: "Taxes (GST)",
      value: fmt(taxes),
      icon: <Receipt size={12} className="text-gray-400" />,
    },
  ];

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {/* Line items */}
      {rows.map((row, i) => (
        <div key={i} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {row.icon}
            <span className={`text-gray-500 font-medium ${compact ? "text-xs" : "text-sm"}`}>
              {row.label}
            </span>
          </div>
          <span className={`font-bold text-gray-800 ${compact ? "text-xs" : "text-sm"}`}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className={`font-black text-gray-900 ${compact ? "text-sm" : "text-base"}`}>
            Total Payable
          </span>
          <span className={`font-black text-gray-900 ${compact ? "text-sm" : "text-xl"}`}>
            {fmt(amountPayable)}
          </span>
        </div>

        {paymentMethod === "cod" && (
          <p className="text-[10px] font-bold text-gray-400 mt-1 text-right uppercase tracking-widest">
            Cash on Delivery
          </p>
        )}
      </div>

      {/* Delivery estimate */}
      {deliveryEstimate && (
        <div className="bg-green-50 border border-green-100 rounded-2xl px-3 py-2.5 flex items-center gap-2">
          <Truck size={13} className="text-green-500 flex-shrink-0" />
          <p className="text-[11px] text-green-700 font-bold">{deliveryEstimate}</p>
        </div>
      )}

      {/* COD warning */}
      {paymentMethod === "cod" && codAvailable === false && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5">
          <p className="text-[11px] text-red-600 font-bold">
            COD not available for this pincode. Please choose online payment.
          </p>
        </div>
      )}

      {/* Trust badge */}
      {!compact && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={12} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 font-bold">100% Secure Checkout</span>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;