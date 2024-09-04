// React
import { useState, createContext } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

// Components
import Header from "./Header";
import Footer from "./Footer";

// Context
export const PageContext = createContext();

const App = function () {
  const [cartCount, setCartCount] = useState(0);
  const navigation = useNavigation();
  
  return (
    <PageContext.Provider value={{ cartCount, setCartCount }}>
      <Header/>
      <main>
        <Outlet context={{ cartCount, setCartCount }}/>
      </main>
      <Footer/>
      {navigation.state === 'loading' && <LoadingScreen/>}
    </PageContext.Provider>
  )
}

export default App