/**
 * Router containing endpoints that access, create and delete Chatroom documents
 */

import express from 'express'

import {
    createChatroom,
    getOnline,
    addMessage,
    getChatrooms,
    getAllChatrooms
} from '../controllers/chatroomController.js'

const router = express.Router()

router.get('/chats', getAllChatrooms)
 
router.get('/chats/:id', getChatrooms)

router.post('/create', createChatroom)

router.get('/online/:id', getOnline)

router.post('/update', addMessage)

export { router as chatroomRoutes}