// React
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Components
import App from './App'

import {PurchaseDisplay } from './Profile';
import { ShopCatalog, ProductsOnPage, ItemPage, ProductDetails } from './Shop';
import ErrorPage from './ErrorPage';

const HomePage = lazy(() => import('./FrontPage'));
const Profile = lazy(() => import('./Profile'));
const Shop = lazy(() => import('./Shop'));
const Cart = lazy(() => import('./Cart'));
const LogIn = lazy(() => import('./LogIn'));

// Data fetch
import { shopLoader, cartLoader, profileLoader, pageLoader } from '../utilities/DataFetch';
import { LoadingScreen } from './LoadingScreen';

const routesArr = [
  {
    path: '/',
    element:  <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Navigate to='home' replace/>
      },
      // Homepage ----------
      {
        path: 'home',
        element: 
          <Suspense fallback={<LoadingScreen/>}>
            <HomePage/>
          </Suspense>,
        loader: pageLoader
      },
      // Profile ----------
      {
        path: 'profile',
        element: 
          <Suspense fallback={<LoadingScreen/>}>
            <Profile/>
          </Suspense>,
        loader: profileLoader,  
        children: [
          {
            index: true,
            element: <Navigate to='to-ship' replace/>
          },
          {
            path: ':displayid',
            element: <PurchaseDisplay/>
          }
        ]
      },
      // Shop ----------
      {
        path: 'shop',
        element: 
          <Suspense fallback={<LoadingScreen/>}>
            <Shop/>
          </Suspense>,
        loader: shopLoader,
        children: [
          {
            index: true,
            element: <Navigate to='catalog' replace/>
          },
          {
            path: 'catalog',
            element: <ShopCatalog/>,
            children: [
              {
                index: true,
                element: <Navigate to='page_1' replace/>
              },

              {
                path: ':category?/:catalogPage',
                element: <ProductsOnPage/>
              },
            ]
          },
          {
            path: 'product',
            element: <ItemPage/>,
            children: [
              {
                path: ':id',
                element: <ProductDetails/>
              }
            ]
          },
        ]
      },

      // Cart ----------
      {
        path: 'cart',
        element: 
          <Suspense fallback={<LoadingScreen/>}>
            <Cart/>
          </Suspense>,
        loader: cartLoader
      },

      // Log in page
      {
        path: 'login',
        element: 
          <Suspense fallback={<LoadingScreen/>}>
            <LogIn/>
          </Suspense>
      }
    ]
  }
]

const router = createBrowserRouter(routesArr);

export default router 
export {routesArr}