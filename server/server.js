import 'dotenv/config'
import mongoose from 'mongoose'
import createServer from './utils/server.js'
import init from './utils/socket.js'

const app = createServer()
const socket = init(app)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
        console.log(`connected to database & listening on port ${ process.env.PORT }`)
    })
})