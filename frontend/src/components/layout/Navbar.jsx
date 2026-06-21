import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shirt, Shuffle, BookOpen, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/wardrobe', label: 'Mi Armario', icon: Shirt },
  { to: '/randomizer', label: 'Sortear Outfit', icon: Shuffle },
  { to: '/saved-outfits', label: 'Guardados', icon: BookOpen },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
            mi<span className="text-violet-600">armario</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className={`p-2 rounded-lg transition-colors ${location.pathname === '/profile' ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'}`}>
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Ingresar</Link>
                <Link to="/register" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">Registro</Link>
              </div>
            )}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && user && (
          <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600">
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
