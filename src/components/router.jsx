import App from './App'

import { Main, PageDisplay } from './PageMain';
import Profile from './Profile';
import { Shop, ShopCatalog, ItemPage } from './Shop';
import { Cart } from './Cart';
import ErrorPage from './ErrorPage';

import { createBrowserRouter, Navigate } from 'react-router-dom';

import { itemsLoader, profileLoader, pageLoader } from '../utilities/DataFetch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    loader: pageLoader,
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
                loader: profileLoader
              },
              {
                path: 'shop',
                element: <Shop/>,
                loader: itemsLoader,
                children: [
                  {
                    index: true,
                    element: <Navigate to='catalog' replace/>
                  },
                  {
                    path: 'catalog',
                    element: <ShopCatalog/>
                  },
                  {
                    path: 'catalog/:id',
                    element: <ItemPage/>
                  }
                    
                ]
              },
              {
                path: 'cart',
                element: <Cart/>
              },
            ]
          }
        ]
      }
    ]

  }



])

export default router 