import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getProducts, getProductById, addProduct, updateProduct, removeProduct, addProductMsg, removeProductMsg } from './product.controller.js'

const router = express.Router()



router.get('/', log, getProducts)
router.get('/:id', log, getProductById)
router.post('/', log, addProduct)
router.put('/', updateProduct)
router.delete('/:id', removeProduct)
//Require auth for add, update, delete

router.post('/:id/msg', addProductMsg)
router.delete('/:id/msg/:msgId', removeProductMsg)

export const productRoutes = router