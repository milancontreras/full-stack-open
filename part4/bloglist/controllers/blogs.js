const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({}).populate('user',{username:1, name:1 ,id:1})
    response.json(blogs)
  }catch(exception){
    next(exception)
  } 
})

blogsRouter.get('/:id', async (request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if(blog){
      response.json(blog)
    }else{
      response.status(404).end()
    }
    
  }catch(exception){
    next(exception)
  } 
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.find({})
  const firstUser = user[0]

  console.log(firstUser)
  console.log(firstUser._id.toString())

  const newBlog = new Blog(
    {
      title: body.title ,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: firstUser._id
    }
  )

  

  try{
    const savedBlog = await newBlog.save()
    firstUser.blogs = firstUser.blogs.concat(savedBlog._id)
    await firstUser.save()

    response.status(201).json(savedBlog)
  }catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{
    const blog = await Blog.findByIdAndRemove(request.params.id)
    if(blog){
      response.status(204).end()
    }else{
      response.status(404).end()
    }
  }
  catch(exception){
    next(exception)
  }
} )

blogsRouter.put('/:id', async (request,response,next) => {
  try{
    const body = request.body

    if((body['likes'] === undefined) || body['likes'] < 0){
      response.status(400).end()
    }


    const result = await Blog.findByIdAndUpdate(request.params.id, body , {new: true} )

    if(result){
      response.status(200).json(result)
    }else{
      response.status(404).end()
    }

  }catch(exception){
    next(exception)
  }
})

module.exports = blogsRouter