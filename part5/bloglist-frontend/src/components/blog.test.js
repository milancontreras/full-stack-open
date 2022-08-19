import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import Blog from './Blog'

test('render content and show just the title and the author', () => {
  const blog = {
    title: 'Titlulo de blog',
    author: 'Author 1',
    url: 'www.example.com',
    likes: 5,
    user: {
      name: 'milan'
    }
  }

  const component = render(
    <Blog blog={blog}/>
  )

  //component.debug()

  expect(component.container).toHaveTextContent(
    'Titlulo de blog Author 1'
  )
  const div = component.container.querySelector('.blogContent')
  expect(div).toHaveStyle('display: none')
})

test('clicking the show button shows the url and the likes', () => {

  const blog = {
    title: 'Titlulo de blog',
    author: 'Author 1',
    url: 'www.example.com',
    likes: 5,
    user: {
      name: 'milan'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateLikes={mockHandler}/>
  )

  component.debug()
  const div = component.container.querySelector('.blogContent')
  expect(div).toHaveStyle('display: none')

  const buttonShow = component.getByText('show')
  fireEvent.click(buttonShow)

  component.debug()


  expect(component.container).toHaveTextContent(
    'hide'
  )

  expect(component.container).toHaveTextContent(
    'likes 5'
  )

  expect(component.container).toHaveTextContent(
    'www.example.com'
  )

})

test('clicking two times the button likes calls event handler twice', () => {

  const blog = {
    title: 'Titlulo de blog',
    author: 'Author 1',
    url: 'www.example.com',
    likes: 5,
    user: {
      name: 'milan'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateLikes={mockHandler}/>
  )

  const buttonShow = component.getByText('show')
  const button = component.getByText('like')
  fireEvent.click(buttonShow)
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})