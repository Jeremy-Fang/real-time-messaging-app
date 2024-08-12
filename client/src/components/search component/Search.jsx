import { useState, useEffect } from 'react'

const SearchPage = ({ socket, openNewConvo }) => {
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [typingQueue, setTypingQueue] = useState([])

    // Create functionality that allows for groups to be formed
    const searchUsers = async (searchKey) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/search/${searchKey}`)
        const data = await response.json()
        const filteredData = data.results.filter(entry => entry._id != sessionStorage.getItem('uid'))

        setSearchResults(filteredData)
    }

    // Function which creates a new chat between the logged in user and the selected user
    const createNewChat = async (i) => {
        const body = {
            members: [sessionStorage.getItem('uid'), searchResults[i]._id]
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatrooms/create`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        socket?.emit('create-room', data.chatroom._id)

        openNewConvo()
    }

    useEffect(() => {
        if (typingQueue.length) {
            typingQueue.forEach(id => {
                clearTimeout(id)
            })
        }
        const nextTypingQueue = [setTimeout(() => {
            setTypingQueue([])
            if (searchTerm != '') {
                searchUsers(searchTerm)
            }
        }, 500)]

        setTypingQueue(nextTypingQueue)
    }, [searchTerm])

    return (
        <>
            <div>
                Start a new conversation
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {
                    searchResults.length > 0
                        ? (
                            searchResults.map((result, i) => {
                                return (
                                    <div className='result-row' onClick={() => createNewChat(i)}>
                                        {result.name}
                                    </div>
                                )
                            })
                        ) : (
                            <div>
                                no matches found
                            </div>
                        )
                }
            </div>
        </>
    )
}

export default SearchPage