import React from 'react'

const CreateAccountForm = ({ setPageToLogin }) => {
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

  const attemptCreateAccount = async (user) => {
    if (!isValid()) {
      console.log('invalid form input')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/signup`, {
      method: 'POST',
      body: JSON.stringify({ ...user }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.log('error creating account')
      return
    }

    const data = await response.json()

    if (data.user) {
      setPageToLogin()
    }
  }

  return (
    <div className='login-page-container'>
      <div className='login-container'>
        <input placeholder='Name' />
        <input placeholder='Email' />
        <input placeholder='Password' />
        <button onClick={() => attemptCreateAccount(getFormDetails())}>Create Account</button>
        <a onClick={setPageToLogin}>already have an account?</a>
      </div>
    </div>
  )
}

export default CreateAccountForm