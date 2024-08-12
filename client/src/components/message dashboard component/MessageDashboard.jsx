import { React, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './styles.css'

import RecentMessageCard from './RecentMessageCard'
import MessageComponent from './MessageComponent'

const MessageDashboard = ({ socket, setSocket, setLoggedIn, changePage }) => {
    const [selected, setSelected] = useState(-1)
    const [chatroomData, setChatroomData] = useState(null)
    const [idMap, setIdMap] = useState(null)
    const [message, setMessage] = useState('')

    const fetchMessagesData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatrooms/chats/${sessionStorage.getItem('uid')}`)
        const responseData = await response.json()

        if (responseData.chatrooms.length > 0) {
            setSelected(0)
        }

        setChatroomData(responseData.chatrooms)
        setIdMap(responseData.memberMap)
        setSocket(io(import.meta.env.VITE_API_URL))
    }

    const sendMessage = () => {
        if (selected != -1) {
            socket?.emit('send-message', sessionStorage.getItem('uid'), chatroomData[selected]._id, message)

            setMessage('')
        }
    }

    // Function that removes tokens from session storage and makes API request to invalidate token
    const logout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
            method: 'POST',
            body: JSON.stringify({ token: sessionStorage.getItem('token') }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            sessionStorage.removeItem('uid')
            sessionStorage.removeItem('token')

            setLoggedIn(false)
            socket?.close()
            changePage('login-page')
        })
    }

    // Upon initial render, retrieve message data corresponding to user
    useEffect(() => {
        fetchMessagesData()
    }, [])

    // Upon socket update, define event listeners to server
    useEffect(() => {
        // Upon connecting to a socket, map the socket id to the user id and join all chatrooms containing that user
        socket?.on('connect', () => {
            socket?.emit('register-socket', sessionStorage.getItem('uid'))

            for (let chatroom of chatroomData) {
                socket?.emit('join-room', chatroom._id)
            }
        })

        // Helper function to request a user join a room (ex. when new convo is created)
        socket?.on('remote-join', (room) => {
            console.log(`I've been requested to join ${room}`)
            socket?.emit('join-room', room)
        })

        // Upon receiving a message, the chatroom data is updated
        socket?.on('receive-message', (room, data) => {
            let updatedData = chatroomData
            let roomIdx = chatroomData.findIndex(chatroom => chatroom._id == room)

            if (roomIdx != -1) {
                updatedData[roomIdx] = data
            } else {
                updatedData.push(data)
            }

            // select selected convo to the latest message received
            setSelected(updatedData.findIndex(chatroom => chatroom._id == room))
            setChatroomData([...updatedData])
        })

        socket?.on('disconnect', async () => {
            console.log(`the connection has been closed`)
        })
    }, [socket])

    if (chatroomData != null) {
        return (
            <>
                <div className='page-container'>
                    <div className='side-bar-container'>
                        <h2>Messages</h2>
                        <div className='new-conversation-group'>
                            <button className='new-conversation-button' onClick={() => changePage('search-page')}>+</button>
                            <div>
                                new conversation
                            </div>
                        </div>
                        <div className='recent-messages-container'>
                            {
                                chatroomData.map((room, i) => {
                                    return <RecentMessageCard members={room.members} messages={room.messages} idMap={idMap} i={i} selected={selected} onCustomClick={() => setSelected(i)} />
                                })
                            }
                        </div>
                        <div className='logout-button-row'>
                            <button className='logout' onClick={logout}>logout</button>
                        </div>
                    </div>
                    <div className='selected-conversation-container'>
                        <div className='message-header-group'>
                            <h2>{
                                selected == -1 ?
                                    null :
                                    (chatroomData[selected].members.length == 2 ?
                                        chatroomData[selected].members.filter(member => {
                                            return member != sessionStorage.getItem('uid')
                                        })
                                        :
                                        chatroomData[selected].members).map(member => {
                                            return idMap[member]
                                        }).join(', ')
                            }</h2>
                        </div>
                        <div className='overflow-container'>
                            <div className='messages-container'>
                                {
                                    selected == -1 ?
                                        null :
                                        chatroomData[selected].messages.map((message) => {
                                            return <MessageComponent message={message} idMap={idMap} />
                                        })
                                }
                            </div>
                        </div>
                        <div className='send-message-group'>
                            <input value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className='send-message-button' onClick={() => sendMessage()}>Send</button>
                        </div>
                    </div>
                    <div className='temp-third-component'>
                        Hello
                    </div>
                </div>
            </>
        )
    }
}

export default MessageDashboard