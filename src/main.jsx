// React
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// Styles
import './styles/index.css'
import './styles/smallScreenMedia.css'
import './styles/mediumScreenMedia.css'


import router from './components/router'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
