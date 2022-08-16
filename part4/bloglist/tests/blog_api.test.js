const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const Blog = require('../models/blog')
const User = require('../models/user')

const url_API = '/api/blogs'

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)

})

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get(url_API)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get(url_API)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get(url_API)

    const contents = response.body.map(r => r.title)

    expect(contents).toContain(
      'React patterns'
    )
  })

  describe('viewing a specific blog', () => {

    test('succeeds with a valid id', async () => {

      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`${url_API}/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api
        .get(`${url_API}/${validNonexistingId}`)
        .expect(404)

    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`${url_API}/${invalidId}`)
        .expect(400)

    })
  })

  describe('addition of a new blog', () => {
    let token = ''

    beforeAll(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ name: 'root', username: 'root', passwordHash })

      await user.save()

      token = `bearer ${jwt.sign({ username:'root', id: user.id }, process.env.SECRET)}`
    })

    test('succeeds with valid data', async () => {
      const newBlog =
      {
        title: 'New Blog',
        author: 'MIlan',
        url: 'https://newblog.com/',
        likes: 1
      }

      await api
        .post(url_API)
        .send(newBlog)
        .set({ Authorization: token })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      expect(contents).toContain(
        'New Blog'
      )
    })

    test('fails with status code 400 if data invaild', async () => {
      const newBlog =
      {
        author: 'Milan',
        url: 'https://newblog.com/',
        likes: 1
      }

      await api
        .post(url_API)
        .send(newBlog)
        .set({ Authorization: token })
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog =
      {
        author: 'Milan',
        url: 'https://newblog.com/',
        likes: 1
      }

      await api
        .post(url_API)
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {

    let token = ''

    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ name: 'root', username: 'root', passwordHash })

      await user.save()

      token = `bearer ${jwt.sign({ username:'root', id: user.id }, process.env.SECRET)}`

      const newBlog = {
        title: 'new Blog',
        author: 'Author',
        url: 'www.blog.com',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await Blog.find({}).populate('user')

      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`${url_API}/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

      const contents = blogsAtEnd.map(r => r.title)

      expect(contents).not.toContain(blogToDelete.title)
    })

    test('fails with status code 401 if the token is not the correct ', async () => {
      const blogsAtStart = await Blog.find({}).populate('user')

      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`${url_API}/${blogToDelete.id}`)
        .set('Authorization', null)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      const contents = blogsAtEnd.map(r => r.title)

      expect(contents).toContain(blogToDelete.title)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const newBlog = {
        likes:20
      }

      await api
        .put(`${url_API}/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const updatedBlog = blogsAtEnd[0]

      expect(updatedBlog.likes).toBe(20)

    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})