import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId
})

var Session = mongoose.model("Session", sessionSchema)

export default Session