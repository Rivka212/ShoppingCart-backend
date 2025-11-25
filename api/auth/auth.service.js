import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

export const authService = {
	signup,
	login,
	getLoginToken,
	validateToken,
}

async function login(username, password) {
	// logger.debug(`auth.service - login with username: ${username}`)

	const user = await userService.getByCriteria(username, password)
	if (!user) return null

	// TODO: un-comment for real login
	// const match = await bcrypt.compare(password, user.password)
	// if (!match) return Promise.reject('Invalid username or password')

	delete user.password
	delete user.username
	user._id = user._id.toString()
	return user
}

async function signup({ username, password, fullname }) {
	// const saltRounds = 10

	// logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
	if (!username || !password || !fullname) return Promise.reject('Missing required signup information')

	const userExist = await userService.getByCriteria(username, password)
	if (userExist) return Promise.reject('Username already taken')
	const imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

	// const hash = await bcrypt.hash(password, saltRounds)
	return userService.add({ username, password, fullname, imgUrl })
}

function getLoginToken(user) {
	const userInfo = {
		_id: user._id,
		fullname: user.fullname,
		score: user.score,
		isAdmin: user.isAdmin,
	}
	return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
	try {
		const json = cryptr.decrypt(loginToken)
		const loggedinUser = JSON.parse(json)
		return loggedinUser
	} catch (err) {
		console.log('Invalid login token')
	}
	return null
}