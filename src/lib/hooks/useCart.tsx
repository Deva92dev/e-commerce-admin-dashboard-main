import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { ProductType } from "../types";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  sizes?: string;
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (_id: string) => void;
  increaseQuantity: (_id: string) => void;
  decreaseQuantity: (_id: string) => void;
  clearCart: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [], // initial data
      addItem: (data: CartItem) => {
        const { item, quantity, color, sizes } = data;
        const currentItems = get().cartItems; // items already in cart
        const existingItem = currentItems.find(
          (cartItem) => cartItem.item._id === item._id
        );
        if (existingItem) {
          return toast("Item is already in the cart", { icon: "🛒" });
        }

        set({ cartItems: [...currentItems, { item, quantity, color, sizes }] });
        toast.success("Items added to the cart", { icon: "🛒" });
      },
      //   remove items from cart
      removeItem: (_id: String) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.item._id !== _id
        );
        set({ cartItems: newCartItems });
        toast.success("Item removed from the cart");
      },
      // increase quantity
      increaseQuantity: (_id: String) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === _id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Item quantity increased");
      },
      // decrease quantity
      decreaseQuantity: (_id: String) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === _id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Item quantity decreased");
      },
      //   clear item from cart
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


export default useCart;