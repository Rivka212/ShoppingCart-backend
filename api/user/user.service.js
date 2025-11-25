import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
// import { reviewService } from '../review/review.service.js'
import { ObjectId } from 'mongodb'

export const userService = {
    add, // Create (Signup)
    getById, // Read (Profile page)
    update, // Update (Edit profile)
    remove, // Delete (remove user)
    query, // List (of users)
    getByCriteria, // Used for Login
}
const COLLECTION_NAME = 'user'

async function query() {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        var users = await collection.find({}).toArray()
        users = users.map(user => {
            delete user.password
            delete user.username
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne(criteria)
        delete user.password
        delete user.username
        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByCriteria(username, password) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne({ username, password })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(userToSave) {
    try {
        const { _id } = userToSave
        const criteria = { _id: ObjectId.createFromHexString(_id) }
        delete userToSave._id
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.updateOne(criteria, { $set: userToSave })
        userToSave._id = _id
        delete userToSave.password
        delete userToSave.username
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${userToSave._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
        }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}
