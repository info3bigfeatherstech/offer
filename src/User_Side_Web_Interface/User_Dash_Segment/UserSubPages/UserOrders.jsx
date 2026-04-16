import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserOrders,
  fetchOrderById,
  trackOrder,
  cancelOrder,
  clearOrderErrors,
  clearActiveOrder,
  selectOrders,
  selectActiveOrder,
  selectTracking,
  selectOrderLoading,
  selectOrderError,
} from "../../../components/REDUX_FEATURES/REDUX_SLICES/orderSlice/orderSlice";
import {
  Package, Truck, CheckCircle, ChevronRight, RefreshCw,
  XCircle, Clock, AlertCircle, ArrowLeft, MapPin,
  Receipt, X, Loader2, ShoppingBag,
} from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: <Clock size={11} />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: <CheckCircle size={11} />,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-700",
    icon: <RefreshCw size={11} className="animate-spin" />,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Truck size={11} />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-cyan-100 text-cyan-700",
    icon: <Truck size={11} />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={11} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    icon: <XCircle size={11} />,
  },
  payment_failed: {
    label: "Payment Failed",
    color: "bg-red-100 text-red-600",
    icon: <XCircle size={11} />,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Tracking Timeline
// ─────────────────────────────────────────────────────────────────────────────
const TrackingTimeline = ({ timeline = [] }) => (
  <div className="space-y-0">
    {timeline.map((step, i) => (
      <div key={i} className="flex gap-3">
        {/* Dot + line */}
        <div className="flex flex-col items-center">
          <div
            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1 ${
              step.completed
                ? "bg-black border-black"
                : "bg-white border-gray-200"
            }`}
          >
            {step.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          {i < timeline.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-[20px] my-1 ${step.completed ? "bg-black" : "bg-gray-200"}`} />
          )}
        </div>

        {/* Content */}
        <div className="pb-4">
          <p className={`text-xs font-black ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
            {step.status}
          </p>
          {step.timestamp && (
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {fmtDate(step.timestamp)}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Order Detail Drawer
// ─────────────────────────────────────────────────────────────────────────────
const OrderDetail = ({ orderId, onBack, onCancel, isCancelling, cancelError }) => {
  const dispatch = useDispatch();
  const order = useSelector(selectActiveOrder);
  const tracking = useSelector(selectTracking(orderId));
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  const [showTracking, setShowTracking] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    return () => dispatch(clearActiveOrder());
  }, [orderId, dispatch]);

  const handleTrack = () => {
    if (!tracking) dispatch(trackOrder(orderId));
    setShowTracking((v) => !v);
  };

  if (loading.fetchOne) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-bold">Loading order…</span>
      </div>
    );
  }

  if (error.fetchOne || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-red-500 font-bold">{error.fetchOne?.message || "Order not found"}</p>
        <button onClick={onBack} className="mt-4 text-xs font-black uppercase text-gray-400 hover:text-black cursor-pointer">
          ← Back
        </button>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed"].includes(order.orderStatus);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> All Orders
      </button>

      {/* Order header */}
      <div className="bg-white rounded-[32px] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-black text-gray-900">{order.orderId}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {fmtDate(order.createdAt)}
            </p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          {[
            { label: "Subtotal", value: fmt(order.subtotal) },
            { label: "Delivery", value: order.deliveryCharges === 0 ? "FREE" : fmt(order.deliveryCharges) },
            { label: "Tax", value: fmt(order.tax) },
            { label: "Total", value: fmt(order.totalAmount), bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
              <p className={`text-sm mt-1 ${bold ? "font-black text-gray-900" : "font-bold text-gray-700"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-[32px] p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
          Items ({order.items?.length})
        </h3>
        <div className="space-y-4">
          {order.items?.map((item, i) => {
            const image = item.productId?.images?.[0]?.url || null;
            const name = item.productId?.name || item.productId?.title || "Product";
            const price = item.priceSnapshot?.sale ?? item.priceSnapshot?.base;

            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                  {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Qty: {item.quantity} × {fmt(price)}
                  </p>
                </div>
                <p className="text-sm font-black text-gray-900">{fmt(price * item.quantity)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery address */}
      {order.addressSnapshot && (
        <div className="bg-white rounded-[32px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[#F7A221]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Delivery Address
            </h3>
          </div>
          <p className="text-sm font-black text-gray-900">{order.addressSnapshot.fullName}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {[
              order.addressSnapshot.houseNumber,
              order.addressSnapshot.area,
              order.addressSnapshot.landmark,
              order.addressSnapshot.addressLine1,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="text-xs font-bold text-gray-700 mt-0.5">
            {order.addressSnapshot.city}, {order.addressSnapshot.state} —{" "}
            {order.addressSnapshot.postalCode}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {order.addressSnapshot.phone}
          </p>
        </div>
      )}

      {/* Tracking */}
      <div className="bg-white rounded-[32px] p-6">
        <button
          onClick={handleTrack}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-[#F7A221]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">
              Track Order
            </h3>
          </div>
          {loading.track ? (
            <Loader2 size={14} className="animate-spin text-gray-400" />
          ) : (
            <ChevronRight
              size={14}
              className={`text-gray-400 transition-transform ${showTracking ? "rotate-90" : ""}`}
            />
          )}
        </button>

        {showTracking && tracking && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            {tracking.trackingNumber && (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Tracking: <span className="text-gray-700">{tracking.trackingNumber}</span>
                {tracking.courier && (
                  <span className="ml-2">via {tracking.courier}</span>
                )}
              </p>
            )}
            <TrackingTimeline timeline={tracking.timeline || []} />
          </div>
        )}
      </div>

      {/* Cancel */}
      {canCancel && (
        <div className="bg-white rounded-[32px] p-6">
          {cancelError && (
            <p className="text-xs text-red-500 font-bold mb-3">{cancelError.message}</p>
          )}

          {showCancelConfirm ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-900">
                Are you sure you want to cancel this order?
              </p>
              <p className="text-xs text-gray-500 font-medium">
                This cannot be undone. Refund (if paid online) will be initiated automatically.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-xs font-black uppercase tracking-widest hover:border-black transition-all cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => onCancel(order.orderId)}
                  disabled={isCancelling}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isCancelling ? (
                    <Loader2 size={14} className="animate-spin mx-auto" />
                  ) : (
                    "Yes, Cancel"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <XCircle size={14} /> Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UserOrders — Main Component
// ─────────────────────────────────────────────────────────────────────────────
const UserOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserOrders());
    return () => dispatch(clearOrderErrors());
  }, [dispatch]);

  const handleCancel = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      setActiveOrderId(null); // go back to list
    } catch (e) {
      // error shown in OrderDetail
    }
  };

  // ── Detail view ──────────────────────────────────────────────────────────
  if (activeOrderId) {
    return (
      <OrderDetail
        orderId={activeOrderId}
        onBack={() => setActiveOrderId(null)}
        onCancel={handleCancel}
        isCancelling={loading.cancel}
        cancelError={error.cancel}
      />
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading.fetch) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 size={28} className="text-gray-300 animate-spin" />
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
          Loading orders…
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error.fetch) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <AlertCircle size={32} className="text-red-300" />
        <p className="text-gray-500 text-sm font-medium max-w-sm">
          {error.fetch.message || "Failed to load orders"}
        </p>
        <button
          onClick={() => dispatch(fetchUserOrders())}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#F7A221] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={36} className="text-gray-200" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">
            No orders yet
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Your order history will appear here
          </p>
        </div>
        <a
          href="/"
          className="bg-black text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-[#F7A221] hover:text-black transition-all"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  // ── Order list ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Purchase History</h1>
        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">
          {orders.length} Order{orders.length !== 1 ? "s" : ""}
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;

          return (
            <button
              key={order.orderId}
              onClick={() => setActiveOrderId(order.orderId)}
              className="group w-full text-left bg-gray-50 rounded-3xl p-6 border-2 border-transparent hover:border-black hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 flex-shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900">{order.orderId}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                      {fmtDate(order.createdAt)}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={order.orderStatus} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:items-end border-t sm:border-t-0 pt-4 sm:pt-0">
                  <p className="text-xl font-black text-gray-900">{fmt(order.totalAmount)}</p>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors mt-auto">
                    View Details <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrders;

// import React from 'react';
// import { Package, Truck, CheckCircle, ChevronRight } from 'lucide-react';

// const UserOrders = () => {
//   const orders = [
//     { id: 'ORD-88291', date: 'March 15, 2026', status: 'In Transit', total: '₹2,499', items: 2 },
//     { id: 'ORD-77210', date: 'March 02, 2026', status: 'Delivered', total: '₹1,200', items: 1 },
//   ];

//   return (
//     <div className="space-y-8 animate-fadeIn">
//       <header>
//         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Purchase History</h1>
//         <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Track & Manage Orders</p>
//       </header>

//       <div className="space-y-6">
//         {orders.map((order) => (
//           <div key={order.id} className="group bg-gray-50 rounded-3xl p-6 border-2 border-transparent hover:border-black hover:bg-white transition-all duration-300">
//             <div className="flex flex-col md:flex-row justify-between gap-6">
//               <div className="flex gap-4">
//                 <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
//                    <Package size={32} />
//                 </div>
//                 <div>
//                   <h3 className="font-black text-lg text-gray-900">{order.id}</h3>
//                   <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{order.date}</p>
//                   <div className="mt-2 flex items-center gap-2">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
//                       order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-row md:flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0">
//                 <p className="text-2xl font-black text-gray-900">{order.total}</p>
//                 <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-black transition-colors">
//                   View Details <ChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserOrders;