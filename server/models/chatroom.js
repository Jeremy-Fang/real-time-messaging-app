import mongoose from 'mongoose'
import message from './message.js'

const chatroomSchema = new mongoose.Schema({
    members: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    messages: {
        type: [message],
        default: []
    }
})

var Chatroom = mongoose.model('Chatroom', chatroomSchema)

export default Chatroom