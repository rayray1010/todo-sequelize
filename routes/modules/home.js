const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.use('/', async (req, res) => {
  const userId = req.user.id
  try {
    const todos = await Todo.findAll({
      where: { userId },
      raw: true,
      nest: true,
    })
    res.render('index', { todos })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
