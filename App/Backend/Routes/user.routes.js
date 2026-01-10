import express from 'express'
import userController from '../Controllers/user.controller.js'

const router = express.Router()

router.post('/login', userController.handlerLogin)

export default router
