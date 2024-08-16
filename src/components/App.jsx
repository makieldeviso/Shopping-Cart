// React
import { useState, createContext, useRef, useEffect } from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

import { getProductsData } from "../utilities/DataFetch";

// Components
import Header from "./Header";

export const PageContext = createContext();

const App = function () {
  const [cartCount, setCartCount] = useState(0);
  const navigation = useNavigation();

  return (
    <PageContext.Provider value={{ cartCount, setCartCount }}>
      <Header/>
      <Outlet/>
      {navigation.state === 'loading' && <LoadingScreen/>}
    </PageContext.Provider>
  )
}

export default App