import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

app.get('/weather', (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lon;
  const getWeatherData = async () => {
    if (latitude && longitude) {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`);
      const data = await response.json();
      if (!data) {
        res.send('Error');
      }
      if (data) {
        res.json(data);
      }
    }
    if (!latitude || !longitude) {
      res.json('Enter latitude and longitude');
    }
  };
  getWeatherData();
});

app.listen(process.env.PORT || PORT);
