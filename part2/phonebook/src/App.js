import React, { useState, useEffect} from 'react'
import axios from 'axios'

const Persons = ({persons})=>{
  return (
    persons.map((person) => (<Person key ={person.id} person={person.name} number={person.number}></Person>)))
}

const Person = ({person, number})=>{
  return (<p>{person} {number}</p>)
}

const Filter =({value, onChange}) => {
  return (
    <p>
      filter shown with: <input value= {value} onChange={onChange}/>
    </p>
    )
}

const PersonForm =({onSubmit,valueName,valueNumber,onChangeName,onChangeNumber})=>{
  return (
    <div>
      <form onSubmit={onSubmit}>       
        <div>
          name: <input value = {valueName} onChange={onChangeName}/>
        </div>
        <div> 
        number: <input value= {valueNumber} onChange={onChangeNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>

  )
}
const App = () => {
  const [ persons, setPersons ] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [filteredPersons , setFilteredPersons] =useState(persons)  
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setFilter ] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    const inputValue = event.target.value
    setFilter(inputValue)
    //console.log("nuevo: "+inputValue)
    const re = new RegExp(`^${inputValue.toUpperCase()}.*`);
    const list = persons.filter(person =>{
      if(person.name.toUpperCase().match(re)){
        console.log("nombre: "+person.name)
      }
      return (
        person.name.toUpperCase().match(re)
      )
    })
    // console.log('newFilter :>> ', inputValue);
    // console.log('re :>> ', re);
    // console.log('list :>> ', JSON.stringify(list));
    setFilteredPersons(list)

  }

  const addName = (event) => {
    event.preventDefault();
    const nameObject ={
      name: newName,
      number: newNumber
    }
    
    const repetidos = persons.find(persons=>{
      return persons.name === nameObject.name
    })

    if(repetidos !== undefined){
      alert(`${newName} is already added to phonebook`)
    }else{
      const arrayNames = [...persons, nameObject]
      setPersons(arrayNames)
      setNewName("")
      setNewNumber("")
    }
   
  }


  const personsToDisplay = (newFilter === '' ? persons : filteredPersons)

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value= {newFilter} onChange={handleFilterChange}/>

      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addName} 
        valueName = {newName} 
        valueNumber= {newNumber} 
        onChangeName={handleNameChange} 
        onChangeNumber={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons persons={personsToDisplay}
      />

    </div>
  )
}

export default App