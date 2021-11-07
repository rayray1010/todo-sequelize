const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const home = require('./modules/home')
const todo = require('./modules/todo')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')

router.use('/users', user)
router.use('/auth', auth)
router.use('/todos', authenticator, todo)
router.use('/', authenticator, home)
module.exports = router
