import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle]=useState('')
  const [author, setAuthor]=useState('')
  const [url, setUrl]=useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }




  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value = {title}
            name = "title"
            onChange = {({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value = {author}
            name = "author"
            onChange = {({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value = {url}
            name = "url"
            onChange = {({ target }) => setUrl(target.value)}
          />
        </div>




        <button>create</button>
      </form>
    </div>
  )
}

export default BlogForm