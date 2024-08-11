import mongoose from 'mongoose'

const socketMapSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    socket: String
})

var SocketMap = mongoose.model("Socket Map", socketMapSchema)

export default SocketMap