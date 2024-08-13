import React from 'react'
import '../assets/styles/login.css'

import { useNavigate } from 'react-router-dom'

const CreateAccount = () => {
    const navigate = useNavigate()

    // Function which checks if the form fields are valid
    const isValid = () => {
        const fields = document.getElementsByTagName('input')
        let valid = true

        for (var field of fields) {
            if (field.value == '') {
                valid = false
                field.classList.add('invalid-input')
            } else {
                field.classList.remove('invalid-input')
            }
        }

        return valid
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
          navigate('/login')
        }
    }

    return (
        <div className='page-container'>
            <div className='form-container'>
                <input placeholder='Name' />
                <input placeholder='Email' />
                <input placeholder='Password' />
                <button onClick={() => attemptCreateAccount(getFormDetails())}>Create Account</button>
                <div className='sub-text-group'>
                    <div>Already have an account?</div>
                    <a onClick={() => navigate('/login')}>Login</a>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount