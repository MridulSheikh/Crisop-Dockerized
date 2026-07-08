import { toast } from "react-toastify";
import { AppDispatch } from "@/redux/store";
import { addToCart } from "@/redux/features/cart/cartSlice";

type AddToCartParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
  dispatch: AppDispatch;
};

export const handleAddToCartUtil = async ({
  product,
  quantity,
  cartItems,
  dispatch,
}: AddToCartParams) => {
  if (product.stock.quantity === 0) {
    toast.error("Out of stock");
    return;
  }

  try {
    const finalPrice =
      product.discountPrice &&
      product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const existingItem = cartItems.find(
      (item) => item.id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.name,
      price: finalPrice,
      quantity,
      image: product.images?.[0]?.url || "",
    };

    dispatch(addToCart(cartItem));

    if (existingItem) {
      toast.info("Cart updated");
    } else {
      toast.success(`${product.name} added to cart`);
    }

    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Failed to add to cart");
    return false;
  }
};