import { useState, createContext, useRef } from "react";
import Header from "./Header";
import { Outlet, useLoaderData } from "react-router-dom";

const App = function () {

  const {profileData, productsData} = useLoaderData();

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default App