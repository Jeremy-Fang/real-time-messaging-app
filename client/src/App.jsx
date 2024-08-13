import { useState } from 'react'

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import Login from './routes/root'
import CreateAccount from './routes/CreateAccountPage'
import Messages from './routes/Messages'
import Search from './routes/Search'
import Profile from './routes/Profile'

function App() {
  const [socket, setSocket] = useState(null)

  const router = createBrowserRouter([
    {
      path: '*',
      element: <Navigate to="/login" replace />
    }, {
      path: '/login',
      element: <Login />
    }, {
      path: '/create-account',
      element: <CreateAccount />
    }, {
      path: '/profile',
      element: <Profile />
    }, {
      path: '/messages',
      element: <Messages socket={socket} setSocket={setSocket} />
    }, {
      path: '/search',
      element: <Search socket={socket} />
    }
  ])

  return <RouterProvider router={router} />
}

export default App
