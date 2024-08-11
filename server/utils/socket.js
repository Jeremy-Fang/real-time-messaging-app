import { Server } from 'socket.io'

const init = (server) => {
    let io = new Server(server, { cors: { origin: '*' }})
    
    io.on('connection', (socket) => {
        // need to create map of sessions to socketid
        socket.on('register-socket', async (uid) => {
            const response = await fetch(`http://localhost:3000/api/users/register/${uid}/${socket.id}`)
            const data = await response.json()

            console.log(`${data.user_id} has connected on socket ${data.socket}`)
        })

        socket.on('create-room', async (room) => {
            const members = await (await fetch(`http://localhost:3000/api/chatrooms/online/${room}`)).json()
            for (let member of members.sockets) {
                console.log(member)
                io.to(member.socket).emit('remote-join', room)
            }
        })

        socket.on('join-room', (room) => {
            socket.join(room)
            console.log(`${socket.id} joined ${room}`)
        })

        socket.on('send-message', async (sender, room, message) => {
            const response = await fetch('http://localhost:3000/api/chatrooms/update', {
                method: 'POST',
                body: JSON.stringify({ id: room, sender, message }),
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            const data = await response.json()

            io.in(room).emit('receive-message', room, data.updated)

            console.log(`message '${message}' sent by ${sender}`)
        })

        socket.on('disconnect', async () => {
            const response = await fetch(`http://localhost:3000/api/users/${socket.id}`, { method: 'DELETE' })
            const data = await response.json()

            console.log(`${data.deleted.user_id} has disconnected from socket ${data.deleted.socket}`)
        })
    })

    return io
}

export default init