// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styles from "./Form.module.css";
import Button from "./Button.jsx";
import BackButton from "./BackButton.jsx";
import { useUrlPosition } from "../hooks/useUrlPosition.js";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext.jsx";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [mapLat, mapLng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  // const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const {createCity, isLoading} = useCities()
  const navigate = useNavigate()


    useEffect(() => {

      if (!mapLat && !mapLng) return

    async function fetchCityData() {
      setIsLoadingGeocoding(true);
      setGeocodingError("");
      try {

        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`)
        const data = await res.json();
        // console.log("data",data)

        if (!data.countryCode) throw new Error("That does not look like a valid position. Please try again.");
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName || '');
        setEmoji(convertToEmoji(data.countryCode));

      } catch (error) {
        setGeocodingError(error.message);
        console.error("Error fetching city data:", error);
      }finally{
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData()

  }, [mapLat, mapLng])



  const handleSubmit = async (e)=> {
      e.preventDefault()

      console.log(cityName, date)

      if (!cityName || !date) return 

      const newCity = {
        cityName, country, emoji, date , position: {lat: mapLat,lng: mapLng }, notes, 
      }

      await createCity(newCity)
      navigate("/app/cities")

  }

  if (isLoadingGeocoding) {
    return <Spinner />;
  }

  if(!mapLat && !mapLng) {
    return <Message message={"Start by clicking somewhere on the map "}/>
  }

  if (geocodingError) {
    return (
      <Message message={geocodingError} />
    );
  }

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading: ""}`}  onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
         <DatePicker  id="date" selected={date} onChange={(date) => setDate(date)} dateFormat={'dd/MM/yyyy'}/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
          <Button type="primary">Add</Button>
          <BackButton/>
      </div>
    </form>
  );
}

export default Form;
