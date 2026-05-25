'use client';
import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  useState,
} from 'react';

// ============================================================
// REDUCER — useReducer-ийн үндсэн logic
// Lecture: "useReducer: for complex state with multiple actions"
// ============================================================
function cartReducer(state, action) {
  switch (action.type) {
    // localStorage-аас ачаалах — LOAD action
    case 'LOAD':
      return action.payload;

    case 'ADD_ITEM': {
      const item = action.payload;

      // ROOM, ADVENTURE — тус бүр өвөрмөц захиалга тул үргэлж шинэ мөр үүсгэнэ
      // (ижил өрөөг өөр өөр огноогоор, өөр хүний тоогоор захиалж болно)
      if (item.type === 'ROOM' || item.type === 'ADVENTURE') {
        return [
          ...state,
          { ...item, cartId: Date.now() + Math.random(), quantity: item.quantity || 1 },
        ];
      }

      // FOOD — ижил хоолыг дахин нэмэхэд тоо нэмэгдэнэ
      // id + type хоёуланг тохируулна (өөр төрлийн id давхцахаас сэргийлнэ)
      const existing = state.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        return state.map(i =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [
        ...state,
        { ...item, cartId: Date.now() + Math.random(), quantity: item.quantity || 1 },
      ];
    }

    // cartId-ээр устгана — id давхцах эрсдэлгүй
    case 'REMOVE_ITEM':
      return state.filter(i => i.cartId !== action.payload);

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // useReducer — серверт болон client-т хоёулаа [] эхлүүлнэ
  // (hydration mismatch-аас зайлсхийхийн тулд lazy init ашиглахгүй)
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Client mount болсны дараа localStorage-аас ачаална
  // Lecture: "useEffect: side effects after render"
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dune_cart');
      if (!saved) return;
      const parsed = JSON.parse(saved);
      // Хуучин cartId-гүй item-д cartId нэмнэ
      const items = parsed.map(i =>
        i.cartId ? i : { ...i, cartId: Date.now() + Math.random() }
      );
      dispatch({ type: 'LOAD', payload: items });
    } catch {
      // хэрэв localStorage corrupted бол хоосон үлдэнэ
    }
  }, []); // зөвхөн mount-д нэг удаа ажиллана

  // localStorage-д хадгална
  useEffect(() => {
    localStorage.setItem('dune_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // useCallback — функцийн reference-г тогтворжуулна, дахин render хийхэд шинэ функц үүсгэхгүй
  // Lecture: "useCallback: memoize a function reference for memo'd children"
  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  // useMemo — render бүрт reduce() дахин ажиллахаас зайлсхийнэ
  // Lecture: "useMemo: cache expensive computation, only recalculates when deps change"
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      cartCount,
    }),
    [cartItems, addToCart, removeFromCart, clearCart, isCartOpen, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
