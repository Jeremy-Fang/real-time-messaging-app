import React from 'react'

const LoginForm = ({ login, setPageCreateAccount }) => {
  // Function which checks if the form fields are valid
  const isValid = () => {
    const fields = document.getElementsByTagName('input')

    for (var field of fields) {
      if (field.value == '') {
        return false
      }
    }

    return true
  }

  // Function which returns the form details in a user object
  const getFormDetails = () => {
    const fields = document.getElementsByTagName('input')
    let user = {}

    for (var field of fields) {
      user[field.placeholder.toLowerCase()] = field.value
    }

    return user
  }

  // Makes API request attempting to login the user
  const attemptLogin = async (user) => {
    if (!isValid()) {
      console.log('invalid form input')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({ ...user }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.log('login was not successful')
      return
    }

    const data = await response.json()

    if (data.token) {
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('uid', data.user_id)

      login()
    }
  }

  return (
    <div className='login-page-container'>
      <div className='login-container'>
        <input placeholder='Email' />
        <input placeholder='Password' />
        <button onClick={() => attemptLogin(getFormDetails())}>Log in</button>
        <a onClick={setPageCreateAccount}>create account</a>
      </div>
    </div>
  )
}

export default LoginForm