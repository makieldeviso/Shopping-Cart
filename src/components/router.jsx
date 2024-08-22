// React
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Components
import App from './App'
import HomePage from './FrontPage';
import { Profile, PurchaseDisplay } from './Profile';
import { Shop, ShopCatalog, ProductsOnPage, ItemPage, ProductDetails } from './Shop';
import { Cart } from './Cart';
import ErrorPage from './ErrorPage';

// Data fetch
import { shopLoader, cartLoader, profileLoader, pageLoader } from '../utilities/DataFetch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Navigate to='home' replace/>
      },
      // Homepage ----------
      {
        path: 'home',
        element: <HomePage/>,
        loader: pageLoader
      },
      // Profile ----------
      {
        path: 'profile',
        element: <Profile/>,
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
        element: <Shop/>,
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
        element: <Cart/>,
        loader: cartLoader
      },
    ]
  }
])

export default router 