import React, { useState, useEffect} from 'react'
import axios from 'axios'


const Countries = ({countries})=>{

  return (
    countries.map((country) => (<Country key ={country.name.common} country={country.name.common}></Country>)))
}

const Country = ({country})=>{
  return (<p>{country}</p>)
}

const CountryBasicData = ({country})=>{
  //const languagesList = country.languages.map

  const languages = Object.values(country.languages)
  const src = country.flags["png"]
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <h2>languages</h2>
      <ul>
        {languages.map((language,id) => (<li key = {id}>{language}</li>))}
      </ul>     
      <img src={src} alt="flag"></img>
    </div>
  )
}

function App() {

  const [ countries, setCountries ] = useState([])
  const [ countriesFiltered, setFilteredCountries ] = useState([])
  const [ newFilter, setFilter ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const hadleFilterChange = (event) =>{
    const inputValue = event.target.value

    setFilter(inputValue)
    //console.log("nuevo: "+inputValue)

    const re = new RegExp(`${inputValue.toUpperCase()}.*`);
    const list = countries.filter(country =>country.name.common.toUpperCase().match(re))

    setFilteredCountries(list)
  }

  const a = ()=>{
    if(countriesFiltered.length >=10){
      return (<p>Too many matches, specufy another filter</p>)
    }else if(countriesFiltered.length === 1){
      return (<CountryBasicData country={countriesFiltered[0]}></CountryBasicData>)
    }else{
      return (<Countries countries={countriesFiltered}></Countries>)
    }
  }
  
//{countriesFiltered.length >=10 ? <p>Too many matches, specufy another filter</p> : <Countries countries={countriesFiltered}></Countries>}
  return (
    <div className="App">
      <div>
        find countries: <input value ={newFilter} onChange={hadleFilterChange} />
      </div>
      <div>
        {a()}
      </div>
    </div>
  );
}

export default App;
