const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <b><p>total of {sum} exercises </p></b>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  
  return <>
    {parts.map(part => (
      <Part key={part.id}
      part={part} 
    />
    ))}
  </>
}

const Course =({course})=>{
  const parts = course.parts
  const sum = parts.reduce((sum, part) => sum + part.exercises, 0)
  return   <div>
  <Header course={course.name} />
  <Content parts={course.parts} />
  <Total sum={sum}/>
</div>
}

const Courses = ({courses})=>{
  return (
    <>
    {courses.map(course => {
    return (<Course key={course.id} course={course}></Course>)
    })}
    </>
  )
}

export default Courses