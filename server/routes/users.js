/**
 * Router containing endpoints that access, create and delete User documents
 */

import express from 'express'

import { 
    getUsers, 
    login, 
    registerSocket,
    unregisterSocket,
    logout, 
    createUser, 
    deleteUser, 
    searchUsers
} from '../controllers/userController.js'

const router = express.Router()

router.get('/', getUsers)

router.post('/login', login)

router.get('/register/:user_id/:socket', registerSocket)

router.delete('/:socket', unregisterSocket)

router.post('/logout', logout)

router.post('/signup', createUser)

router.delete('', deleteUser)

router.get('/search/:searchKey', searchUsers)

export { router as userRoutes }