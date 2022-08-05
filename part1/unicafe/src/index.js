import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({handleClick, text}) => {
  return(
  <button onClick={handleClick}>
    {text}
  </button>
  )
  }

const Statistics = ({comments}) =>{
  const good = comments.good
  const neutral = comments.neutral
  const bad = comments.bad
  const total = (good + neutral + bad === 'NaN') ? 0 : good + neutral + bad
  const average = (total === 0 ) ? 0 : (good + bad* (-1))/total
  const positive = (total === 0 ) ? 0 : (good * 100)/total

    return(
      <table>
        <Statistic text="good" value ={good} />
        <Statistic text="neutral" value ={neutral} />
        <Statistic text="bad" value ={bad} />
        <Statistic text="all" value ={total} />
        <Statistic text="average" value ={average} />
        <Statistic text="positive" value ={positive} />
      </table>
    )


}
const Statistic = ({text,value}) =>{
  if(text === 'positive'){
    return (<tr>
      <td>{text}</td>
      <td>{value} %</td>     
      </tr>)
  }else{
    return (<tr>
      <td>{text}</td>
      <td>{value}</td>     
      </tr>)
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleOnClickGood = () =>{
    return setGood(good+1);
  }

  const handleOnClickNeutral = () =>{
    return setNeutral(neutral+1);
  }

  const handleOnClickBad = () =>{
    return setBad(bad+1);
  }

  //const total = (good + neutral + bad === 'NaN') ? 0 : good + neutral + bad

  //const average = (total === 0 ) ? 0 : (good + bad* (-1))/total
  //const positive = (total === 0 ) ? 0 : (good * 100)/total

  const comments = {
    'good': good,
    'neutral': neutral,
    'bad': bad
  }
    
      
  return (
    <div>
      <h1>give feedback</h1> 
      <Button 
      handleClick = {handleOnClickGood}
      text = {'good'} ></Button>  

      <Button 
      handleClick = {handleOnClickNeutral}
      text = {'neutral'} ></Button>  

      <Button 
      handleClick = {handleOnClickBad}
      text = {'bad'} ></Button>  
      <h1>statistics</h1>
      {good === 0 && bad === 0 && neutral === 0 ? (
        <p>No feed back given</p>
      ) : (
        <Statistics comments={comments}> </Statistics>
      )}
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)