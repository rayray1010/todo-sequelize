const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  console.log(name)
  try {
    await Todo.create({ name, isDone: false, UserId })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const findTodo = await Todo.findByPk(id)
    res.render('detail', { todo: findTodo.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/edit', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  try {
    const findData = await Todo.findOne({
      where: { UserId, id },
    })
    res.render('edit', { todo: findData.toJSON() })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  let { name, isDone } = req.body
  console.log(name, isDone)
  isDone = 'on' === isDone
  try {
    await Todo.update({ name, isDone }, { where: { UserId, id } })
    res.redirect(`/todos/${id}`)
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  try {
    await Todo.destroy({ where: { id, UserId } })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})
module.exports = router
