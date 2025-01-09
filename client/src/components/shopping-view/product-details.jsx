import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState(""); // Track selected size
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    if (!selectedSize) {
      toast({
        title: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        size: selectedSize,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedSize(""); // Reset selected size when dialog closes
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Mock size chart data
  const sizeChart = [
    { size: "S", chest: "34", waist: "28", length: "28" },
    { size: "M", chest: "38", waist: "30", length: "29" },
    { size: "L", chest: "42", waist: "32", length: "30" },
    { size: "XL", chest: "46", waist: "34", length: "31" }, // Added XL size
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
    <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:p-8 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
      <div className="relative overflow-hidden rounded-lg max-w-[500px] mx-auto">
        <img
          src={productDetails?.image}
          alt={productDetails?.title}
          width={600}
          height={600}
          className="aspect-auto w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 justify-between max-h-full overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails?.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-3xl font-bold text-primary ${
              productDetails?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            {productDetails?.price} Rs
          </p>
          {productDetails?.salePrice > 0 ? (
            <p className="text-2xl font-bold text-muted-foreground">
              {productDetails?.salePrice} Rs
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <StarRatingComponent rating={averageReview} />
          </div>
          <span className="text-muted-foreground">
            ({averageReview.toFixed(2)})
          </span>
        </div>
        <div className="mt-5 mb-5">
          {productDetails?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : (
            <Button
              className="w-full bg-[#ecb06b] hover:bg-[#ad6623] text-white"
              onClick={() =>
                handleAddToCart(
                  productDetails?._id,
                  productDetails?.totalStock
                )
              }
            >
              Add to Cart
            </Button>
          )}
        </div>
  
        {/* Size Chart Section */}
        {sizeChart && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold">Size Chart</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Size</th>
                    <th className="border border-gray-300 px-4 py-2">Chest (in)</th>
                    <th className="border border-gray-300 px-4 py-2">Waist (in)</th>
                    <th className="border border-gray-300 px-4 py-2">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((size) => (
                    <tr key={size.size}>
                      <td className="border border-gray-300 px-4 py-2">{size.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{size.chest}</td>
                      <td className="border border-gray-300 px-4 py-2">{size.waist}</td>
                      <td className="border border-gray-300 px-4 py-2">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className="text-xl font-semibold">Select Size</h4>
              <div className="flex gap-3 mt-2">
                {sizeChart.map((size) => (
                  <Button
                    key={size.size}
                    onClick={() => setSelectedSize(size.size)}
                    className={`${
                      selectedSize === size.size
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    } rounded-full px-4 py-2 text-sm`}
                  >
                    {size.size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
  
        <Separator />
        <div className="max-h-[300px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="grid gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div className="flex gap-4" key={reviewItem._id}>
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{reviewItem?.userName}</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <StarRatingComponent rating={reviewItem?.reviewValue} />
                    </div>
                    <p className="text-muted-foreground">
                      {reviewItem.reviewMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Reviews</h1>
            )}
          </div>
          <div className="mt-10 flex-col flex gap-2">
            <Label>Write a review</Label>
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => setReviewMsg(event.target.value)}
              placeholder="Write a review..."
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  
  );
}

export default ProductDetailsDialog;
