import { useState, createContext, useRef, useContext } from "react";
import Header from "./Header";
import { Outlet, useLoaderData } from "react-router-dom";

const App = function () {

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default App