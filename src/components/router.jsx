// React
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Components
import App from './App'
import { Main, PageDisplay } from './PageMain';
import HomePage from './FrontPage';
import { Profile, PurchaseDisplay } from './Profile';
import { Shop, ShopCatalog, ItemPage } from './Shop';
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
        element: <Navigate to='Home' replace/>
      },

      {
        path: 'Home',
        element: <HomePage/>,
        loader: pageLoader
      },

      {
        path:'main',
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
                loader: shopLoader,
                children: [
                  {
                    index: true,
                    element: <Navigate to='catalog' replace/>
                  },
                  {
                    path: 'catalog',
                    element: <ShopCatalog/>,
                    
                  },
                  {
                    path: 'catalog/:id',
                    element: <ItemPage/>,
                   
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