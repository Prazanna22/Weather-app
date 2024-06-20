import { useEffect, useState } from 'react';
import propTypes from "prop-types";
import searchicon from './assets/find.png';
import snow from './assets/snow.png';
import wind from './assets/wind.png';
import moon from './assets/moon.png';
import clouds from './assets/clouds.png';
import thunderstorm from './assets/thunderstorm.png';
import sun from './assets/sun.png';
import raining from './assets/raining.png';
import humidity from './assets/humidity.png';
import overcastcloud from './assets/overcastcloud.png';
import scatteredcloud from './assets/scatteredcloud.png';

const Weatherdetails = ({ icon, temp, city, country,lat,long,humidityvalue,Windvalue }) => {

  return (
    <>
      <div className="content">
        <div className="Icon">
          <img src={icon} alt="img" />
        </div>
        <div className="temp">{temp}°C</div>
        <div className="city">{city}</div>
        <div className="country">{country}</div>
        <div className="cord">
          <div>
            <span>latitude</span>
            <span>{lat}</span>
          </div>
          <div>
            <span>longitude</span>
            <span>{long}</span>
          </div>
        </div>
        <div className='hum-wind'>
          <div className='element'>
            <img src={humidity} alt="img" className='humimg'/>
            <div className='data'>
              <div className="humidity">{humidityvalue}%</div>
              <div className="text">Humidity</div>
            </div>
            </div>
            <div className='element'>
            <img src={wind} alt="img" className='windimg' />
            <div className='data'>
              <div className="wind">{Windvalue} km/hr</div>
              <div className="text">Wind Speed</div>
            </div>
            </div>
        </div>
      </div>
    </>
  )
};
Weatherdetails.propTypes={
  icon:propTypes.string.isRequired,
  temp:propTypes.number.isRequired,
  city:propTypes.string.isRequired,
  country:propTypes.string.isRequired,
  lat:propTypes.number.isRequired,
  long:propTypes.number.isRequired,
  humidityvalue:propTypes.number.isRequired,
  Windvalue:propTypes.number.isRequired,
};
export const Weather = () => {


  
  const [icon, setIcon] = useState(sun);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("srivilliputhur");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidityvalue, setHumidityvalue] = useState(0);
  const [Windvalue, setWindvalue] = useState(0);
  const [text,setText]=useState("srivilliputhur");
  const [citynotfound,setCitynotfound]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const dataset = {
    "01d": sun,
    "01n":moon,
    "02d":overcastcloud,
    "02n":overcastcloud,
    "03d":scatteredcloud,
    "03n":scatteredcloud,
    "04d":clouds,
    "04n":clouds,
    "09d":raining,
    "09n":raining,
    "10d": raining,
    "10n":raining,
    "11n":thunderstorm,
    "11n":thunderstorm,
    "13d":snow,
    "13n":snow,
  };

  const search=async()=>{
    setLoading(true);
  
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}
    &appid=b219fdc0863785a8b797e17864d69cc8&units=metric`;
    try{
      let res = await fetch(url);
      let d= await res.json();
      
      if (d.cod==="404"){
        console.log("city not found");
        setCitynotfound(true);
        setLoading(false);
        return;
      }
      setTemp(Math.floor(d.main.temp));
      setHumidityvalue(d.main.humidity);
      setWindvalue(d.wind.speed);
      setCity(d.name);
      setLat(d.coord.lon);
      setLong(d.coord.lat);
      setCountry(d.sys.country);
      const mapicon = d.weather[0].icon;
      setIcon(dataset[mapicon] || sun);
      setCitynotfound(false);
    }catch(error){
      console.log("An error occured:",error);
      setError("An Error occured while fetching weather data");
    }finally{
      setLoading(false);
    }
  };

  const handlekeydown=(e)=>{
    if (e.key==="Enter"){
      search();
    }
  };
  const handlecity=(e)=>{
    setText(e.target.value);

  };
  useEffect(function(){
    search();
  },[]);

  return (
    <>
      <div className="container">
        <div className="box">
          <div className="input">
            <input type="text" className="searchbar"
             placeholder=" Search City" onChange={handlecity} value={text} onKeyDown={handlekeydown}/>
            <div className="search">
              <img src={searchicon} alt="image" onClick={()=>{search()}}/>
            </div>
          </div>
          {!loading && !citynotfound && <Weatherdetails icon={icon} temp={temp}
            city={city} country={country} lat={lat} long={long} humidityvalue={humidityvalue}
            Windvalue={Windvalue} text={text}/>}
          {loading &&<div className='loading-message'>...</div>}
         {error && <div className='error-message'>{error}</div>}
         {citynotfound&&<div className='city-not-found'>City not found</div>}
        </div>
      </div>
    </>
  )
};
