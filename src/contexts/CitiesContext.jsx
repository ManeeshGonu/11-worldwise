import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'

const BASE_URL = 'http://localhost:9000'

const CitiesProvider = createContext()

const initialState = {
  cities:[],
  isLoading: false,
  currentCity: {},
  error: ""   
}

function reducer (state, action ){
 switch(action.type){

  case "loading":
    return {...state, isLoading: true}

  case "cities/loaded":
    return {
      ...state, isLoading: false, currentCity: action.payload
    }

    case "city/loaded":{
      return{
        ...state, isLoading: false, currentCity: action.payload
      }
    }

    case "city/created":
       return {...state, isLoading: false, cities: [...state.cities, action.payload],currentCity: action.payload}

    case "city/deleted":
      return {...state, isLoading: false, cities: state.cities.filter((each=> each.id !== action.payload)), currentCity: {}}

    case "rejected":
     return {
      ...state, isLoading: false, error: action.payload
     }

    default:
      throw new Error("Unknown action type")
 }



}

const CitiesContext = ({children}) => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const {isLoading, cities, currentCity} = state

    // const [cities, setCities] = useState([])
    // const [isLoading , setIsLoading] = useState(true)
    // const [currentCity, setCurrentCity] = useState({})

useEffect(()=> {
  const fetchCities = async ()=> {
    try {
      dispatch({type: "loading"})
      const response = await fetch(`${BASE_URL}/cities`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch({type: "cities/loaded", payload: data})
    } catch  {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data..."
      })
    } 
  }

  fetchCities();
 
},[])


async function getCity(id) {

  if (id === currentCity.id) return

  // console.log(id, currentCity.id)

   dispatch({type: "loading"})
    try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
      const data = await response.json();
       dispatch({type: "city/loaded", payload: data})
    } catch (error) {
        dispatch({type: "rejected", payload:"Error Getting city data"})
        console.error('There has been a problem with your fetch operation:', error);
    }
}

  async function createCity(newCity) {
    dispatch({type: "loading"})
    try {
        const response = await fetch(`${BASE_URL}/cities/`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers : {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        dispatch({type: "city/created", payload: data})
    } catch  {
        dispatch({type:"rejected", payload: "There was on error loading the data"})
    } 
}

async function deleteCity(id) {
      dispatch({type: "loading"})

    try {
        const response = await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        dispatch({type: "city/deleted", payload: id})
        console.log(data)
       
    } catch  {
         dispatch({type: "rejected", payload:"There was an error deleting city" })
    } 
}

  return (
    <CitiesProvider.Provider value={{isLoading, cities, currentCity, getCity, createCity, deleteCity}}>
        {children}
    </CitiesProvider.Provider>
  )
}

function useCities () {
  const context = useContext(CitiesProvider);
  if (context === undefined) {
    throw new Error('useCities must be used within a CitiesProvider');
  }

  return context;
}

export {CitiesContext, useCities}