import { useState } from 'react'

import LoginForm from './components/LoginForm'
import CreateAccountForm from './components/CreateAccountForm'
import MessageDashboard from './components/MessageDashboard'
import SearchPage from './components/Search'

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('login-page')
  const [socket, setSocket] = useState(null)

  // If the user is logged in, redirect to message-dashboard
  if (isLoggedIn) {
    switch (currentPage) {
      case 'search-page':
        return (
          <SearchPage socket={socket} openNewConvo={() => setCurrentPage('message-dashboard')}/>
        )
      default:
        if (currentPage != 'message-dashboard') {
          setCurrentPage('message-dashboard')
        }
        return (
          <MessageDashboard socket={socket} setSocket={setSocket} setLoggedIn={setLoggedIn} changePage={setCurrentPage} />
        )
    }
  } else {
    // If the user is not logged in, toggle between create account and login pages
    switch (currentPage) {
      case 'create-account-page':
        return (
          <CreateAccountForm setPageToLogin={() => setCurrentPage('login-page')} />
        )
      default:
        if (currentPage != 'login-page') {
          setCurrentPage('login-page')
        }
        return (
          <LoginForm login={() => {
            setLoggedIn(true)
          }} setPageCreateAccount={() => setCurrentPage('create-account-page')} />
        )
    }
  }
}

export default App
