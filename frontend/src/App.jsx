import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
            <Route path="/orders" element={<Layout><ProtectedRoute><Orders /></ProtectedRoute></Layout>} />
            <Route path="/orders/:id" element={<Layout><ProtectedRoute><OrderDetail /></ProtectedRoute></Layout>} />
            <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
            <Route path="/admin" element={<Layout><ProtectedRoute adminOnly><Admin /></ProtectedRoute></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
