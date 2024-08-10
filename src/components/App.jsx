// React
import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

// Components
import Header from "./Header";

export const CartCountContext = createContext();

const App = function () {
  const [cartCount, setCartCount] = useState(0);
  
  return (
    <CartCountContext.Provider value={{cartCount, setCartCount}}>
      <Header/>
      <Outlet/>
    </CartCountContext.Provider>
  )
}

export default App