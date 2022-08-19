import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import BlogForm from './BlogForm'


test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog}/>
  )
  const inputTitle = component.container.querySelector('input[name="title"]')
  const inputAuthor = component.container.querySelector('input[name="author"]')
  const inputUrl = component.container.querySelector('input[name="url"]')
  const form = component.container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: { value: 'Title example' }
  })
  fireEvent.change(inputUrl, {
    target: { value: 'url example' }
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'Author example' }
  })

  fireEvent.submit(form)


  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Title example' )
  expect(createBlog.mock.calls[0][0].author).toBe('Author example' )
  expect(createBlog.mock.calls[0][0].url).toBe('url example' )

  //expect(createBlog.mock.calls[0][0].content).toBe('testing of forms could be easier' )


})