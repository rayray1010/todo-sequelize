const express = require('express')
const router = express.Router()
const user = require('./modules/user')

router.use('/users', user)
router.use('/', (req, res) => {
  res.send('hello world')
})
module.exports = router
