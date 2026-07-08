import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// State type
type WishlistState = {
  products: string[];
};

// Initial state with type
const initialState: WishlistState = {
  products: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // toggle wishlist (payload = productId)
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      if (state.products.includes(id)) {
        state.products = state.products.filter((p) => p !== id);
      } else {
        state.products.push(id);
      }
    },

    // set full wishlist (payload = array of ids)
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.products = action.payload;
    },

    // optional: clear wishlist
    clearWishlist: (state) => {
      state.products = [];
    },
  },
});

// Export actions
export const { toggleWishlist, setWishlist, clearWishlist } =
  wishlistSlice.actions;

// Export reducer
export default wishlistSlice.reducer;