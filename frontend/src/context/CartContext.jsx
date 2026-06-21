import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const itemCount = cart?.CartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const total = cart?.CartItems?.reduce((sum, i) => sum + i.Product.price * i.quantity, 0) || 0;

  useEffect(() => {
    if (user) fetchCart();
    else setCart(null);
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartService.get();
      setCart(data);
    } catch {}
  };

  const addToCart = async (productId, quantity, size, color) => {
    try {
      setLoading(true);
      const { data } = await cartService.addItem({ productId, quantity, size, color });
      setCart(data);
      toast.success('Agregado al carrito');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al agregar');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, { quantity });
      fetchCart();
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      fetchCart();
      toast.success('Producto eliminado');
    } catch {}
  };

  const clearCart = async () => {
    try {
      await cartService.clear();
      setCart((prev) => ({ ...prev, CartItems: [] }));
    } catch {}
  };

  return (
    <CartContext.Provider value={{ cart, itemCount, total, loading, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
