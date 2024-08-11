import mongoose from 'mongoose'

const message = new mongoose.Schema({
    sender: mongoose.Types.ObjectId,
    message: String,
    time: Date
})

export default message