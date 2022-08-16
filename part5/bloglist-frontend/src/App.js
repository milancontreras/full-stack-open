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

      setUser(user)
      setUsername('')
      setPassword('')

    }catch(exception){
      notify('Wrong credentials','alert')
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

  const blogsList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user ? user.name: null} lloged in <button onClick={handleLogout}>logout</button></p> 
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
