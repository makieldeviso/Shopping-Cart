import { NavLink } from "react-router-dom"

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
  return(
    <nav className="page-nav">
      <ul>
        <li><NavLink to='main/pages/profile'>Profile</NavLink></li>
        <li><NavLink to='main/pages/shop'>Shop</NavLink></li>
        <li><NavLink to='main/pages/cart'>Cart</NavLink></li>
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