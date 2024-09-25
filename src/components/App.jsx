// React
import { useState, createContext, useRef} from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

// Components
import Header from "./Header";
import Footer from "./Footer";

// Context
export const PageContext = createContext();

const App = function () {
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(true);
  const pathRef = useRef('/');
  const {state} = useNavigation();

  return (
    <PageContext.Provider value={{ cartCount, setCartCount, loggedIn, setLoggedIn }}>
      <Header/>
      <main>
        <Outlet context={{ cartCount, setCartCount, loggedIn, setLoggedIn, pathRef }}/>
      </main>
      <Footer/>
      {state === 'loading' && <LoadingScreen/>}
    </PageContext.Provider>
  )
}

export default App