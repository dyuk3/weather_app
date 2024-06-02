'use client';
import Image from 'next/image';
import bgi from '../assets/bg_1.jpg';
import { useState } from 'react';

const Dashboard = () => {
  const [completeData, setCompleteData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState('');

  //apiKey from .env file to keep it secure
  const apiKey = process.env.NEXT_PUBLIC_MY_KEY;

  const fetchWeather = async () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    try {
      //fetch data from url
      const data = await fetch(url);
      const jsonData = await data.json();
      //if the fetch is successful
      if (data?.ok) {
        setCompleteData(jsonData);
        console.log(jsonData);
        const newArray = [];
        jsonData.list.map((current, index) => {
          if (index % 8 === 0) {
            newArray.push(current);
          }
        });
        setData(newArray);
        setLocation('');
        setErrorMsg(null);
      } else {
        setData([]);
        setLocation('');
        setErrorMsg(`Location "${location}" could not be found`);
      }
    } catch (error) {
      console.log('There was an error', error);
    }
  };

  // function to get the weekday from the provided date
  const getDay = (providedDate) => {
    const date = new Date(providedDate);
    const day = date.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[day];
  };

  return (
    <>
      {/* Background Image */}
      <Image className='bg-cover w-full h-screen' src={bgi} alt='' />
      <div className='font-extrabold absolute top-10 left-0 right-0 mx-auto flex justify-center items-center gap-10'>
        {/* Input for the location */}
        <input
          type='text'
          value={location}
          placeholder='Enter City Name'
          className='bg-transparent/30 p-2 text-white shadow-md'
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button className='bg-blue-500 px-5 py-2 rounded text-white' onClick={fetchWeather}>
          Go
        </button>
      </div>

      {/* This div will only be rendered when there's any error */}
      {errorMsg && (
        <div className='absolute top-1/3 font-bold text-xl text-white left-0 right-0 mx-auto flex flex-col gap-5 justify-center items-center'>
          {errorMsg}
        </div>
      )}

      {data.length > 0 && (
        <div className='absolute top-1/3 bg-black/30 py-2 font-bold text-white left-0 right-0 mx-auto flex  gap-10 justify-center items-center'>
          <div className='flex flex-col items-center justify-center gap-5'>
            <h1 className='text-2xl'>{completeData?.city?.name.toUpperCase()}</h1>
            <p className='text-8xl'>{data[0]?.main?.temp.toFixed()}°C</p>
            <p className='text-xl'> {data[0]?.weather[0]?.description} </p>
          </div>

          <div>
            <p className='text-xl'>
              {data[0]?.main?.feels_like.toFixed()}
              °C
            </p>
            <p>Feels like</p>
          </div>
          <div>
            <p>{data[0]?.main?.humidity}%</p>
            <p>Humidity</p>
          </div>
          <div>
            <p>
              {data[0]?.wind?.speed}
              m/s
            </p>
            <p>Wind speed</p>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className='absolute bottom-20 font-bold text-white flex justify-center items-center left-0 right-0 mx-auto gap-10 bg-black/60 p-4'>
          <h2 className='self-center text-orange-700  font-extrabold text-4xl'>5 Day Forecast</h2>
          {data != null &&
            data.map((item, index) => (
              <div className='flex flex-col gap-2 text-center' key={index}>
                <p className='text-2xl font-extrabold text-pink-500'>{getDay(item.dt_txt)}</p>
                <p>
                  {item.main.temp_min}°C - {item.main.temp_max}°C
                </p>
                <p>{item.weather[0].description}</p>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
