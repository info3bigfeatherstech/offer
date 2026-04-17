import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Loader2, AlertCircle, X } from "lucide-react";

/**
 * RazorpayCheckout Component
 * 
 * Props:
 *   razorpayOrder   - { id, amount, currency } from backend
 *   razorpayKey     - Razorpay key_id from backend
 *   orderId         - Your order ID
 *   totalAmount     - Total amount in INR
 *   userEmail       - User's email
 *   userName        - User's full name
 *   userPhone       - User's phone number
 *   onSuccess       - Callback on successful payment
 *   onFailure       - Callback on payment failure
 *   onClose         - Callback when modal is closed
 *   onRetry         - Callback to retry payment
 */
const RazorpayCheckout = ({
  razorpayOrder,
  razorpayKey,
  orderId,
  totalAmount,
  userEmail,
  userName,
  userPhone,
  onSuccess,
  onFailure,
  onClose,
  onRetry,
}) => {
  const dispatch = useDispatch();
  const razorpayInitialized = useRef(false);
  const razorpayInstance = useRef(null);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const initPayment = async () => {
      // Prevent double initialization
      if (razorpayInitialized.current) return;

      // Validate required props
      if (!razorpayOrder?.id) {
        console.error("RazorpayCheckout: Missing razorpayOrder.id");
        onFailure?.("Invalid payment order. Please try again.");
        return;
      }

      if (!razorpayKey) {
        console.error("RazorpayCheckout: Missing razorpayKey");
        onFailure?.("Payment gateway not configured. Please try again later.");
        return;
      }

      razorpayInitialized.current = true;

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        onFailure?.("Failed to load payment gateway. Please check your internet connection.");
        return;
      }

      // Prepare customer name
      const customerName = userName || userEmail?.split("@")[0] || "Customer";

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Your Store Name",
        description: `Order #${orderId}`,
        image: "/logo.png", // Optional: Add your store logo URL
        order_id: razorpayOrder.id,
        handler: async (response) => {
          // Payment successful - response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          console.log("Razorpay payment response:", response);
          onSuccess?.(response);
        },
        prefill: {
          name: customerName,
          email: userEmail || "",
          contact: userPhone || "",
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: "#F7A221",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal closed by user");
            onClose?.();
          },
          escape: true,
          backdropclose: false,
        },
        retry: {
          enabled: true,
          retryCount: 2,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "All Payment Methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "upi" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      try {
        razorpayInstance.current = new window.Razorpay(options);
        
        // Add event listeners for better error handling
        razorpayInstance.current.on("payment.failed", (response) => {
          console.error("Razorpay payment failed:", response);
          const errorMessage = response.error?.description || response.error?.reason || "Payment failed. Please try again.";
          onFailure?.(errorMessage);
        });

        razorpayInstance.current.open();
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        onFailure?.("Failed to initialize payment. Please try again.");
      }
    };

    initPayment();

    // Cleanup
    return () => {
      if (razorpayInstance.current) {
        // Razorpay doesn't have a close method, but we can clean up references
        razorpayInstance.current = null;
      }
      razorpayInitialized.current = false;
    };
  }, [razorpayOrder, razorpayKey, orderId, userName, userEmail, userPhone, onSuccess, onFailure, onClose]);

  // This component doesn't render anything visible
  // It just opens the Razorpay modal
  return null;
};

// Error Modal Component - shown when payment fails
export const PaymentErrorModal = ({ error, onRetry, onClose }) => (
  <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">Payment Failed</h3>
      <p className="text-sm text-gray-500 font-medium mb-6">
        {error || "Something went wrong with your payment. Please try again."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-black text-xs uppercase tracking-widest hover:border-black transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Loading Modal - shown while processing
export const PaymentLoadingModal = ({ message }) => (
  <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    <div className="relative bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl text-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-[#F7A221]" />
        <p className="text-sm font-black text-gray-900">{message || "Processing payment..."}</p>
        <p className="text-[11px] text-gray-400">Please do not close this window</p>
      </div>
    </div>
  </div>
);

export default RazorpayCheckout;
// import React, { useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { Loader2, AlertCircle, X } from "lucide-react";

// /**
//  * RazorpayCheckout Component
//  * 
//  * Props:
//  *   razorpayOrder   - { id, amount, currency } from backend
//  *   razorpayKey     - Razorpay key_id from backend
//  *   orderId         - Your order ID
//  *   totalAmount     - Total amount in INR
//  *   userEmail       - User's email
//  *   userName        - User's full name
//  *   userPhone       - User's phone number
//  *   onSuccess       - Callback on successful payment
//  *   onFailure       - Callback on payment failure
//  *   onClose         - Callback when modal is closed
//  *   onRetry         - Callback to retry payment
//  */
// const RazorpayCheckout = ({
//   razorpayOrder,
//   razorpayKey,
//   orderId,
//   totalAmount,
//   userEmail,
//   userName,
//   userPhone,
//   onSuccess,
//   onFailure,
//   onClose,
//   onRetry,
// }) => {
//   const dispatch = useDispatch();
//   const razorpayInitialized = useRef(false);
//   const razorpayInstance = useRef(null);

//   // Load Razorpay script dynamically
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     const initPayment = async () => {
//       // Prevent double initialization
//       if (razorpayInitialized.current) return;

//       // Validate required props
//       if (!razorpayOrder?.id) {
//         console.error("RazorpayCheckout: Missing razorpayOrder.id");
//         onFailure?.("Invalid payment order. Please try again.");
//         return;
//       }

//       if (!razorpayKey) {
//         console.error("RazorpayCheckout: Missing razorpayKey");
//         onFailure?.("Payment gateway not configured. Please try again later.");
//         return;
//       }

//       razorpayInitialized.current = true;

//       // Load Razorpay script
//       const isScriptLoaded = await loadRazorpayScript();
//       if (!isScriptLoaded) {
//         onFailure?.("Failed to load payment gateway. Please check your internet connection.");
//         return;
//       }

//       // Prepare customer name
//       const customerName = userName || userEmail?.split("@")[0] || "Customer";

//       const options = {
//         key: razorpayKey,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency || "INR",
//         name: "Your Store Name",
//         description: `Order #${orderId}`,
//         image: "/logo.png", // Optional: Add your store logo URL
//         order_id: razorpayOrder.id,
//         handler: async (response) => {
//           // Payment successful - response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
//           console.log("Razorpay payment response:", response);
//           onSuccess?.(response);
//         },
//         prefill: {
//           name: customerName,
//           email: userEmail || "",
//           contact: userPhone || "",
//         },
//         notes: {
//           orderId: orderId,
//         },
//         theme: {
//           color: "#F7A221",
//         },
//         modal: {
//           ondismiss: () => {
//             console.log("Razorpay modal closed by user");
//             onClose?.();
//           },
//           escape: true,
//           backdropclose: false,
//         },
//         retry: {
//           enabled: true,
//           retryCount: 2,
//         },
//         config: {
//           display: {
//             blocks: {
//               banks: {
//                 name: "All Payment Methods",
//                 instruments: [
//                   { method: "card" },
//                   { method: "netbanking" },
//                   { method: "upi" },
//                   { method: "wallet" },
//                 ],
//               },
//             },
//             sequence: ["block.banks"],
//             preferences: {
//               show_default_blocks: true,
//             },
//           },
//         },
//       };

//       try {
//         razorpayInstance.current = new window.Razorpay(options);
        
//         // Add event listeners for better error handling
//         razorpayInstance.current.on("payment.failed", (response) => {
//           console.error("Razorpay payment failed:", response);
//           const errorMessage = response.error?.description || response.error?.reason || "Payment failed. Please try again.";
//           onFailure?.(errorMessage);
//         });

//         razorpayInstance.current.open();
//       } catch (error) {
//         console.error("Razorpay initialization error:", error);
//         onFailure?.("Failed to initialize payment. Please try again.");
//       }
//     };

//     initPayment();

//     // Cleanup
//     return () => {
//       if (razorpayInstance.current) {
//         // Razorpay doesn't have a close method, but we can clean up references
//         razorpayInstance.current = null;
//       }
//       razorpayInitialized.current = false;
//     };
//   }, [razorpayOrder, razorpayKey, orderId, userName, userEmail, userPhone, onSuccess, onFailure, onClose]);

//   // This component doesn't render anything visible
//   // It just opens the Razorpay modal
//   return null;
// };

// // Error Modal Component - shown when payment fails
// export const PaymentErrorModal = ({ error, onRetry, onClose }) => (
//   <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//     <div className="relative bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl text-center">
//       <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//         <AlertCircle size={28} className="text-red-500" />
//       </div>
//       <h3 className="text-xl font-black text-gray-900 mb-2">Payment Failed</h3>
//       <p className="text-sm text-gray-500 font-medium mb-6">
//         {error || "Something went wrong with your payment. Please try again."}
//       </p>
//       <div className="flex gap-3">
//         <button
//           onClick={onClose}
//           className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-black text-xs uppercase tracking-widest hover:border-black transition-all cursor-pointer"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onRetry}
//           className="flex-1 py-3 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F7A221] hover:text-black transition-all cursor-pointer"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Loading Modal - shown while processing
// export const PaymentLoadingModal = ({ message }) => (
//   <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
//     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
//     <div className="relative bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl text-center">
//       <div className="flex flex-col items-center gap-4">
//         <Loader2 size={32} className="animate-spin text-[#F7A221]" />
//         <p className="text-sm font-black text-gray-900">{message || "Processing payment..."}</p>
//         <p className="text-[11px] text-gray-400">Please do not close this window</p>
//       </div>
//     </div>
//   </div>
// );

// export default RazorpayCheckout;