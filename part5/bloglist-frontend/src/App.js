import { useState, useEffect,useRef  } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/logins'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      //console.log(user)
      blogService.setToken(user.token)
    }
  },[])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const login = async userObject => {
    try{
      const user = await loginService.login(userObject)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    }catch(exception){
      notify('Wrong username or password','alert')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.localStorage.clear()
    setUser(null)

  }

  const updateLikes = async(id, blogObject,user) => {
    try{

      const updatedBlog = await blogService.update(id, blogObject)
      const updatedBlogWithUser = {
        ...updatedBlog,
        user
      }
      //console.log('updatedBlog: ',updatedBlog)
      //console.log('updatedBlogUser: ',updatedBlogWithUser)
      const newBlogs = blogs.map(blog => {
        if(blog.id === updatedBlogWithUser.id){
          return updatedBlogWithUser
        }else{
          return blog
        }
      })
      console.log(newBlogs)
      setBlogs(newBlogs)
    }catch(error){

      notify(`${error.response.data.error}`)
    }
  }

  const addBlog = async( blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const result  = await blogService.create(blogObject)

      const result2 = {
        ...result,
        user:{
          name: user.name
        }
      }


      setBlogs([...blogs, result2])
      notify(`a new blog ${result2.title} by ${result2.author}`)

    } catch (error) {
      //console.log(error)
      notify('wrong title, author or url','alert')
    }
  }

  const removeBlog = async (blogObject) => {
    const ok = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    if (ok) {
      try {
        await blogService.remove(blogObject.id)
        const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
        setBlogs(newBlogs)
        notify('the blog has been successfully removed')

      } catch (error) {
        notify(`${error.response.data.error}`,'alert')
      }
    }


  }


  const blogsList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user ? user.name : null}  {user ? user.id : null}lloged in <button onClick={handleLogout}>logout</button></p>
      <div>
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <h2>create new</h2>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>

      </div>
      {blogs
        .sort((a,b) => b.likes - a.likes )
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} removeBlog={removeBlog}/>
        )}
    </div>
  )

  return (
    <div>
      <Notification notification={notification} />
      {user===null ? (<LoginForm login = {login}/>): blogsList()}

    </div>
  )
}

export default App
