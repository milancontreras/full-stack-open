import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({text,handleOnClick})=>{

  return(
    <button onClick={handleOnClick}>
      {text}
    </button>
  )
}
const Anecdote = ({type, text, votes})=>{
    return (
      <div>
        <h1>{type}</h1>
        <p1>{text} </p1>
        <p>has {votes} votes</p>
      </div>
    )
}


const App = (props) => {
  const [selected, setSelected] = useState(0)

  const points = { 0: 0, 1: 0, 2: 0, 3: 0 ,4: 0, 5:0 }

  const [votes , setVotes] = useState(points)
  //const keys = Object.keys(points)
  //const values = Object.values(points)
  //const max = Math.max(values)

  const [mostVoted, setMostVoted] = useState(0)


  const handleOnClickNextAnec = () =>{
    const randNum = Math.floor(Math.random()*6)
    return setSelected(randNum);
  }

  const handleOnClickVotes = () =>{
    const copy = {...votes}
    copy[selected] += 1
    if(copy[selected] >= copy[mostVoted]){
      setMostVoted(selected)
    }
    return setVotes(copy)
  }

  return (
    <div>
      <Anecdote type='Anectote of the day' text ={props.anecdotes[selected]} votes = {votes[selected]}> </Anecdote>
      <Button text={'next anecdote'} handleOnClick={handleOnClickNextAnec}> </Button>
      <Button text={'vote'} handleOnClick={handleOnClickVotes}> </Button>
      <Anecdote type='Anectote with most votes' text ={props.anecdotes[mostVoted]} votes = {votes[mostVoted]}> </Anecdote>
      
    </div>
  )
}




const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)