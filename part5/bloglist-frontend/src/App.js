import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/logins'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [title, setTitle]=useState('')
  const [author, setAuthor]=useState('')
  const [url, setUrl]=useState('')
  

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
      blogService.setToken(user.token)
    }
  },[])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async (event) =>{
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    }catch(exception){
      notify('Wrong username or password','alert')
    }
  }

  const handleLogout = () =>{
    window.localStorage.removeItem('loggedBlogappUser')
    window.localStorage.clear()
    setUser(null)

  }

  const loginForm = () => (
    <div>
      <Notification notification={notification} />
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username 
          <input 
            type="text"
            value = {username}
            name = "username"
            onChange = {({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input 
            type="password"
            value = {password}
            name = "password"
            onChange = {({target}) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
    
  )

  const handleCreateBlog = async(event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
      }
      
      try {
        const result  = await blogService.create(newBlog)

        setBlogs([...blogs, result])
        notify(`a new blog ${result.title} by ${result.author}`)
        setTitle('')
        setAuthor('')
        setUrl('')
        
      } catch (error) {
        console.log(error)
        notify(`wrong title, author or url`,'alert')
      }
    
}

  const blogsList = () => (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>{user ? user.name: null} lloged in <button onClick={handleLogout}>logout</button></p> 
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
          title:
          <input 
             type="text"
             value = {title}
             name = "title"
             onChange = {({target}) => setTitle(target.value)}
          />
          </div>
          <div>
          author:
            <input 
              type="text"
              value = {author}
              name = "author"
              onChange = {({target}) => setAuthor(target.value)}
            />            
          </div>
          <div>
          url:
            <input 
                type="text"
                value = {url}
                name = "url"
                onChange = {({target}) => setUrl(target.value)}
            />
          </div>
           
          
          
          
        <button>create</button>
        </form>
        
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null && loginForm()}
      {user !== null && blogsList()}
    </div>
  )
}

export default App
