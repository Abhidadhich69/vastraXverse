import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  error: null,
};

// Fetch all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      console.log("fetchAllFilteredProducts:", filterParams, sortParams);

      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/products/get?${query}`
      );

      console.log("Product Fetch Response:", result.data);
      return result?.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

// Fetch product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/shop/products/get/${id}`
      );

      console.log("Product Details Response:", result.data);
      return result?.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return rejectWithValue(error.response?.data || "Error fetching product details");
    }
  }
);

// Product Slice
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all filtered products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload?.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearProductDetails } = shoppingProductSlice.actions;

// Export reducer
export default shoppingProductSlice.reducer;
