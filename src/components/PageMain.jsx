import PropTypes from 'prop-types'
import { Outlet } from "react-router-dom"

const PageDisplay = function () {
  return (
    <div className="page-display">
      <Outlet/>
    </div>
  )
}

const Main = function () {
  return (
    <main>
      <Outlet/>
    </main>
  )
}

Main.propTypes = {
  storeItems: PropTypes.array
}

export {Main, PageDisplay}