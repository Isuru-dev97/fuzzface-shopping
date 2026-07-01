import { useSelector, useDispatch } from 'react-redux';
import { deleteCart } from '../store/cartSlice';
import Navbar from "../components/Navbar";

interface RootState {
  cart: {
    list: Array<{
      _id: string;
      title: string;
      price: number;
      imageUrl: string;
      quantity: number;
    }>;
  };
}

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.list);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-lg font-medium mb-6">Your cart is empty</p>
            <a 
              href="/" 
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Go Back to Shop
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md transition duration-300">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{item.title}</h3>
                    <p className="text-emerald-600 font-extrabold text-md">${item.price}</p>
                    <p className="text-gray-400 text-xs mt-1">Quantity: <span className="font-semibold text-gray-700">{item.quantity}</span></p>
                  </div>

                  <button 
                    onClick={() => dispatch(deleteCart(item._id))}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-200 active:scale-95 shrink-0"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Total Items</span>
                  <span className="font-semibold text-gray-800">{totalItemsCount}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-extrabold text-emerald-600">${totalPrice}</span>
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm active:scale-98">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}