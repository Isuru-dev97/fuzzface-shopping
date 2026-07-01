import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { addToCart } from '../store/cartSlice'; 
import Navbar from "../components/Navbar";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function Shop() {
  const [shopItems, setShopItems] = useState<Product[]>([]);
  const dispatch = useDispatch();

  const handleAddToCartClick = (selectedProduct: Product) => {
    dispatch(addToCart(selectedProduct)); 
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setShopItems(data);
      } catch (error) {
        console.log("Error fetching store data:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Navbar showdashboard={true} />
      <div className="bg-emerald-800 text-white py-12 px-4 text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Fuzz Mart</h1>
        <p className="text-emerald-100 text-lg">Premium products, delivered straight to your door.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Our Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopItems.map(shopItem => (
            <div key={shopItem._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col">
              <div className="h-56 bg-gray-100 relative">
                <img src={shopItem.imageUrl} alt={shopItem.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-emerald-600 transition cursor-pointer">
                  {shopItem.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 grow">
                  {shopItem.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                  <span className="text-xl font-extrabold text-emerald-600">
                    ${shopItem.price}
                  </span>
                  <button 
                    onClick={() => handleAddToCartClick(shopItem)} 
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}