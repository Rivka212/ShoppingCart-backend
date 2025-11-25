import express from 'express'

import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/', updateUser)
router.delete('/:id', deleteUser)

//Require auth?

export const userRoutes = router