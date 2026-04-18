

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ChevronRight, ChevronLeft, Loader2, MapPin,
  CreditCard, Truck, CheckCircle2, Package,
  AlertCircle, ArrowLeft, ShoppingBag, Banknote,
  X, Clock,
} from "lucide-react";

// Redux — checkout
import {
  fetchCheckoutQuote,
  confirmCheckoutQuote,
  placeOrder,
  setSelectedAddress,
  setPaymentMethod,
  setPaymentPlan,
  resetCheckout,
  resetQuote ,
  clearCheckoutErrors,
  selectQuote,
  selectQuoteId,
  selectConfirmed,
  selectPlacedOrder,
  selectSelectedAddressId,
  selectPaymentMethod,
  selectPaymentPlan,
  selectCheckoutLoading,
  selectCheckoutError,
  getRazorpayKey,
  selectRazorpayKey,
  selectRazorpayKeyLoading,
  selectRazorpayKeyError,
  verifyRazorpayPayment,
  selectPaymentVerification,
  resetPaymentVerification,
} from "../../components/REDUX_FEATURES/REDUX_SLICES/checkoutSlice/checkoutSlice";

// Redux — address
import {
  selectDefaultAddress,
  selectOtherAddresses,
} from "../../components/REDUX_FEATURES/REDUX_SLICES/Useraddressslice";

// Redux — cart
import {
  selectCartItems,
  selectDisplayCartCount,
  selectCartTotalAmount,
} from "../../components/REDUX_FEATURES/REDUX_SLICES/userCartSlice";

// Redux — auth
import { selectUser } from "../../components/REDUX_FEATURES/REDUX_SLICES/authSlice";

// Components
import AddressSelector from "./AddressSelector/AddressSelector";
import PriceBreakdown from "./PriceBreakdown/PriceBreakdown";
import AddressFormModal from "../User_Dash_Segment/UserSubPages/UserAddress";
import RazorpayCheckout, { PaymentErrorModal, PaymentLoadingModal } from "./RazorpayCheckout/RazorpayCheckout";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// ─────────────────────────────────────────────────────────────────────────────
// Order Success Screen
// ─────────────────────────────────────────────────────────────────────────────
const OrderSuccess = ({ order, onViewOrders }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={48} className="text-green-500" />
      </div>
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
        <p className="text-gray-500 font-medium mt-2">
          {order.paymentMethod === "cod" 
            ? "We've received your order and will process it shortly."
            : "Payment successful! Your order has been confirmed."}
        </p>
      </div>
      <div className="bg-gray-50 rounded-[28px] p-6 text-left space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID</span>
          <span className="text-sm font-black text-gray-900">{order.orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">
            {order.paymentMethod === "cod" ? "Total Amount" : "Amount Paid"}
          </span>
          <span className="text-sm font-black text-gray-900">{fmt(order.totalAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Payment</span>
          <span className="text-sm font-black text-gray-900 uppercase">
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Status</span>
          <span className="text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            {order.orderStatus === "confirmed" ? "Confirmed" : order.orderStatus}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onViewOrders}
          className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
        >
          View Orders
        </button>
        <a
          href="/"
          className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all text-center cursor-pointer"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Checkout — Main Page
// ─────────────────────────────────────────────────────────────────────────────
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const quote = useSelector(selectQuote);
  const quoteId = useSelector(selectQuoteId);
  const confirmed = useSelector(selectConfirmed);
  const placedOrder = useSelector(selectPlacedOrder);
  const selectedAddressId = useSelector(selectSelectedAddressId);
  const paymentMethod = useSelector(selectPaymentMethod);
  const paymentPlan = useSelector(selectPaymentPlan);
  const loading = useSelector(selectCheckoutLoading);
  const error = useSelector(selectCheckoutError);
  const razorpayKey = useSelector(selectRazorpayKey);
  const razorpayKeyLoading = useSelector(selectRazorpayKeyLoading);
  const razorpayKeyError = useSelector(selectRazorpayKeyError);
  const paymentVerification = useSelector(selectPaymentVerification);

  const defaultAddr = useSelector(selectDefaultAddress);
  const otherAddrs = useSelector(selectOtherAddresses);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectDisplayCartCount);
  const user = useSelector(selectUser);

  // Local state
  const [step, setStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayOrderData, setRazorpayOrderData] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const allAddresses = [
    ...(defaultAddr ? [defaultAddr] : []),
    ...otherAddrs,
  ];
  const selectedAddress = allAddresses.find((a) => a._id === selectedAddressId);

  // Fetch Razorpay key when online payment is selected
  useEffect(() => {
    if (paymentMethod === "online" && !razorpayKey && !razorpayKeyLoading && !razorpayKeyError) {
      dispatch(getRazorpayKey());
    }
  }, [paymentMethod, razorpayKey, razorpayKeyLoading, razorpayKeyError, dispatch]);

  // Guard: redirect to cart if cart is empty
  useEffect(() => {
    if (!loading.quote && cartItems.length === 0 && !placedOrder) {
      navigate("/", { replace: true });
    }
  }, [cartItems.length, placedOrder, loading.quote, navigate]);

  // Fetch quote when selected address changes and we're on step 2
  useEffect(() => {
    if (step === 2 && selectedAddressId && !quote && !loading.quote) {
      handleFetchQuote();
    }
  }, [step, selectedAddressId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCheckoutErrors());
      dispatch(resetPaymentVerification());
    };
  }, [dispatch]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFetchQuote = async () => {
    if (!selectedAddressId) return;
    try {
      await dispatch(
        fetchCheckoutQuote({
          addressId: selectedAddressId,
          paymentMethodHint: paymentMethod,
        })
      ).unwrap();
    } catch (e) {
      toast.error(e?.message || "Could not get delivery quote", { theme: "dark" });
    }
  };

  const handleStep1Next = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address", { theme: "dark" });
      return;
    }
    setStep(2);
    if (!quote) {
      dispatch(
        fetchCheckoutQuote({
          addressId: selectedAddressId,
          paymentMethodHint: paymentMethod,
        })
      );
    }
  };

  const handlePaymentMethodSelect = (method) => {
    dispatch(setPaymentMethod(method));
    if (method === "online") {
      // Reset payment plan to full when switching to online
      dispatch(setPaymentPlan("full"));
    }
    // Re-fetch quote for the new payment method
    if (quote && selectedAddressId) {
      dispatch(resetQuote());
      dispatch(setSelectedAddress(selectedAddressId));
      dispatch(
        fetchCheckoutQuote({
          addressId: selectedAddressId,
          paymentMethodHint: method,
        })
      );
    }
  };

  const handlePaymentPlanSelect = (plan) => {
    dispatch(setPaymentPlan(plan));
    // Re-fetch quote for the new payment plan (affects totals for advance)
    if (quote && selectedAddressId) {
      dispatch(resetQuote());
      dispatch(setSelectedAddress(selectedAddressId));
      dispatch(
        fetchCheckoutQuote({
          addressId: selectedAddressId,
          paymentMethodHint: paymentMethod,
        })
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!quoteId || !selectedAddressId) {
      toast.error("Missing quote or address. Please refresh the page.", { theme: "dark" });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Step 1: Confirm the quote
      const confirmResult = await dispatch(
        confirmCheckoutQuote({
          quoteId,
          paymentMethod,
          paymentPlan,
        })
      ).unwrap();

      // Step 2: Create order
      const orderResult = await dispatch(
        placeOrder({
          addressId: selectedAddressId,
          paymentMethod,
          quoteId: confirmResult.quoteId || quoteId,
          onlinePaymentMode: paymentPlan,
        })
      ).unwrap();

      // Step 3: Handle based on payment method
      if (paymentMethod === "cod") {
        toast.success("🎉 Order placed successfully!", { theme: "dark", autoClose: 3000 });
        // Wait a bit before redirecting so user sees success
        setTimeout(() => {
          dispatch(resetCheckout());
          navigate("/account/userorders");
        }, 1500);
      } else if (paymentMethod === "online") {
        // Check if we have razorpay order data
        if (!orderResult.razorpayOrder) {
          throw new Error(orderResult.razorpayErrorDetail?.description || "Failed to initiate payment. Please try again.");
        }
        
        // Check if razorpay key is available
        if (!razorpayKey && !razorpayKeyLoading) {
          await dispatch(getRazorpayKey()).unwrap();
        }
        
        if (!razorpayKey && razorpayKeyError) {
          throw new Error("Payment gateway not configured. Please contact support or try COD.");
        }
        
        setRazorpayOrderData(orderResult.razorpayOrder);
        setShowRazorpay(true);
      }
    } catch (e) {
      const errorMessage = e?.message || "Failed to place order";
      
      // Handle specific error cases
      if (e?.code === "QUOTE_STALE") {
        toast.info("Prices updated — please review and confirm", { theme: "dark" });
        dispatch(fetchCheckoutQuote({ addressId: selectedAddressId, paymentMethodHint: paymentMethod }));
      } else if (e?.code === "MISSING_RAZORPAY_ENV") {
        toast.error("Payment not configured. Please use COD for now.", { theme: "dark" });
      } else {
        toast.error(errorMessage, { theme: "dark" });
      }
      
      setPaymentError(errorMessage);
      setShowPaymentErrorModal(true);
    } finally {
      setIsPlacingOrder(false);
    }
  };

const handleRazorpaySuccess = async (response) => {
  // Razorpay modal is already closed by the component
  // Show loading modal while verifying
  setShowRazorpay(false);
  
  try {
    // Get the orderId from placedOrder or from the response notes
    const currentOrderId = placedOrder?.order?.orderId || response.notes?.orderId;
    
    if (!currentOrderId) {
      throw new Error("Order ID not found. Please contact support.");
    }
    
    // Verify payment on backend
    await dispatch(
      verifyRazorpayPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: currentOrderId,
      })
    ).unwrap();
    
    toast.success("🎉 Payment successful! Order confirmed.", { theme: "dark", autoClose: 3000 });
    
    // Clear checkout state and redirect to orders page
    setTimeout(() => {
      dispatch(resetCheckout());
      navigate("/account/userorders");
    }, 1500);
  } catch (err) {
    console.error("Payment verification failed:", err);
    setPaymentError(err?.message || "Payment verification failed. Please contact support.");
    setShowPaymentErrorModal(true);
  }
};

  const handleRazorpayFailure = (error) => {
    setShowRazorpay(false);
    setPaymentError(error || "Payment failed. Please try again.");
    setShowPaymentErrorModal(true);
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
    toast.info("Payment cancelled. You can try again or choose COD.", { theme: "dark" });
  };

  const handleRetryPayment = () => {
    setShowPaymentErrorModal(false);
    setPaymentError(null);
    // Retry the order placement
    handlePlaceOrder();
  };

  // ── Order placed — show success screen ───────────────────────────────────
  if (placedOrder?.order && paymentMethod === "cod" && !paymentVerification.loading) {
    return (
      <OrderSuccess
        order={{ ...placedOrder.order, paymentMethod: placedOrder.paymentMethod }}
        onViewOrders={() => {
          dispatch(resetCheckout());
          navigate("/account/userorders");
        }}
      />
    );
  }

  // For online orders, show success only after verification
  if (placedOrder?.order && paymentMethod === "online" && paymentVerification.success) {
    return (
      <OrderSuccess
        order={{ ...placedOrder.order, paymentMethod: placedOrder.paymentMethod }}
        onViewOrders={() => {
          dispatch(resetCheckout());
          navigate("/account/userorders");
        }}
      />
    );
  }

  // Calculate advance amount for display
  const advanceAmount = quote?.amountPayable ? Math.round(quote.amountPayable * 25 / 100) : 0;

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => step === 1 ? navigate(-1) : setStep(1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              {step === 1 ? "Back to Cart" : "Back"}
            </span>
          </button>

          <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">
            Checkout
          </h1>

          <div className="flex items-center gap-2">
            {[
              { n: 1, label: "Address" },
              { n: 2, label: "Payment" },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    step >= n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > n ? "✓" : n}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                  step >= n ? "text-gray-900" : "text-gray-400"
                }`}>
                  {label}
                </span>
                {n < 2 && <ChevronRight size={12} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* ── Left Panel ── */}
          <div className="space-y-6">

            {/* Global error */}
            {(error.quote || error.confirm || error.placeOrder) && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-4">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-700">
                    {error.placeOrder?.message ||
                      error.confirm?.message ||
                      error.quote?.message}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(clearCheckoutErrors())}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ── Step 1: Address ── */}
            {step === 1 && (
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">1</div>
                  <h2 className="text-lg font-black text-gray-900">Delivery Address</h2>
                </div>

                <AddressSelector
                  onAddAddress={() => setShowAddressModal(true)}
                />

                <button
                  onClick={handleStep1Next}
                  disabled={!selectedAddressId}
                  className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">2</div>
                  <h2 className="text-lg font-black text-gray-900">Payment Method</h2>
                </div>

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <MapPin size={14} className="text-[#F7A221] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Delivering to
                      </p>
                      <p className="text-sm font-black text-gray-900">{selectedAddress.fullName}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                        {[selectedAddress.houseNumber, selectedAddress.area, selectedAddress.city]
                          .filter(Boolean)
                          .join(", ")}{" "}
                        — {selectedAddress.postalCode}
                      </p>
                    </div>
                    <button
                      onClick={() => { setStep(1); }}
                      className="text-[10px] font-black uppercase tracking-widest text-[#F7A221] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Payment options */}
                <div className="space-y-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodSelect("cod")}
                    className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-black bg-black/[0.02]"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        paymentMethod === "cod" ? "border-black bg-black" : "border-gray-300"
                      }`}>
                        {paymentMethod === "cod" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Banknote size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Online / Razorpay */}
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodSelect("online")}
                    className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer ${
                      paymentMethod === "online"
                        ? "border-black bg-black/[0.02]"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        paymentMethod === "online" ? "border-black bg-black" : "border-gray-300"
                      }`}>
                        {paymentMethod === "online" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CreditCard size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900">Pay Online</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          UPI, Cards, Net Banking via Razorpay
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Payment Plan Selector (only for online) */}
                {paymentMethod === "online" && (
                  <div className="mt-5 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                      Payment Plan
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePaymentPlanSelect("full")}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          paymentPlan === "full"
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-xs font-black">Pay Full</span>
                          <p className="text-[11px] mt-1 opacity-80">{fmt(quote?.amountPayable)}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handlePaymentPlanSelect("advance")}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          paymentPlan === "advance"
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs font-black">Pay Advance</span>
                            <Clock size={10} />
                          </div>
                          <p className="text-[11px] mt-1 opacity-80">
                            {fmt(advanceAmount)} + {fmt(quote?.amountPayable - advanceAmount)} later
                          </p>
                        </div>
                      </button>
                    </div>
                    {paymentPlan === "advance" && (
                      <p className="text-[10px] text-blue-500 font-medium mt-2 text-center">
                        Pay 25% now, remaining at delivery
                      </p>
                    )}
                  </div>
                )}

                {/* Razorpay key error warning */}
                {paymentMethod === "online" && razorpayKeyError && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
                    <p className="text-[11px] text-yellow-700 font-medium flex items-center gap-2">
                      <AlertCircle size={12} />
                      {razorpayKeyError}. Please use COD or try again later.
                    </p>
                  </div>
                )}

                {/* Place order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    !quote ||
                    loading.quote ||
                    loading.confirm ||
                    loading.placeOrder ||
                    isPlacingOrder ||
                    paymentVerification.loading ||
                    (paymentMethod === "online" && (!razorpayKey && !razorpayKeyLoading && !razorpayKeyError))
                  }
                  className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {loading.confirm || loading.placeOrder || isPlacingOrder || paymentVerification.loading ? (
                    <><Loader2 size={16} className="animate-spin" /> 
                      {paymentVerification.loading ? "Verifying Payment..." : "Placing Order…"}
                    </>
                  ) : loading.quote ? (
                    <><Loader2 size={16} className="animate-spin" /> Getting Quote…</>
                  ) : (
                    <>Place Order — {paymentMethod === "online" && paymentPlan === "advance" ? fmt(advanceAmount) : fmt(quote?.amountPayable)}</>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold mt-3">
                  By placing this order you agree to our Terms & Conditions
                </p>
              </div>
            )}
          </div>

          {/* ── Right Panel — Order Summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={16} className="text-gray-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Order Summary
                </h3>
                <span className="ml-auto text-xs font-black text-gray-400">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Cart items preview */}
              <div className="space-y-3 mb-5">
                {cartItems.slice(0, 3).map((item, i) => {
                  const matchedVariant = item.product?.variants?.find(
                    (v) => String(v._id) === String(item.variantId)
                  ) ?? item.product?.variants?.[0];
                  const image = matchedVariant?.images?.[0]?.url || null;
                  const name = item.product?.title || item.product?.name || "Product";
                  const price = item.price?.sale ?? item.price?.base;

                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                        {image ? (
                          <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={14} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-black text-gray-900">
                        {fmt(price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
                {cartItems.length > 3 && (
                  <p className="text-[10px] text-gray-400 font-bold text-center">
                    +{cartItems.length - 3} more item{cartItems.length - 3 > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                {loading.quote && (
                  <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs font-bold">Calculating totals…</span>
                  </div>
                )}

                {error.quote && !loading.quote && (
                  <div className="space-y-3">
                    <p className="text-xs text-red-500 font-bold">{error.quote.message}</p>
                    {selectedAddressId && (
                      <button
                        onClick={handleFetchQuote}
                        className="w-full py-3 text-xs font-black uppercase tracking-widest text-[#F7A221] hover:text-black border border-[#F7A221] rounded-2xl transition-colors cursor-pointer"
                      >
                        Retry Quote
                      </button>
                    )}
                  </div>
                )}

                {quote && !loading.quote && (
                  <PriceBreakdown
                    quote={quote}
                    itemCount={cartCount}
                    paymentMethod={paymentMethod}
                    paymentPlan={paymentPlan}
                    compact
                  />
                )}

                {!quote && !loading.quote && !error.quote && step === 1 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-400 font-medium">
                      Select an address to see delivery charges & final total
                    </p>
                  </div>
                )}
              </div>
            </div>

            {quote?.deliveryEstimate && (
              <div className="bg-white rounded-[28px] p-5 shadow-sm flex items-center gap-3">
                <Truck size={18} className="text-[#F7A221] flex-shrink-0" />
                <div>
                  <p className="text-xs font-black text-gray-900">Estimated Delivery</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {quote.deliveryEstimate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address form modal */}
      {showAddressModal && (
        <AddressFormModal
          initial={null}
          onSubmit={async () => {
            setShowAddressModal(false);
          }}
          onClose={() => setShowAddressModal(false)}
          isSaving={false}
          error={null}
        />
      )}

      {/* Razorpay Checkout Modal */}
      {showRazorpay && razorpayOrderData && razorpayKey && (
        <RazorpayCheckout
          razorpayOrder={razorpayOrderData}
          razorpayKey={razorpayKey}
          orderId={placedOrder?.order?.orderId}
          totalAmount={quote?.amountPayable}
          userEmail={user?.email}
          userName={user?.name}
          userPhone={selectedAddress?.phone}
          onSuccess={handleRazorpaySuccess}
          onFailure={handleRazorpayFailure}
          onClose={handleRazorpayClose}
          onRetry={handleRetryPayment}
        />
      )}

      {/* Payment verification loading */}
      {paymentVerification.loading && (
        <PaymentLoadingModal message="Verifying your payment..." />
      )}

      {/* Payment Error Modal */}
      {showPaymentErrorModal && (
        <PaymentErrorModal
          error={paymentError}
          onRetry={handleRetryPayment}
          onClose={() => {
            setShowPaymentErrorModal(false);
            setPaymentError(null);
          }}
        />
      )}
    </div>
  );
};

export default Checkout;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   ChevronRight, ChevronLeft, Loader2, MapPin,
//   CreditCard, Truck, CheckCircle2, Package,
//   AlertCircle, ArrowLeft, ShoppingBag, Banknote,
//   X, Clock,
// } from "lucide-react";

// // Redux — checkout
// import {
//   fetchCheckoutQuote,
//   confirmCheckoutQuote,
//   placeOrder,
//   setSelectedAddress,
//   setPaymentMethod,
//   setPaymentPlan,
//   resetCheckout,
//   resetQuote ,
//   clearCheckoutErrors,
//   selectQuote,
//   selectQuoteId,
//   selectConfirmed,
//   selectPlacedOrder,
//   selectSelectedAddressId,
//   selectPaymentMethod,
//   selectPaymentPlan,
//   selectCheckoutLoading,
//   selectCheckoutError,
//   getRazorpayKey,
//   selectRazorpayKey,
//   selectRazorpayKeyLoading,
//   selectRazorpayKeyError,
//   verifyRazorpayPayment,
//   selectPaymentVerification,
//   resetPaymentVerification,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/checkoutSlice/checkoutSlice";

// // Redux — address
// import {
//   selectDefaultAddress,
//   selectOtherAddresses,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/Useraddressslice";

// // Redux — cart
// import {
//   selectCartItems,
//   selectDisplayCartCount,
//   selectCartTotalAmount,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/userCartSlice";

// // Redux — auth
// import { selectUser } from "../../components/REDUX_FEATURES/REDUX_SLICES/authSlice";

// // Components
// import AddressSelector from "./AddressSelector/AddressSelector";
// import PriceBreakdown from "./PriceBreakdown/PriceBreakdown";
// import AddressFormModal from "../User_Dash_Segment/UserSubPages/UserAddress";
// import RazorpayCheckout, { PaymentErrorModal, PaymentLoadingModal } from "./RazorpayCheckout/RazorpayCheckout";

// const fmt = (n) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(n ?? 0);

// // ─────────────────────────────────────────────────────────────────────────────
// // Order Success Screen
// // ─────────────────────────────────────────────────────────────────────────────
// const OrderSuccess = ({ order, onViewOrders }) => (
//   <div className="min-h-screen bg-white flex items-center justify-center p-6">
//     <div className="max-w-md w-full text-center space-y-6">
//       <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
//         <CheckCircle2 size={48} className="text-green-500" />
//       </div>
//       <div>
//         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
//         <p className="text-gray-500 font-medium mt-2">
//           {order.paymentMethod === "cod" 
//             ? "We've received your order and will process it shortly."
//             : "Payment successful! Your order has been confirmed."}
//         </p>
//       </div>
//       <div className="bg-gray-50 rounded-[28px] p-6 text-left space-y-3">
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID</span>
//           <span className="text-sm font-black text-gray-900">{order.orderId}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">
//             {order.paymentMethod === "cod" ? "Total Amount" : "Amount Paid"}
//           </span>
//           <span className="text-sm font-black text-gray-900">{fmt(order.totalAmount)}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Payment</span>
//           <span className="text-sm font-black text-gray-900 uppercase">
//             {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Status</span>
//           <span className="text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
//             {order.orderStatus === "confirmed" ? "Confirmed" : order.orderStatus}
//           </span>
//         </div>
//       </div>
//       <div className="flex gap-3">
//         <button
//           onClick={onViewOrders}
//           className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
//         >
//           View Orders
//         </button>
//         <a
//           href="/"
//           className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all text-center cursor-pointer"
//         >
//           Continue Shopping
//         </a>
//       </div>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Checkout — Main Page
// // ─────────────────────────────────────────────────────────────────────────────
// const Checkout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redux state
//   const quote = useSelector(selectQuote);
//   const quoteId = useSelector(selectQuoteId);
//   const confirmed = useSelector(selectConfirmed);
//   const placedOrder = useSelector(selectPlacedOrder);
//   const selectedAddressId = useSelector(selectSelectedAddressId);
//   const paymentMethod = useSelector(selectPaymentMethod);
//   const paymentPlan = useSelector(selectPaymentPlan);
//   const loading = useSelector(selectCheckoutLoading);
//   const error = useSelector(selectCheckoutError);
//   const razorpayKey = useSelector(selectRazorpayKey);
//   const razorpayKeyLoading = useSelector(selectRazorpayKeyLoading);
//   const razorpayKeyError = useSelector(selectRazorpayKeyError);
//   const paymentVerification = useSelector(selectPaymentVerification);

//   const defaultAddr = useSelector(selectDefaultAddress);
//   const otherAddrs = useSelector(selectOtherAddresses);
//   const cartItems = useSelector(selectCartItems);
//   const cartCount = useSelector(selectDisplayCartCount);
//   const user = useSelector(selectUser);

//   // Local state
//   const [step, setStep] = useState(1);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showRazorpay, setShowRazorpay] = useState(false);
//   const [razorpayOrderData, setRazorpayOrderData] = useState(null);
//   const [paymentError, setPaymentError] = useState(null);
//   const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);

//   const allAddresses = [
//     ...(defaultAddr ? [defaultAddr] : []),
//     ...otherAddrs,
//   ];
//   const selectedAddress = allAddresses.find((a) => a._id === selectedAddressId);

//   // Fetch Razorpay key when online payment is selected
//   useEffect(() => {
//     if (paymentMethod === "online" && !razorpayKey && !razorpayKeyLoading && !razorpayKeyError) {
//       dispatch(getRazorpayKey());
//     }
//   }, [paymentMethod, razorpayKey, razorpayKeyLoading, razorpayKeyError, dispatch]);

//   // Guard: redirect to cart if cart is empty
//   useEffect(() => {
//     if (!loading.quote && cartItems.length === 0 && !placedOrder) {
//       navigate("/", { replace: true });
//     }
//   }, [cartItems.length, placedOrder, loading.quote, navigate]);

//   // Fetch quote when selected address changes and we're on step 2
//   useEffect(() => {
//     if (step === 2 && selectedAddressId && !quote && !loading.quote) {
//       handleFetchQuote();
//     }
//   }, [step, selectedAddressId]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       dispatch(clearCheckoutErrors());
//       dispatch(resetPaymentVerification());
//     };
//   }, [dispatch]);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const handleFetchQuote = async () => {
//     if (!selectedAddressId) return;
//     try {
//       await dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: paymentMethod,
//         })
//       ).unwrap();
//     } catch (e) {
//       toast.error(e?.message || "Could not get delivery quote", { theme: "dark" });
//     }
//   };

//   const handleStep1Next = () => {
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address", { theme: "dark" });
//       return;
//     }
//     setStep(2);
//     if (!quote) {
//       dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: paymentMethod,
//         })
//       );
//     }
//   };

//   const handlePaymentMethodSelect = (method) => {
//     dispatch(setPaymentMethod(method));
//     if (method === "online") {
//       // Reset payment plan to full when switching to online
//       dispatch(setPaymentPlan("full"));
//     }
//     // Re-fetch quote for the new payment method
//     if (quote && selectedAddressId) {
//       dispatch(resetQuote());
//       dispatch(setSelectedAddress(selectedAddressId));
//       dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: method,
//         })
//       );
//     }
//   };

//   const handlePaymentPlanSelect = (plan) => {
//     dispatch(setPaymentPlan(plan));
//     // Re-fetch quote for the new payment plan (affects totals for advance)
//     if (quote && selectedAddressId) {
//       dispatch(resetQuote());
//       dispatch(setSelectedAddress(selectedAddressId));
//       dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: paymentMethod,
//         })
//       );
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!quoteId || !selectedAddressId) {
//       toast.error("Missing quote or address. Please refresh the page.", { theme: "dark" });
//       return;
//     }

//     setIsPlacingOrder(true);

//     try {
//       // Step 1: Confirm the quote
//       const confirmResult = await dispatch(
//         confirmCheckoutQuote({
//           quoteId,
//           paymentMethod,
//           paymentPlan,
//         })
//       ).unwrap();

//       // Step 2: Create order
//       const orderResult = await dispatch(
//         placeOrder({
//           addressId: selectedAddressId,
//           paymentMethod,
//           quoteId: confirmResult.quoteId || quoteId,
//           onlinePaymentMode: paymentPlan,
//         })
//       ).unwrap();

//       // Step 3: Handle based on payment method
//       if (paymentMethod === "cod") {
//         toast.success("🎉 Order placed successfully!", { theme: "dark", autoClose: 3000 });
//         // Wait a bit before redirecting so user sees success
//         setTimeout(() => {
//           dispatch(resetCheckout());
//           navigate("/account/userorders");
//         }, 1500);
//       } else if (paymentMethod === "online") {
//         // Check if we have razorpay order data
//         if (!orderResult.razorpayOrder) {
//           throw new Error(orderResult.razorpayErrorDetail?.description || "Failed to initiate payment. Please try again.");
//         }
        
//         // Check if razorpay key is available
//         if (!razorpayKey && !razorpayKeyLoading) {
//           await dispatch(getRazorpayKey()).unwrap();
//         }
        
//         if (!razorpayKey && razorpayKeyError) {
//           throw new Error("Payment gateway not configured. Please contact support or try COD.");
//         }
        
//         setRazorpayOrderData(orderResult.razorpayOrder);
//         setShowRazorpay(true);
//       }
//     } catch (e) {
//       const errorMessage = e?.message || "Failed to place order";
      
//       // Handle specific error cases
//       if (e?.code === "QUOTE_STALE") {
//         toast.info("Prices updated — please review and confirm", { theme: "dark" });
//         dispatch(fetchCheckoutQuote({ addressId: selectedAddressId, paymentMethodHint: paymentMethod }));
//       } else if (e?.code === "MISSING_RAZORPAY_ENV") {
//         toast.error("Payment not configured. Please use COD for now.", { theme: "dark" });
//       } else {
//         toast.error(errorMessage, { theme: "dark" });
//       }
      
//       setPaymentError(errorMessage);
//       setShowPaymentErrorModal(true);
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   const handleRazorpaySuccess = async (response) => {
//     setShowRazorpay(false);
    
//     try {
//       // Verify payment on backend
//       await dispatch(
//         verifyRazorpayPayment({
//           razorpay_order_id: response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature: response.razorpay_signature,
//           orderId: placedOrder?.order?.orderId,
//         })
//       ).unwrap();
      
//       toast.success("🎉 Payment successful! Order confirmed.", { theme: "dark", autoClose: 3000 });
      
//       // Clear checkout state and redirect
//       setTimeout(() => {
//         dispatch(resetCheckout());
//         navigate("/account/userorders");
//       }, 1500);
//     } catch (err) {
//       console.error("Payment verification failed:", err);
//       setPaymentError(err?.message || "Payment verification failed. Please contact support.");
//       setShowPaymentErrorModal(true);
//     }
//   };

//   const handleRazorpayFailure = (error) => {
//     setShowRazorpay(false);
//     setPaymentError(error || "Payment failed. Please try again.");
//     setShowPaymentErrorModal(true);
//   };

//   const handleRazorpayClose = () => {
//     setShowRazorpay(false);
//     toast.info("Payment cancelled. You can try again or choose COD.", { theme: "dark" });
//   };

//   const handleRetryPayment = () => {
//     setShowPaymentErrorModal(false);
//     setPaymentError(null);
//     // Retry the order placement
//     handlePlaceOrder();
//   };

//   // ── Order placed — show success screen ───────────────────────────────────
//   if (placedOrder?.order && paymentMethod === "cod" && !paymentVerification.loading) {
//     return (
//       <OrderSuccess
//         order={{ ...placedOrder.order, paymentMethod: placedOrder.paymentMethod }}
//         onViewOrders={() => {
//           dispatch(resetCheckout());
//           navigate("/account/userorders");
//         }}
//       />
//     );
//   }

//   // For online orders, show success only after verification
//   if (placedOrder?.order && paymentMethod === "online" && paymentVerification.success) {
//     return (
//       <OrderSuccess
//         order={{ ...placedOrder.order, paymentMethod: placedOrder.paymentMethod }}
//         onViewOrders={() => {
//           dispatch(resetCheckout());
//           navigate("/account/userorders");
//         }}
//       />
//     );
//   }

//   // Calculate advance amount for display
//   const advanceAmount = quote?.amountPayable ? Math.round(quote.amountPayable * 25 / 100) : 0;

//   // ── Main render ──────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
//         <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={() => step === 1 ? navigate(-1) : setStep(1)}
//             className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer"
//           >
//             <ArrowLeft size={18} />
//             <span className="text-xs font-black uppercase tracking-widest">
//               {step === 1 ? "Back to Cart" : "Back"}
//             </span>
//           </button>

//           <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">
//             Checkout
//           </h1>

//           <div className="flex items-center gap-2">
//             {[
//               { n: 1, label: "Address" },
//               { n: 2, label: "Payment" },
//             ].map(({ n, label }) => (
//               <div key={n} className="flex items-center gap-1.5">
//                 <div
//                   className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
//                     step >= n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
//                   }`}
//                 >
//                   {step > n ? "✓" : n}
//                 </div>
//                 <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
//                   step >= n ? "text-gray-900" : "text-gray-400"
//                 }`}>
//                   {label}
//                 </span>
//                 {n < 2 && <ChevronRight size={12} className="text-gray-300" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

//           {/* ── Left Panel ── */}
//           <div className="space-y-6">

//             {/* Global error */}
//             {(error.quote || error.confirm || error.placeOrder) && (
//               <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-4">
//                 <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-red-700">
//                     {error.placeOrder?.message ||
//                       error.confirm?.message ||
//                       error.quote?.message}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => dispatch(clearCheckoutErrors())}
//                   className="text-red-400 hover:text-red-600 cursor-pointer"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             )}

//             {/* ── Step 1: Address ── */}
//             {step === 1 && (
//               <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">1</div>
//                   <h2 className="text-lg font-black text-gray-900">Delivery Address</h2>
//                 </div>

//                 <AddressSelector
//                   onAddAddress={() => setShowAddressModal(true)}
//                 />

//                 <button
//                   onClick={handleStep1Next}
//                   disabled={!selectedAddressId}
//                   className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   Continue to Payment <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}

//             {/* ── Step 2: Payment ── */}
//             {step === 2 && (
//               <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">2</div>
//                   <h2 className="text-lg font-black text-gray-900">Payment Method</h2>
//                 </div>

//                 {/* Selected address summary */}
//                 {selectedAddress && (
//                   <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
//                     <MapPin size={14} className="text-[#F7A221] mt-0.5 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
//                         Delivering to
//                       </p>
//                       <p className="text-sm font-black text-gray-900">{selectedAddress.fullName}</p>
//                       <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
//                         {[selectedAddress.houseNumber, selectedAddress.area, selectedAddress.city]
//                           .filter(Boolean)
//                           .join(", ")}{" "}
//                         — {selectedAddress.postalCode}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => { setStep(1); }}
//                       className="text-[10px] font-black uppercase tracking-widest text-[#F7A221] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
//                     >
//                       Change
//                     </button>
//                   </div>
//                 )}

//                 {/* Payment options */}
//                 <div className="space-y-3">
//                   {/* COD */}
//                   <button
//                     type="button"
//                     onClick={() => handlePaymentMethodSelect("cod")}
//                     className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer ${
//                       paymentMethod === "cod"
//                         ? "border-black bg-black/[0.02]"
//                         : "border-gray-100 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
//                         paymentMethod === "cod" ? "border-black bg-black" : "border-gray-300"
//                       }`}>
//                         {paymentMethod === "cod" && <div className="w-2 h-2 bg-white rounded-full" />}
//                       </div>
//                       <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <Banknote size={18} className="text-green-600" />
//                       </div>
//                       <div>
//                         <p className="font-black text-sm text-gray-900">Cash on Delivery</p>
//                         <p className="text-xs text-gray-400 font-medium mt-0.5">
//                           Pay when your order arrives
//                         </p>
//                       </div>
//                     </div>
//                   </button>

//                   {/* Online / Razorpay */}
//                   <button
//                     type="button"
//                     onClick={() => handlePaymentMethodSelect("online")}
//                     className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer ${
//                       paymentMethod === "online"
//                         ? "border-black bg-black/[0.02]"
//                         : "border-gray-100 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
//                         paymentMethod === "online" ? "border-black bg-black" : "border-gray-300"
//                       }`}>
//                         {paymentMethod === "online" && <div className="w-2 h-2 bg-white rounded-full" />}
//                       </div>
//                       <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <CreditCard size={18} className="text-blue-500" />
//                       </div>
//                       <div>
//                         <p className="font-black text-sm text-gray-900">Pay Online</p>
//                         <p className="text-xs text-gray-400 font-medium mt-0.5">
//                           UPI, Cards, Net Banking via Razorpay
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 {/* Payment Plan Selector (only for online) */}
//                 {paymentMethod === "online" && (
//                   <div className="mt-5 pt-3 border-t border-gray-100">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
//                       Payment Plan
//                     </p>
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => handlePaymentPlanSelect("full")}
//                         className={`flex-1 p-3 rounded-xl border-2 transition-all ${
//                           paymentPlan === "full"
//                             ? "border-black bg-black text-white"
//                             : "border-gray-200 bg-white text-gray-700"
//                         }`}
//                       >
//                         <div className="text-center">
//                           <span className="text-xs font-black">Pay Full</span>
//                           <p className="text-[11px] mt-1 opacity-80">{fmt(quote?.amountPayable)}</p>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => handlePaymentPlanSelect("advance")}
//                         className={`flex-1 p-3 rounded-xl border-2 transition-all ${
//                           paymentPlan === "advance"
//                             ? "border-black bg-black text-white"
//                             : "border-gray-200 bg-white text-gray-700"
//                         }`}
//                       >
//                         <div className="text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             <span className="text-xs font-black">Pay Advance</span>
//                             <Clock size={10} />
//                           </div>
//                           <p className="text-[11px] mt-1 opacity-80">
//                             {fmt(advanceAmount)} + {fmt(quote?.amountPayable - advanceAmount)} later
//                           </p>
//                         </div>
//                       </button>
//                     </div>
//                     {paymentPlan === "advance" && (
//                       <p className="text-[10px] text-blue-500 font-medium mt-2 text-center">
//                         Pay 25% now, remaining at delivery
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Razorpay key error warning */}
//                 {paymentMethod === "online" && razorpayKeyError && (
//                   <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
//                     <p className="text-[11px] text-yellow-700 font-medium flex items-center gap-2">
//                       <AlertCircle size={12} />
//                       {razorpayKeyError}. Please use COD or try again later.
//                     </p>
//                   </div>
//                 )}

//                 {/* Place order button */}
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={
//                     !quote ||
//                     loading.quote ||
//                     loading.confirm ||
//                     loading.placeOrder ||
//                     isPlacingOrder ||
//                     paymentVerification.loading ||
//                     (paymentMethod === "online" && (!razorpayKey && !razorpayKeyLoading && !razorpayKeyError))
//                   }
//                   className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   {loading.confirm || loading.placeOrder || isPlacingOrder || paymentVerification.loading ? (
//                     <><Loader2 size={16} className="animate-spin" /> 
//                       {paymentVerification.loading ? "Verifying Payment..." : "Placing Order…"}
//                     </>
//                   ) : loading.quote ? (
//                     <><Loader2 size={16} className="animate-spin" /> Getting Quote…</>
//                   ) : (
//                     <>Place Order — {paymentMethod === "online" && paymentPlan === "advance" ? fmt(advanceAmount) : fmt(quote?.amountPayable)}</>
//                   )}
//                 </button>

//                 <p className="text-center text-[10px] text-gray-400 font-bold mt-3">
//                   By placing this order you agree to our Terms & Conditions
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* ── Right Panel — Order Summary ── */}
//           <div className="space-y-4">
//             <div className="bg-white rounded-[32px] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-5">
//                 <ShoppingBag size={16} className="text-gray-400" />
//                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
//                   Order Summary
//                 </h3>
//                 <span className="ml-auto text-xs font-black text-gray-400">
//                   {cartCount} item{cartCount !== 1 ? "s" : ""}
//                 </span>
//               </div>

//               {/* Cart items preview */}
//               <div className="space-y-3 mb-5">
//                 {cartItems.slice(0, 3).map((item, i) => {
//                   const matchedVariant = item.product?.variants?.find(
//                     (v) => String(v._id) === String(item.variantId)
//                   ) ?? item.product?.variants?.[0];
//                   const image = matchedVariant?.images?.[0]?.url || null;
//                   const name = item.product?.title || item.product?.name || "Product";
//                   const price = item.price?.sale ?? item.price?.base;

//                   return (
//                     <div key={i} className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
//                         {image ? (
//                           <img src={image} alt={name} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <Package size={14} className="text-gray-300" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
//                         <p className="text-[11px] text-gray-400 font-medium">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                       <p className="text-xs font-black text-gray-900">
//                         {fmt(price * item.quantity)}
//                       </p>
//                     </div>
//                   );
//                 })}
//                 {cartItems.length > 3 && (
//                   <p className="text-[10px] text-gray-400 font-bold text-center">
//                     +{cartItems.length - 3} more item{cartItems.length - 3 > 1 ? "s" : ""}
//                   </p>
//                 )}
//               </div>

//               <div className="border-t border-gray-100 pt-4">
//                 {loading.quote && (
//                   <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
//                     <Loader2 size={14} className="animate-spin" />
//                     <span className="text-xs font-bold">Calculating totals…</span>
//                   </div>
//                 )}

//                 {error.quote && !loading.quote && (
//                   <div className="space-y-3">
//                     <p className="text-xs text-red-500 font-bold">{error.quote.message}</p>
//                     {selectedAddressId && (
//                       <button
//                         onClick={handleFetchQuote}
//                         className="w-full py-3 text-xs font-black uppercase tracking-widest text-[#F7A221] hover:text-black border border-[#F7A221] rounded-2xl transition-colors cursor-pointer"
//                       >
//                         Retry Quote
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {quote && !loading.quote && (
//                   <PriceBreakdown
//                     quote={quote}
//                     itemCount={cartCount}
//                     paymentMethod={paymentMethod}
//                     paymentPlan={paymentPlan}
//                     compact
//                   />
//                 )}

//                 {!quote && !loading.quote && !error.quote && step === 1 && (
//                   <div className="text-center py-2">
//                     <p className="text-xs text-gray-400 font-medium">
//                       Select an address to see delivery charges & final total
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {quote?.deliveryEstimate && (
//               <div className="bg-white rounded-[28px] p-5 shadow-sm flex items-center gap-3">
//                 <Truck size={18} className="text-[#F7A221] flex-shrink-0" />
//                 <div>
//                   <p className="text-xs font-black text-gray-900">Estimated Delivery</p>
//                   <p className="text-[11px] text-gray-500 font-medium mt-0.5">
//                     {quote.deliveryEstimate}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Address form modal */}
//       {showAddressModal && (
//         <AddressFormModal
//           initial={null}
//           onSubmit={async () => {
//             setShowAddressModal(false);
//           }}
//           onClose={() => setShowAddressModal(false)}
//           isSaving={false}
//           error={null}
//         />
//       )}

//       {/* Razorpay Checkout Modal */}
//       {showRazorpay && razorpayOrderData && razorpayKey && (
//         <RazorpayCheckout
//           razorpayOrder={razorpayOrderData}
//           razorpayKey={razorpayKey}
//           orderId={placedOrder?.order?.orderId}
//           totalAmount={quote?.amountPayable}
//           userEmail={user?.email}
//           userName={user?.name}
//           userPhone={selectedAddress?.phone}
//           onSuccess={handleRazorpaySuccess}
//           onFailure={handleRazorpayFailure}
//           onClose={handleRazorpayClose}
//           onRetry={handleRetryPayment}
//         />
//       )}

//       {/* Payment verification loading */}
//       {paymentVerification.loading && (
//         <PaymentLoadingModal message="Verifying your payment..." />
//       )}

//       {/* Payment Error Modal */}
//       {showPaymentErrorModal && (
//         <PaymentErrorModal
//           error={paymentError}
//           onRetry={handleRetryPayment}
//           onClose={() => {
//             setShowPaymentErrorModal(false);
//             setPaymentError(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Checkout;
// upper code getting update by addding online razropay etc >>?>?>?>?>???????????>>>>>>>>>>>>>>>>>>>>>

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   ChevronRight, ChevronLeft, Loader2, MapPin,
//   CreditCard, Truck, CheckCircle2, Package,
//   AlertCircle, ArrowLeft, ShoppingBag, Banknote,
//   X,
// } from "lucide-react";

// // Redux — checkout
// import {
//   fetchCheckoutQuote,
//   confirmCheckoutQuote,
//   placeOrder,
//   setSelectedAddress,
//   setPaymentMethod,
//   resetCheckout,
//   clearCheckoutErrors,
//   selectQuote,
//   selectQuoteId,
//   selectConfirmed,
//   selectPlacedOrder,
//   selectSelectedAddressId,
//   selectPaymentMethod,
//   selectCheckoutLoading,
//   selectCheckoutError,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/checkoutSlice/checkoutSlice";

// // Redux — address
// import {
//   selectDefaultAddress,
//   selectOtherAddresses,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/Useraddressslice";

// // Redux — cart
// import {
//   selectCartItems,
//   selectDisplayCartCount,
//   selectCartTotalAmount,
// } from "../../components/REDUX_FEATURES/REDUX_SLICES/userCartSlice";

// // Components
// import AddressSelector from "./AddressSelector/AddressSelector";
// import PriceBreakdown from "./PriceBreakdown/PriceBreakdown";
// import AddressFormModal from "../User_Dash_Segment/UserSubPages/UserAddress"; // reuse existing modal

// const fmt = (n) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(n ?? 0);

// // ─────────────────────────────────────────────────────────────────────────────
// // Coming Soon Modal — for online/Razorpay
// // ─────────────────────────────────────────────────────────────────────────────
// const ComingSoonModal = ({ onClose }) => (
//   <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
//     <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl text-center">
//       <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
//         <CreditCard size={28} className="text-[#F7A221]" />
//       </div>
//       <h3 className="text-xl font-black text-gray-900 mb-2">Coming Soon!</h3>
//       <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
//         Online payment via Razorpay is coming very soon. For now, please use
//         Cash on Delivery.
//       </p>
//       <button
//         onClick={onClose}
//         className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
//       >
//         Got it, use COD
//       </button>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Order Success Screen
// // ─────────────────────────────────────────────────────────────────────────────
// const OrderSuccess = ({ order, onViewOrders }) => (
//   <div className="min-h-screen bg-white flex items-center justify-center p-6">
//     <div className="max-w-md w-full text-center space-y-6">
//       {/* Animated checkmark */}
//       <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
//         <CheckCircle2 size={48} className="text-green-500" />
//       </div>

//       <div>
//         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
//         <p className="text-gray-500 font-medium mt-2">
//           We've received your order and will process it shortly.
//         </p>
//       </div>

//       {/* Order summary card */}
//       <div className="bg-gray-50 rounded-[28px] p-6 text-left space-y-3">
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID</span>
//           <span className="text-sm font-black text-gray-900">{order.orderId}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Paid</span>
//           <span className="text-sm font-black text-gray-900">{fmt(order.totalAmount)}</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Payment</span>
//           <span className="text-sm font-black text-gray-900 uppercase">
//             {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
//           </span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Status</span>
//           <span className="text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
//             {order.orderStatus}
//           </span>
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <button
//           onClick={onViewOrders}
//           className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
//         >
//           View Orders
//         </button>
//         <a
//           href="/"
//           className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all text-center cursor-pointer"
//         >
//           Continue Shopping
//         </a>
//       </div>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // Checkout — Main Page
// // ─────────────────────────────────────────────────────────────────────────────
// const Checkout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redux state
//   const quote = useSelector(selectQuote);
//   const quoteId = useSelector(selectQuoteId);
//   const confirmed = useSelector(selectConfirmed);
//   const placedOrder = useSelector(selectPlacedOrder);
//   const selectedAddressId = useSelector(selectSelectedAddressId);
//   const paymentMethod = useSelector(selectPaymentMethod);
//   const loading = useSelector(selectCheckoutLoading);
//   const error = useSelector(selectCheckoutError);

//   const defaultAddr = useSelector(selectDefaultAddress);
//   const otherAddrs = useSelector(selectOtherAddresses);
//   const cartItems = useSelector(selectCartItems);
//   const cartCount = useSelector(selectDisplayCartCount);
//   const cartTotal = useSelector(selectCartTotalAmount);

//   // Local state
//   const [step, setStep] = useState(1); // 1 = address, 2 = payment
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showComingSoon, setShowComingSoon] = useState(false);

//   // Build full address list for display
//   const allAddresses = [
//     ...(defaultAddr ? [defaultAddr] : []),
//     ...otherAddrs,
//   ];

//   const selectedAddress = allAddresses.find((a) => a._id === selectedAddressId);

//   // Guard: redirect to cart if cart is empty
//   useEffect(() => {
//     if (!loading.quote && cartItems.length === 0 && !placedOrder) {
//       navigate("/", { replace: true });
//     }
//   }, [cartItems.length, placedOrder, loading.quote, navigate]);

//   // Fetch quote whenever selected address changes and we're on step 2
//   useEffect(() => {
//     if (step === 2 && selectedAddressId && !quote && !loading.quote) {
//       handleFetchQuote();
//     }
//   }, [step, selectedAddressId]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       dispatch(clearCheckoutErrors());
//     };
//   }, [dispatch]);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const handleFetchQuote = async () => {
//     if (!selectedAddressId) return;
//     try {
//       await dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: "cod",
//         })
//       ).unwrap();
//     } catch (e) {
//       toast.error(e?.message || "Could not get delivery quote", { theme: "dark" });
//     }
//   };

//   const handleStep1Next = () => {
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address", { theme: "dark" });
//       return;
//     }
//     setStep(2);
//     // Fetch quote for selected address
//     if (!quote) {
//       dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: "cod",
//         })
//       );
//     }
//   };

//   const handlePaymentMethodSelect = (method) => {
//     if (method === "online") {
//       setShowComingSoon(true);
//       return;
//     }
//     dispatch(setPaymentMethod(method));
//     // Re-fetch quote if method changed and quote exists
//     if (quote && selectedAddressId) {
//       dispatch(resetCheckout());
//       dispatch(setSelectedAddress(selectedAddressId));
//       dispatch(
//         fetchCheckoutQuote({
//           addressId: selectedAddressId,
//           paymentMethodHint: method,
//         })
//       );
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!quoteId || !selectedAddressId) return;

//     try {
//       // Step 1: Confirm the quote
//       const confirmResult = await dispatch(
//         confirmCheckoutQuote({
//           quoteId,
//           paymentMethod: "cod",
//           paymentPlan: "full",
//         })
//       ).unwrap();

//       // Step 2: Place the order using the confirmed quoteId
//       await dispatch(
//         placeOrder({
//           addressId: selectedAddressId,
//           paymentMethod: "cod",
//           quoteId: confirmResult.quoteId || quoteId,
//         })
//       ).unwrap();

//       toast.success("🎉 Order placed successfully!", { theme: "dark", autoClose: 3000 });
//     } catch (e) {
//       const msg = e?.message || "Failed to place order";

//       // If quote stale — re-fetch automatically
//       if (e?.code === "QUOTE_STALE") {
//         toast.info("Prices updated — please review and confirm", { theme: "dark" });
//         dispatch(fetchCheckoutQuote({ addressId: selectedAddressId, paymentMethodHint: "cod" }));
//         return;
//       }

//       toast.error(msg, { theme: "dark" });
//     }
//   };

//   // ── Order placed — show success screen ───────────────────────────────────
//   if (placedOrder?.order) {
//     return (
//       <OrderSuccess
//         order={{ ...placedOrder.order, paymentMethod: placedOrder.paymentMethod }}
//         onViewOrders={() => {
//           dispatch(resetCheckout());
//           navigate("/account/orders");
//         }}
//       />
//     );
//   }

//   // ── Main render ──────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
//         <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={() => step === 1 ? navigate(-1) : setStep(1)}
//             className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer"
//           >
//             <ArrowLeft size={18} />
//             <span className="text-xs font-black uppercase tracking-widest">
//               {step === 1 ? "Back to Cart" : "Back"}
//             </span>
//           </button>

//           <h1 className="text-sm font-black uppercase tracking-widest text-gray-900">
//             Checkout
//           </h1>

//           {/* Step indicators */}
//           <div className="flex items-center gap-2">
//             {[
//               { n: 1, label: "Address" },
//               { n: 2, label: "Payment" },
//             ].map(({ n, label }) => (
//               <div key={n} className="flex items-center gap-1.5">
//                 <div
//                   className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
//                     step >= n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
//                   }`}
//                 >
//                   {step > n ? "✓" : n}
//                 </div>
//                 <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
//                   step >= n ? "text-gray-900" : "text-gray-400"
//                 }`}>
//                   {label}
//                 </span>
//                 {n < 2 && <ChevronRight size={12} className="text-gray-300" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

//           {/* ── Left Panel ── */}
//           <div className="space-y-6">

//             {/* Global error */}
//             {(error.quote || error.confirm || error.placeOrder) && (
//               <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-4">
//                 <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-red-700">
//                     {error.placeOrder?.message ||
//                       error.confirm?.message ||
//                       error.quote?.message}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => dispatch(clearCheckoutErrors())}
//                   className="text-red-400 hover:text-red-600 cursor-pointer"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             )}

//             {/* ── Step 1: Address ── */}
//             {step === 1 && (
//               <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">1</div>
//                   <h2 className="text-lg font-black text-gray-900">Delivery Address</h2>
//                 </div>

//                 <AddressSelector
//                   onAddAddress={() => setShowAddressModal(true)}
//                 />

//                 <button
//                   onClick={handleStep1Next}
//                   disabled={!selectedAddressId}
//                   className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   Continue to Payment <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}

//             {/* ── Step 2: Payment ── */}
//             {step === 2 && (
//               <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">2</div>
//                   <h2 className="text-lg font-black text-gray-900">Payment Method</h2>
//                 </div>

//                 {/* Selected address summary */}
//                 {selectedAddress && (
//                   <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
//                     <MapPin size={14} className="text-[#F7A221] mt-0.5 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
//                         Delivering to
//                       </p>
//                       <p className="text-sm font-black text-gray-900">{selectedAddress.fullName}</p>
//                       <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
//                         {[selectedAddress.houseNumber, selectedAddress.area, selectedAddress.city]
//                           .filter(Boolean)
//                           .join(", ")}{" "}
//                         — {selectedAddress.postalCode}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => { setStep(1); }}
//                       className="text-[10px] font-black uppercase tracking-widest text-[#F7A221] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
//                     >
//                       Change
//                     </button>
//                   </div>
//                 )}

//                 {/* Payment options */}
//                 <div className="space-y-3">
//                   {/* COD */}
//                   <button
//                     type="button"
//                     onClick={() => handlePaymentMethodSelect("cod")}
//                     className={`w-full text-left p-4 rounded-[24px] border-2 transition-all cursor-pointer ${
//                       paymentMethod === "cod"
//                         ? "border-black bg-black/[0.02]"
//                         : "border-gray-100 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
//                         paymentMethod === "cod" ? "border-black bg-black" : "border-gray-300"
//                       }`}>
//                         {paymentMethod === "cod" && <div className="w-2 h-2 bg-white rounded-full" />}
//                       </div>
//                       <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <Banknote size={18} className="text-green-600" />
//                       </div>
//                       <div>
//                         <p className="font-black text-sm text-gray-900">Cash on Delivery</p>
//                         <p className="text-xs text-gray-400 font-medium mt-0.5">
//                           Pay when your order arrives
//                         </p>
//                       </div>
//                     </div>
//                   </button>

//                   {/* Online / Razorpay — coming soon */}
//                   <button
//                     type="button"
//                     onClick={() => handlePaymentMethodSelect("online")}
//                     className="w-full text-left p-4 rounded-[24px] border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer opacity-60"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
//                       <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <CreditCard size={18} className="text-blue-500" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <p className="font-black text-sm text-gray-900">Pay Online</p>
//                           <span className="text-[8px] font-black uppercase tracking-widest bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
//                             Coming Soon
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-400 font-medium mt-0.5">
//                           UPI, Cards, Net Banking via Razorpay
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 {/* Place order button */}
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={
//                     !quote ||
//                     loading.quote ||
//                     loading.confirm ||
//                     loading.placeOrder ||
//                     paymentMethod !== "cod"
//                   }
//                   className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F7A221] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   {loading.confirm || loading.placeOrder ? (
//                     <><Loader2 size={16} className="animate-spin" /> Placing Order…</>
//                   ) : loading.quote ? (
//                     <><Loader2 size={16} className="animate-spin" /> Getting Quote…</>
//                   ) : (
//                     <>Place Order — {fmt(quote?.amountPayable)}</>
//                   )}
//                 </button>

//                 <p className="text-center text-[10px] text-gray-400 font-bold mt-3">
//                   By placing this order you agree to our Terms & Conditions
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* ── Right Panel — Order Summary ── */}
//           <div className="space-y-4">
//             {/* Cart summary */}
//             <div className="bg-white rounded-[32px] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-5">
//                 <ShoppingBag size={16} className="text-gray-400" />
//                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
//                   Order Summary
//                 </h3>
//                 <span className="ml-auto text-xs font-black text-gray-400">
//                   {cartCount} item{cartCount !== 1 ? "s" : ""}
//                 </span>
//               </div>

//               {/* Cart items preview */}
//               <div className="space-y-3 mb-5">
//                 {cartItems.slice(0, 3).map((item, i) => {
//                   const matchedVariant = item.product?.variants?.find(
//                     (v) => String(v._id) === String(item.variantId)
//                   ) ?? item.product?.variants?.[0];
//                   const image = matchedVariant?.images?.[0]?.url || null;
//                   const name = item.product?.title || item.product?.name || "Product";
//                   const price = item.price?.sale ?? item.price?.base;

//                   return (
//                     <div key={i} className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
//                         {image ? (
//                           <img src={image} alt={name} className="w-full h-full object-cover" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <Package size={14} className="text-gray-300" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
//                         <p className="text-[11px] text-gray-400 font-medium">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                       <p className="text-xs font-black text-gray-900">
//                         {fmt(price * item.quantity)}
//                       </p>
//                     </div>
//                   );
//                 })}
//                 {cartItems.length > 3 && (
//                   <p className="text-[10px] text-gray-400 font-bold text-center">
//                     +{cartItems.length - 3} more item{cartItems.length - 3 > 1 ? "s" : ""}
//                   </p>
//                 )}
//               </div>

//               <div className="border-t border-gray-100 pt-4">
//                 {/* Quote loading */}
//                 {loading.quote && (
//                   <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
//                     <Loader2 size={14} className="animate-spin" />
//                     <span className="text-xs font-bold">Calculating totals…</span>
//                   </div>
//                 )}

//                 {/* Quote error */}
//                 {error.quote && !loading.quote && (
//                   <div className="space-y-3">
//                     <p className="text-xs text-red-500 font-bold">{error.quote.message}</p>
//                     {selectedAddressId && (
//                       <button
//                         onClick={handleFetchQuote}
//                         className="w-full py-3 text-xs font-black uppercase tracking-widest text-[#F7A221] hover:text-black border border-[#F7A221] rounded-2xl transition-colors cursor-pointer"
//                       >
//                         Retry Quote
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Price breakdown */}
//                 {quote && !loading.quote && (
//                   <PriceBreakdown
//                     quote={quote}
//                     itemCount={cartCount}
//                     paymentMethod={paymentMethod}
//                     compact
//                   />
//                 )}

//                 {/* No quote yet (step 1) */}
//                 {!quote && !loading.quote && !error.quote && step === 1 && (
//                   <div className="text-center py-2">
//                     <p className="text-xs text-gray-400 font-medium">
//                       Select an address to see delivery charges & final total
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Delivery info */}
//             {quote?.deliveryEstimate && (
//               <div className="bg-white rounded-[28px] p-5 shadow-sm flex items-center gap-3">
//                 <Truck size={18} className="text-[#F7A221] flex-shrink-0" />
//                 <div>
//                   <p className="text-xs font-black text-gray-900">Estimated Delivery</p>
//                   <p className="text-[11px] text-gray-500 font-medium mt-0.5">
//                     {quote.deliveryEstimate}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* Address form modal */}
//       {showAddressModal && (
//         <AddressFormModal
//           initial={null}
//           onSubmit={async (formData) => {
//             // Parent handles add via existing UserAddress dispatch
//             // We just close the modal here — AddressSelector will re-fetch
//             setShowAddressModal(false);
//           }}
//           onClose={() => setShowAddressModal(false)}
//           isSaving={false}
//           error={null}
//         />
//       )}

//       {/* Coming soon modal for online payment */}
//       {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
//     </div>
//   );
// };

// export default Checkout;