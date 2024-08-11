/**
 * Module which contains functions for User endpoints
 */
import mongoose from 'mongoose'
import User from '../models/user.js'
import Session from '../models/session.js'
import SocketMap from '../models/socketmap.js'

// GET all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})

        res.status(200).send(users)
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Attempt login and create session token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email, password })

        if (user) {
            const session = await Session.create({ user_id: user._id })

            res.status(200).send({ 'msg': 'successfully logged in',
                                    'token': session._id.toString(),
                                    'user_id': session.user_id })
        } else {
            res.status(200).send({ 'msg': 'no such user exists' })
        }
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Attempt to register socket id to token
export const registerSocket = async (req, res) => {
    try {
        const { user_id, socket } = req.params

        const mapEntry = await SocketMap.create({ user_id, socket })

        res.status(200).send({ 'msg': 'successfully registered socket',
                                'user_id': mapEntry.user_id,
                                'socket': mapEntry.socket
        })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Attemp to delete socket token
export const unregisterSocket = async (req, res) => {
    try {
        const { socket } = req.params
    
        const deleted = await SocketMap.findOneAndDelete({ socket })
    
        res.status(200).send({ deleted })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Attempt logout with a session token and remove from db
export const logout = async (req, res) => {
    try {
        const { token } = req.body

        const session = await Session.deleteOne({ _id: (new mongoose.Types.ObjectId(token)) })

        if (session && session.deleteCount) {
            res.status(200).send({ 'msg': 'session deleted' })
        } else {
            res.status(200).send({ 'msg': 'session does not exist' })
        }
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Create user using properties passed through req.body
export const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body

        const user = await User.create({ email, password, name })

        res.status(200).send({ 'msg': 'user created', user })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Delete a user corresponding to the token passed in req.body
export const deleteUser = async (req, res) => {
    try {
        const { email } = req.body

        const deleted = User.deleteOne({ email })

        res.status(200).send({ 'msg': 'user deleted', deleted })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Search for users whose name contains the search string
export const searchUsers = async (req, res) => {
    try {
        const key = req.params.searchKey

        if (key == undefined) {
            res.status(200).send({ results: [] })
        } else {
            const results = await User.find({
                'name': { '$regex': key }
            }).then(res => {
                return res.map(user => {
                    return { name: user.name, _id: user._id }
                })
            })

            res.status(200).send({ results })
        }
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}