const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
//const { request, response } = require('../app')
const User = require('../models/user')


usersRouter.post('/', async (request, response, next) => {

  try{
    const body = request.body
    if(!body.password || body.password.length < 3){
      response.status(400).json({error: "wrong password format"})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  }catch(exception){
    next(exception)
  } 
})

usersRouter.get('/', async (request, response, next) => {
  try{

    const findedUsers = await User.find({})

    response.json(findedUsers)

  }catch(exception){
    next(exception)
  } 
})

module.exports = usersRouter

