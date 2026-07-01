import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
interface CartState {
  list: CartItem[];
}

const initialState: CartState = {
  list : [
    {_id: "6a2c53f971acc2807337de03", title: "Aero Sport Shoes", price: 85, imageUrl: "https://i.imgur.com/FxLRYPN.jpeg", quantity: 1}
  ]
}

const cartSlice = createSlice({
  name : 'cartItems',
  initialState, 
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.list.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.list.push({...action.payload, quantity: 1});
      }
    },
    deleteCart: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(cartItem => cartItem._id !== action.payload);
    }
  }
})

export const { addToCart, deleteCart } = cartSlice.actions;
export default cartSlice.reducer;