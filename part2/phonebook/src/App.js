import personService from "./services/persons";
import React, { useState, useEffect} from 'react'

const Persons = ({persons,handleDelete})=>{
  return (
    persons.map((person) => (
    <Person 
    key ={person.id} 
    person={person.name} 
    number={person.number} 
    handleDelete={()=>handleDelete(person.id)} 
    ></Person>))
    )
}

const Person = ({person, number, handleDelete})=>{
  //console.log("Desde Person",id)
  return (
  <p>
    {person} {number}
    <button onClick={handleDelete}>delete</button>
  </p>
  )
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
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setFilter ] = useState('')

  useEffect(() => {
    personService
    .getAll()
    .then(returnedPersons => {
      setPersons(returnedPersons)
    })
  }, [])

  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    const inputValue = event.target.value
    setFilter(inputValue)
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        console.log(repetidos.id)
         personService
         .update(repetidos.id,nameObject)
         .then(returnedPerson =>{
          //console.log("ok")
          setPersons(persons.map( (person)=> (person.id !== repetidos.id ? person : returnedPerson) ))

          setNewName("")
          setNewNumber("")
        })
        .catch(()=>{
          //console.log("fail")
        })
        
      }
    }else{
      personService
      .create(nameObject)
      .then( (returnedPerson)=>{
        //console.log(returnedPerson)
        const arrayNames = [...persons, returnedPerson]
        setPersons(arrayNames)
        setNewName("")
        setNewNumber("")
      }
        
      )
      
    }  
  }

  const handleDelete = (id)=>{
    const name = persons.find(person => person.id ===id).name
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .deleteById(id)
      .then( response => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }

    
  }


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
      <h3>Numbers 1</h3>
      <Persons 
        persons={persons.filter(person =>{
          const re = new RegExp(`^${newFilter.toUpperCase()}.*`);
          return person.name.toUpperCase().match(re)
        })}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App