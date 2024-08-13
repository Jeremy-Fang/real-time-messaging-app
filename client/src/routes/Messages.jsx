import { React, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import '../assets/styles/messages.css'

import { useNavigate } from 'react-router-dom'

import RecentMessageCard from '../components/RecentMessageCard'
import MessageComponent from '../components/MessageComponent'

const Messages = ({ socket, setSocket }) => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(-1)
    const [chatroomData, setChatroomData] = useState(null)
    const [idMap, setIdMap] = useState(null)
    const [message, setMessage] = useState('')

    // Helper function that sorts conversations by last message sent time
    const sortConversationsFunction = (y, x) => {
        let x_time = (x.messages.length == 0 ? -Infinity: new Date(x.messages[x.messages.length-1].time))
        let y_time = (y.messages.length == 0 ? -Infinity: new Date(y.messages[y.messages.length-1].time))

        return x_time - y_time
    }

    const fetchMessagesData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatrooms/chats/${sessionStorage.getItem('uid')}`)
        const responseData = await response.json()

        if (responseData.chatrooms.length > 0) {
            setSelected(0)
        }

        setChatroomData(responseData.chatrooms.sort(sortConversationsFunction))
        setIdMap(responseData.memberMap)
        setSocket(io(import.meta.env.VITE_API_URL))
    }

    const sendMessage = () => {
        if (selected != -1 && message != '') {
            socket?.emit('send-message', sessionStorage.getItem('uid'), chatroomData[selected]._id, message)

            setMessage('')
        }
    }

    // Function that removes tokens from session storage and makes API request to invalidate token
    const logout = async () => {
        if (sessionStorage.getItem('token') != undefined) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
                method: 'POST',
                body: JSON.stringify({ token: sessionStorage.getItem('token') }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                sessionStorage.removeItem('uid')
                sessionStorage.removeItem('token')
            })
        }
        socket?.close()
        navigate('/login')
    }

    // Upon initial render, retrieve message data corresponding to user
    useEffect(() => {
        if (sessionStorage.getItem('token') == undefined) {
            navigate('/login')
        } else {
            fetchMessagesData()
        }
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

            setChatroomData([...updatedData].sort(sortConversationsFunction))
            
            // select selected convo to the latest message received
            setSelected(0)
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
                            <button className='new-conversation-button' onClick={() => navigate('/search')}>+</button>
                            <div>
                                new conversation
                            </div>
                            <button onClick={() => navigate('/profile')}></button>
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
                            <h1>{
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
                            }</h1>
                        </div>
                        <div className='messages-container'>
                            {
                                selected == -1 ?
                                    null :
                                    chatroomData[selected].messages.slice().reverse().map((message) => {
                                        return <MessageComponent message={message} idMap={idMap} />
                                    })
                            }
                        </div>
                        <div className='send-message-group'>
                            <input value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className='send-message-button' onClick={() => sendMessage()}>Send</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Messages