import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// Helper function to create query params
const createSearchParamsHelper = (filters) =>
  Object.entries(filters)
    .map(([key, value]) =>
      Array.isArray(value) && value.length > 0
        ? `${key}=${encodeURIComponent(value.join(","))}`
        : ""
    )
    .filter(Boolean)
    .join("&");

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState(() => JSON.parse(sessionStorage.getItem("filters")) || {});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [searchParams.get("category")]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters && sort) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }
  }, [dispatch, filters, sort]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(sectionId, option) {
    setFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters };
      if (!updatedFilters[sectionId]) {
        updatedFilters[sectionId] = [option];
      } else {
        const index = updatedFilters[sectionId].indexOf(option);
        index === -1 ? updatedFilters[sectionId].push(option) : updatedFilters[sectionId].splice(index, 1);
      }
      sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId, totalStock) {
    let existingCartItems = cartItems.items || [];
    const existingItem = existingCartItems.find((item) => item.productId === productId);

    if (existingItem && existingItem.quantity + 1 > totalStock) {
      return toast({ title: `Only ${existingItem.quantity} quantity can be added for this item`, variant: "destructive" });
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList?.map((product) => (
            <ShoppingProductTile key={product.id} product={product} handleGetProductDetails={handleGetProductDetails} handleAddtoCart={handleAddtoCart} />
          ))}
        </div>
      </div>
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingListing;
