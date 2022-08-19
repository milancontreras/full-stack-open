import { useState } from 'react'

const Blog = ( { blog, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleOnLike = async () => {
    const newBlog = {
      ...blog,
      likes : (blog.likes + 1),
      user: blog.user.id
    }
    updateLikes(blog.id,newBlog)
  }


  const toggleVisibility = () => {
    setVisible(!visible)
  }


  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>show</button>
      </div>
      <div style={showWhenVisible} className="blogContent">
        {blog.title} {blog.author}<button onClick={toggleVisibility}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes}<button onClick={handleOnLike}>like</button><br/>
        {blog.user.name}<br/>
        <button onClick={() => removeBlog(blog)}>remove</button>

      </div>

    </div>
  )
}

export default Blog