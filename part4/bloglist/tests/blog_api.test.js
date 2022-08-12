const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { clone } = require('lodash')

const url_API = '/api/blogs'

beforeEach(async () => {
  await Blog.deleteMany({})

  // let blogObject = new Blog(helper.initialBlogs[0])
  // await blogObject.save()

  // blogObject = new Blog(helper.initialBlogs[1])
  // await blogObject.save()

  // blogObject = new Blog(helper.initialBlogs[2])
  // await blogObject.save()

  // blogObject = new Blog(helper.initialBlogs[3])
  // await blogObject.save()

  // blogObject = new Blog(helper.initialBlogs[4])
  // await blogObject.save()

  // blogObject = new Blog(helper.initialBlogs[5])
  // await blogObject.save()

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)

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
      const result = await api
        .get(`${url_API}/${validNonexistingId}`)
        .expect(404)

    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      const result = await api
        .get(`${url_API}/${invalidId}`)
        .expect(400)

      console.log('result: ',result)
    })
  })

  describe('addition of a new blog', () => {

    test('succeeds with valid data', async () => {
      const newBlog = 
      {
        title: "New Blog",
        author: "MIlan",
        url: "https://newblog.com/",
        likes: 1
      }
  
      await api
        .post(url_API)
        .send(newBlog)
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
        author: "Milan",
        url: "https://newblog.com/",
        likes: 1
      }
  
      await api
        .post(url_API)
        .send(newBlog)
        .expect(400)
  
      const blogsAtEnd = await helper.blogsInDb()
  
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
  
      await api
        .delete(`${url_API}/${blogToDelete.id}`)
        .expect(204)
  
      const blogsAtEnd = await helper.blogsInDb()
  
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  
      const contents = blogsAtEnd.map(r => r.title)
  
      expect(contents).not.toContain(blogToDelete.title)
    })
  })

})

// describe('GET', () => {

//   test('blogs are returned as json', async () => {
//     await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })

//   test('all blogs are returned', async () => {
//     const response = await api.get('/api/blogs')
//     expect(response.body).toHaveLength(helper.initialBlogs.length)
//   })


//   test('property id instead o _id', async () => {
//     const response = await api.get('/api/blogs')
//     const contents = response.body
    
//     for(const blog of contents){
//       console.log(blog)
//       expect(blog.id).toBeDefined()
//     }
//   })
// })

// describe('POST', () => {

//   test('a blog is returned as json', async () => {
//     const newBlog = new Blog(
//       {
//         title: "New Blog",
//         author: "MIlan",
//         url: "https://newblog.com/",
//         likes: 1
//       }
//     )

//     await api.post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)
//   })

//   test('a valid blog can be added', async () => {
//     const newBlog = 
//       {
//         title: "New Blog",
//         author: "MIlan",
//         url: "https://newblog.com/",
//         likes: 1
//       }
    

//     await api.post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)


//     const blogsAtEnd = await helper.blogsInDb()
//     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

//     const contents = blogsAtEnd.map( blog => blog.title)

//     expect(contents).toContain(
//       'New Blog'
//     )

//   })

//   test('a blog with out the likes parameter', async () => {
//     const newBlog = 
//       {
//         title: "New Blog",
//         author: "MIlan",
//         url: "https://newblog.com/",
//       }
    

//       await api.post('/api/blogs')
//       .send(newBlog)
//       .expect(201)

//       const blogsAtEnd = await helper.blogsInDb()
//       expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
//       const contents = blogsAtEnd.map( blog => blog.likes)
//       expect(contents[(blogsAtEnd.length - 1)]).toBe(0)
//   })

//   test('a blog with out title or url return 400 code', async () => {
//     const newBlog = 
//       {
//         author: "MIlan",
//         url: "https://newblog.com/",
//       }

//       const newBlog2 = 
//       {
//         title: "New Blog",
//         author: "MIlan"
//       }
    

//       await api.post('/api/blogs')
//       .send(newBlog)
//       .expect(400)

//       await api.post('/api/blogs')
//       .send(newBlog2)
//       .expect(400)
//   })
// })

afterAll(() => {
  mongoose.connection.close()
})