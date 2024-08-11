import express from 'express'
import cors from 'cors'
import http from 'http'

import { userRoutes } from '../routes/users.js'
import { chatroomRoutes } from '../routes/chatroom.js'

const createServer = () => {
    const app = express()

    app.use(express.json())

    // allow connection from any origin
    app.use(cors({
        origin: '*'
    }))

    app.use((req, res, next) => {
        console.log(req.path, req.method)
        next()
    })

    // routes
    app.use('/api/users', userRoutes)
    app.use('/api/chatrooms/', chatroomRoutes)

    const httpServer = http.createServer(app)

    return httpServer
}

export default createServer