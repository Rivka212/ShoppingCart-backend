import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { notStrictEqual } from 'assert'
import { constants } from 'buffer'
// import { reviewService } from '../review/review.service.js'

export const productService = {
	remove,
	query,
	getById,
	add,
	update,
	addProductMsg,
	removeProductMsg,
}

async function query(filterBy = {}) {
	console.log(filterBy)
	try {
		const criteria = {}
		let sortBy = {}

		if (filterBy.name) criteria.name = { $regex: filterBy.name, $options: 'i' }
		if (filterBy.sortBy) sortBy = { [filterBy.sortBy]: filterBy.desc }

		const collection = await dbService.getCollection('product')
		var products = await collection.find(criteria).sort(sortBy).toArray()
		return products
	} catch (err) {
		logger.error('cannot find products', err)
		throw err
	}
}

async function getById(productId) {
	try {
		var collection = await dbService.getCollection('product')
		const product = await collection.findOne({ _id: ObjectId.createFromHexString(productId) })
		product.createdAt = product._id.getTimestamp()
		return product
	} catch (err) {
		logger.error(`while finding product ${productId}`, err)
		throw err
	}
}

async function remove(productId) {
	try {
		const collection = await dbService.getCollection('product')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(productId) })
		return deletedCount
	} catch (err) {
		logger.error(`cannot remove product ${productId}`, err)
		throw err
	}
}

async function add(product) {
	try {
		const collection = await dbService.getCollection('product')
		await collection.insertOne(product)
		return product
	} catch (err) {
		logger.error('cannot insert product', err)
		throw err
	}
}

async function update(product) {
	try {
		const productToSave = {
			// vendor: product.vendor,
			price: product.price,
		}
		const collection = await dbService.getCollection('product')
		await collection.updateOne({ _id: ObjectId.createFromHexString(product._id) }, { $set: productToSave })
		return product
	} catch (err) {
		logger.error(`cannot update product ${product._id}`, err)
		throw err
	}
}

async function addProductMsg(productId, msg) {
	try {
		msg.id = makeId()

		const collection = await dbService.getCollection('product')
		await collection.updateOne({ _id: ObjectId.createFromHexString(productId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add product msg ${productId}`, err)
		throw err
	}
}

async function removeProductMsg(productId, msgId) {
	try {
		const collection = await dbService.getCollection('product')
		await collection.updateOne({ _id: ObjectId.createFromHexString(productId) }, { $pull: { msgs: { id: msgId } } })
		return msgId
	} catch (err) {
		logger.error(`cannot remove product msg ${productId}`, err)
		throw err
	}
}



