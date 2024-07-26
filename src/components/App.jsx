import { useState, createContext, useRef } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export const CartContext = createContext([])

const App = function () {

  const cartData = useRef([]);

  return (
    <CartContext.Provider value={cartData}>
      <Header/>
      <Outlet/>
    </CartContext.Provider>
  )
}

export default App