import React, { createContext, useContext, useEffect, useState } from 'react'

const BASE_URL = 'http://localhost:9000'

const CitiesProvider = createContext()

const CitiesContext = ({children}) => {

    const [cities, setCities] = useState([])
    const [isLoading , setIsLoading] = useState(true)
    const [currentCity, setCurrentCity] = useState({})

useEffect(()=> {
  const fetchCities = async ()=> {
    try {
      setIsLoading(true)
      const response = await fetch(`${BASE_URL}/cities`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCities(data);
    } catch (error) {
      alert("Error getting cities data")
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchCities();
 
},[])


async function getCity(id) {
    try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCurrentCity(data);
    } catch (error) {
        alert("Error getting city data")
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        setIsLoading(false)
    }
}

  async function createCity(newCity) {
    try {
        setIsLoading(true);
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

        setCities([...cities, data])

        console.log(data)
       
    } catch  {
        alert("There was on error loading the data")
    } finally {
        setIsLoading(false)
    }
}

async function deleteCity(id) {
    try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setCities(cities=> cities.filter(city => city.id !== id))

        console.log(data)
       
    } catch  {
        alert("There was an error deleting city")
    } finally {
        setIsLoading(false)
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