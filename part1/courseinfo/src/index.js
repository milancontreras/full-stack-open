import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  const course = props.course
  return (
    <h1>{course}</h1>
  )
}

const Part = ({name, exercises}) => {
  return (
    <p>{name}  {exercises}</p>
  )
}


const Content = ({parts}) => {
  const [part1, part2, part3] = parts
  return (
    <>
    <Part name={part1.name} exercises={part1.exercises} />
    <Part name={part2.name} exercises={part2.exercises} />
    <Part name={part3.name} exercises={part3.exercises} />
    </>
    
    )
}


const Total = (props) => {
  const total = props.total
  return ( <p>Number of exercises {total}</p>)
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  //sum of exercises in all parts
  const total = course['parts'].reduce((sum, part) => sum + part.exercises, 0)


  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total Number of exercises total={total}/> 
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))