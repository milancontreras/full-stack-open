import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/logins'
import setErrorMessage from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) =>{
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')

    }catch(exception){
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
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
      <p>{user ? user.name: null} lloged in</p>
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
