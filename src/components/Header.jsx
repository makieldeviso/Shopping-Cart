// React
import { useContext, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

// Components
import { NewIcon } from "./Icons"
import { CategoryIcon } from "./Icons"

// Data fetch
import { getProfileData } from "../utilities/DataFetch"

// Context
import { PageContext } from "./App"

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

const PageBanner = function () {
  
  return (
    <div className="page-banner">
      <NavLink to='/'>
        <CategoryIcon assignClass={'logo'} assignAltText={'Page logo'}/>
        <span className="page-title">A-TIER.com</span>
        <span className='page-subtitle'>Physical Games Store</span>
      </NavLink>
    </div>
  )
}

const PageNav = function () {
  const {cartCount, setCartCount, loggedIn} = useContext(PageContext);
  const navigate = useNavigate();

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
        
        <li title='Shop'><NavLink to='shop'>
          <NewIcon assignClass={'shop'}/></NavLink>
        </li>

        
        {loggedIn
          ? 
          <>
            <li title='Cart'><NavLink to='cart'>
              <NewIcon assignClass={'cart'}/></NavLink>
              <p>{cartCount}</p>
            </li>

            <li title='Profile'>
              <NavLink to='profile'><NewIcon assignClass={'profile'}/></NavLink>
            </li>
          </>
          : 
          <li title='Log in' className="login">
            <button onClick={() => navigate('login')}>Log in</button>
          </li>
        }
        
      </ul>
    </nav>
  )
}



export default Header