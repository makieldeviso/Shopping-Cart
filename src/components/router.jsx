import App from './App'

import { Main, PageDisplay } from './PageMain';
import { Profile, PurchaseDisplay } from './Profile';
import { Shop, ShopCatalog, ItemPage } from './Shop';
import Header from './Header';

import { Cart } from './Cart';
import ErrorPage from './ErrorPage';

import { createBrowserRouter, Navigate } from 'react-router-dom';

import { shopLoader, cartLoader, profileLoader, pageLoader } from '../utilities/DataFetch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: 'main',
        element: <Main/>,
        children: [
          {
            path: 'pages',
            element: <PageDisplay/>,
            children: [
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
              {
                path: 'shop',
                element: <Shop/>,
                children: [
                  {
                    index: true,
                    element: <Navigate to='catalog' replace/>
                  },
                  {
                    path: 'catalog',
                    element: <ShopCatalog/>,
                    loader: shopLoader,
                  },
                  {
                    path: 'catalog/:id',
                    element: <ItemPage/>,
                    loader: shopLoader,
                  }
                    
                ]
              },
              {
                path: 'cart',
                element: <Cart/>,
                loader: cartLoader
              },
            ]
          }
        ]
      }
    ]

  }



])

export default router 