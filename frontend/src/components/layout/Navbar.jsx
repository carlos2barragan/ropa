import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
            STYLE<span className="text-indigo-600">CO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Productos</Link>
            <Link to="/products?gender=women" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Mujer</Link>
            <Link to="/products?gender=men" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Hombre</Link>
            <Link to="/products?gender=kids" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Niños</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-gray-600 hover:text-indigo-600 transition-colors" title="Panel Admin">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <User size={22} />
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">Ingresar</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Registro</Link>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/products" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link to="/products?gender=women" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Mujer</Link>
            <Link to="/products?gender=men" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Hombre</Link>
            <Link to="/products?gender=kids" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Niños</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
