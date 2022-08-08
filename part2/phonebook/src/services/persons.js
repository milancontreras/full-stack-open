import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = ()=>{
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (objectPerson) =>{
  const request = axios.post(baseUrl, objectPerson)
  return request.then( response => response.data)
}

const update = (id,objectPerson)=>{
  const request = axios.put(`${baseUrl}/${id}`,objectPerson)

  return request.then(response => response.data)
}

const deleteById = (id) =>{
  const request = axios.delete(`${baseUrl}/${id}`)

  return request.then( response => {
    return response.data
  })
}

const personService ={getAll, create, deleteById, update}

export default personService