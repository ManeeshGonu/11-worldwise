import React from 'react'
import styles from './CountryList.module.css'
import CityItem from './CityItem'
import Spinner from './Spinner'
import Message from './Message'
import CountryItem from './CountryItem'
import { useCities } from '../contexts/CitiesContext'

const CountryList = () => {
    const { cities, isLoading } = useCities()


    if (isLoading) return <Spinner/>

    if (!cities) {
        return <Message message="Add your first city by clicking a city on the map"/>
    }

    const countryList = cities.reduce((acc, city) => {
       if (acc.map((c) => c.country).includes(city.country)) {
              return acc;
         } else {
            return [...acc, {country: city.country, emoji: city.emoji}]
         }
        }, [])

  return (
   <ul className={styles.countryList}>
    {countryList.map((country) => <CountryItem country={country} key={country.country}/>)}
   </ul>
  )
}

export default CountryList