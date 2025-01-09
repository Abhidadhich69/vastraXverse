import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get Razorpay payment details from query params
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("razorpay_payment_id");
  const orderId = params.get("razorpay_order_id");
  const signature = params.get("razorpay_signature");

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment Successful!</CardTitle>
      </CardHeader>

      <div className="mt-5">
        <p>Your payment was successfully completed.</p>
        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Signature:</strong> {signature}</p>
      </div>

      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
