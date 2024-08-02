import { useState, createContext, useRef } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export const ShoppingContext = createContext({});

const App = function () {

  const cartData = useRef([]);
  const forShipData = useRef([]);

  return (
    <ShoppingContext.Provider value={{cartData, forShipData}}>
      <Header/>
      <Outlet/>
    </ShoppingContext.Provider>
  )
}

export default App