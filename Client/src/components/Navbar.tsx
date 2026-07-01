import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

interface navbarProps {
  showcart?: boolean;
  showdashboard?: boolean;
}

export default function Navbar({ showcart = true, showdashboard = false }: navbarProps) {
  const cartItems = useSelector((state: RootState) => state.cart.list);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-emerald-600 tracking-wider cursor-pointer">
              FUZZ MART
            </span>
          </div>

          <div>
            <ul className="flex items-center space-x-8">
              {showdashboard && (
                <li>
                  <NavLink 
                    className={({ isActive }) => isActive ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 cursor-pointer' : 'text-gray-600 hover:text-emerald-600 font-medium cursor-pointer transition'} 
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink 
                  className={({ isActive }) => isActive ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 cursor-pointer' : 'text-gray-600 hover:text-emerald-600 font-medium cursor-pointer transition'} 
                  to="/shop"
                >
                  Shop
                </NavLink> 
              </li>
            </ul>
          </div>

          {showcart && (
            <div>
              <ul>
                <li className="flex items-center">
                  <NavLink 
                    className={({ isActive }) => 
                      `flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition ${
                        isActive 
                          ? 'relative bg-mist-900 text-amber-50 hover:bg-mist-700' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`
                    } 
                    to="/cart"
                  >
                    <span>🛒</span>
                    <span>Cart</span>
                    <span className="bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItemsCount}
                    </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}