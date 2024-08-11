/**
 * Module which contains functions for Chatroom endpoints
 */

import mongoose from 'mongoose'

import User from '../models/user.js'
import Chatroom from '../models/chatroom.js'
import SocketMap from '../models/socketmap.js'

// Get all chatrooms
export const getAllChatrooms = async (req, res) => {
    try {
        const chatrooms = await Chatroom.find({})

        res.status(200).send(chatrooms)
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Get all chatrooms where the members array contains an id 
export const getChatrooms = async (req, res) => {
    try {
        const { id } = req.params
        
        const chatrooms = await Chatroom.find({ members: {
            $in: [id]
        }})

        let convoPartnerSet = new Set()

        // createa a set of all id's that are members of conversations with the user
        for (let i = 0; i < chatrooms.length; i++) {
            for (let member of chatrooms[i].members) {
                convoPartnerSet.add(member)
            }
        }

        // maps ids to names of users
        const memberMap = {}
        
        await User.find({ _id: {
            $in: [...convoPartnerSet]
        }}).then(members => {
            if (members) {
                members.forEach(member => {
                    memberMap[member._id] = member.name
                })
            }
        })

        res.status(200).send({ chatrooms, memberMap })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Create chatroom using properties passed through req.body
export const createChatroom = async (req, res) => {
    try {
        const { members } = req.body

        const chatroom = await Chatroom.create({ members })

        res.status(200).send({ 'msg': 'chatroom created', chatroom })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Get the sockets of all chatroom members currently connected
export const getOnline = async (req, res) => {
    try {
        const { id } = req.params
        
        const chatroom = await Chatroom.findOne({ _id: id })
        const sockets = await SocketMap.find({ user_id: {
            $in: chatroom.members
        }})

        res.status(200).send({ sockets })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}

// Add a message to a chatroom
export const addMessage = async (req, res) => {
    try {
        const { id, sender, message } = req.body

        const updated = await Chatroom.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
            $push: { 
                messages: {
                    sender,
                    message,
                    time: new Date()
                }
            }
        }, { new: true})
    
        res.status(200).send({ updated })
    } catch (err) {
        console.error(err)

        res.status(400).send({ 'error': err.message })
    }
}