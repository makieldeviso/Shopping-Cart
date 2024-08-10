import { NavLink } from "react-router-dom"
import { NewIcon } from "./Icons"

import { getProfileData } from "../utilities/DataFetch"
import { useEffect, useRef } from "react"

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

  const profileDataRef = useRef(0);

  // useEffect(() => {
  //   const getProfile = async () => {
  //    const profileData = await getProfileData();
  //    profileDataRef.current = profileData.cart.length;
  //   }
  //   getProfile();
  // },[])
 
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
          <NewIcon assignClass={'cart'}/>
          {/* <p>{profileDataRef.current}</p> */}
        </NavLink></li>
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