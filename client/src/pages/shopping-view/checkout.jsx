import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

      function handleInitiateRazorpayPayment() {
        if (cartItems.length === 0) {
          toast({
            title: "Your cart is empty. Please add items to proceed",
            variant: "destructive",
          });
          return;
        }
      
        if (currentSelectedAddress === null) {
          toast({
            title: "Please select one address to proceed.",
            variant: "destructive",
          });
          return;
        }
      
        const orderData = {
          userId: user?.id,
          cartId: cartItems?._id,
          cartItems: cartItems.items.map((singleCartItem) => ({
            productId: singleCartItem?.productId,
            title: singleCartItem?.title,
            image: singleCartItem?.image,
            price:
              singleCartItem?.salePrice > 0
                ? singleCartItem?.salePrice
                : singleCartItem?.price,
            quantity: singleCartItem?.quantity,
          })),
          addressInfo: {
            addressId: currentSelectedAddress?._id,
            address: currentSelectedAddress?.address,
            city: currentSelectedAddress?.city,
            pincode: currentSelectedAddress?.pincode,
            phone: currentSelectedAddress?.phone,
            notes: currentSelectedAddress?.notes,
          },
          orderStatus: "pending",
          paymentMethod: "razorpay", // Change to Razorpay
          paymentStatus: "pending",
          totalAmount: totalCartAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId: "",
          orderId: "", // Initialize empty orderId
        };
      
        // Create the order using Razorpay API on the backend
        dispatch(createNewOrder(orderData)).then((data) => {
          if (data?.payload?.success) {
            const razorpayOrder = data.payload.order; // Assuming this is the order object returned from the backend
      
            // Prepare Razorpay options for checkout
            const options = {
              key: process.env.RAZORPAY_KEY_ID, // Use environment variable for Razorpay key
              amount: razorpayOrder.amount, // The amount to be charged in paise (₹100 = 10000)
              currency: "INR", // Currency code
              order_id: razorpayOrder.orderId, // Razorpay order ID
              name: "Your Company Name",
              description: "Purchase description",
              image: "URL_TO_YOUR_LOGO",
              handler: function (response) {
                // Once payment is successful, update the order status
                dispatch(
                  updatePaymentStatus({
                    paymentId: response.razorpay_payment_id,
                    orderId: razorpayOrder.orderId,
                    signature: response.razorpay_signature,
                  })
                ).then(() => {
                  window.location.href = "/shop/payment-success"; // Redirect to success page
                });
              },
              prefill: {
                name: user?.name,
                email: user?.email,
                contact: currentSelectedAddress?.phone,
              },
              notes: {
                address: currentSelectedAddress?.address,
              },
              theme: {
                color: "#F37254", // Your theme color
              },
            };
      
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          } else {
            setIsPaymemntStart(false);
          }
        });
      }
      

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">{totalCartAmount} Rs</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart
                ? "Processing Razorpay Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
