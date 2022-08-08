import React, { useState, useEffect} from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Countries = ({countries,setFilteredCountries})=>{

  return (
    countries.map((country) => (<Country setFilteredCountries={setFilteredCountries} data = {country} key ={country.name.common} countryName={country.name.common}></Country>)))
}

const Country = ({countryName, data,setFilteredCountries})=>{

  const handleClick = () =>{
    setFilteredCountries([data])
  }

  return (<p>{countryName}<button onClick={handleClick}>show</button></p>)
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
      <Weather city ={country.capital}></Weather>
    </div>
  )
}


const Weather = ({city})=>{
  const [ weather, setWeather ] = useState({})
  const link = `http://api.weatherstack.com/current`
  +`?access_key=${api_key}`
  +`&query=${city}`

  useEffect(() => {   
    axios 
      .get(link)
      .then(response => {
        console.log("response")
        setWeather(response.data)   
      })
  }, [city,link])

  return (
    <>
    {weather.current ?(
      <div>
        <h2>
        Weather in {city}
        </h2>
        <p><b>temperature: </b>{weather.current.temperature}</p>
        <img src={weather.current.weather_icons[0]} alt="weather image1" />
        <p><b>wind:</b>
        {weather.current.wind_speed} mph 
        direction {weather.current.wind_dir}
        </p>
      </div>      
    ): null}
    
  
    </>
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

  const countriesDisplay = ()=>{
    if(countriesFiltered.length >=10){
      return (<p>Too many matches, specufy another filter</p>)
    }else if(countriesFiltered.length === 1){
      return (<CountryBasicData country={countriesFiltered[0]}></CountryBasicData>)
    }else{
      return (<Countries countries={countriesFiltered} setFilteredCountries={setFilteredCountries}></Countries>)
    }
  }
  
//{countriesFiltered.length >=10 ? <p>Too many matches, specufy another filter</p> : <Countries countries={countriesFiltered}></Countries>}
  return (
    <div className="App">
      <div>
        find countries: <input value ={newFilter} onChange={hadleFilterChange} />
      </div>
      <div>
        {countriesDisplay()}
      </div>
    </div>
  );
}

export default App;
