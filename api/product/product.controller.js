import { productService } from './product.service.js'
import { logger } from '../../services/logger.service.js'

export async function getProducts(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
        }
        const products = await productService.query(filterBy)

        res.json(products)
    } catch (err) {
        logger.error('Failed to get products', err)
        res.status(500).send({ err: 'Failed to get products' })
    }
}

export async function getProductById(req, res) {
    try {
        const productId = req.params.id
        const product = await productService.getById(productId)
        res.json(product)
    } catch (err) {
        logger.error('Failed to get product', err)
        res.status(500).send({ err: 'Failed to get product' })
    }
}

export async function addProduct(req, res) {
    const { loggedinUser } = req

    try {
        const product = req.body
        product.owner = loggedinUser
        const addedproduct = await productService.add(product)
        res.json(addedproduct)
    } catch (err) {
        logger.error('Failed to add product', err)
        res.status(500).send({ err: 'Failed to add product' })
    }
}

export async function updateProduct(req, res) {
    try {
        const product = req.body
        const updatedProduct = await productService.update(product)
        res.json(updatedProduct)
    } catch (err) {
        logger.error('Failed to update product', err)
        res.status(500).send({ err: 'Failed to update product' })
    }
}

export async function removeProduct(req, res) {
    try {
        const productId = req.params.id
        const deletedCount = await productService.remove(productId)
        res.send(`${deletedCount} product removed`)
    } catch (err) {
        logger.error('Failed to remove product', err)
        res.status(500).send({ err: 'Failed to remove product' })
    }
}

export async function addProductMsg(req, res) {
    const { loggedinUser } = req
    try {
        const productId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await productService.addProductMsg(productId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update product', err)
        res.status(500).send({ err: 'Failed to update product' })
    }
}

export async function removeProductMsg(req, res) {
    try {
        const { id: productId, msgId } = req.params

        const removedId = await productService.removeProductMsg(productId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove product msg', err)
        res.status(500).send({ err: 'Failed to remove product msg' })
    }
}


