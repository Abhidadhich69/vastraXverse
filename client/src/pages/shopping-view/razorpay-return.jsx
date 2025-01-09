import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureRazorpayPayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function RazorpayReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("razorpay_payment_id"); // Razorpay's payment ID
  const orderId = params.get("razorpay_order_id"); // Razorpay's order ID
  const signature = params.get("razorpay_signature"); // Signature for payment verification

  useEffect(() => {
    if (paymentId && orderId && signature) {
      dispatch(
        captureRazorpayPayment({ paymentId, orderId, signature })
      ).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        } else {
          window.location.href = "/shop/payment-failed";
        }
      });
    }
  }, [paymentId, orderId, signature, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default RazorpayReturnPage;
