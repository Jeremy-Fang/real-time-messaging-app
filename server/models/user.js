import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String
})

var User = mongoose.model('User', userSchema)

export default User