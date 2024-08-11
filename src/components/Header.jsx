// React
import { useContext, useState } from "react"
import { NavLink } from "react-router-dom"

// Components
import { NewIcon } from "./Icons"

// Data fetch
import { getProfileData } from "../utilities/DataFetch"

// Context
import { CartCountContext } from "./App"

const PageBanner = function () {
  return (
    <div className="page-banner">
      <h1 className='page-title'>
        <NavLink to='/'>Shop Online</NavLink>
      </h1>
    </div>
  )
}

const PageNav = function () {

  const {cartCount, setCartCount} = useContext(CartCountContext);

  useState(() => {
    const assignCountData = async () => {
      const profileData = await getProfileData();
      const count = profileData.cart.length;
      setCartCount(count);
    }
    assignCountData();
  }, []);

  return(
    <nav className="page-nav">
      <ul>
        <li title='Profile'>
          <NavLink to='main/pages/profile'><NewIcon assignClass={'profile'}/></NavLink>
        </li>
        <li title='Shop'><NavLink to='main/pages/shop'>
          <NewIcon assignClass={'shop'}/></NavLink>
        </li>
        <li title='Cart'><NavLink to='main/pages/cart'>
          <NewIcon assignClass={'cart'}/></NavLink>
          <p>{cartCount}</p>
        </li>
      </ul>
    </nav>
  )
}

const Header = function () {
  return (
    <header>
      <div className="header-cont">
        <PageBanner/>
        <PageNav/>
      </div>
    </header>
  )
}

export default Header