import { React, useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate('/messages')}>
            Hello
        </div>
    )
}

export default Profile