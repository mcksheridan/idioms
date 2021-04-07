// DOM nodes
const video = document.querySelector('.video');
const yojijukugoKanji = document.querySelector('.yojijukugo_kanji');
const yojijukugoKana = document.querySelector('.yojijukugo_kana');
const audioPlayer = document.querySelector('.music_player');
const playPause = document.querySelector('.music_control');
const statsTemp = document.querySelector('.stats_temp');
const statsDate = document.querySelector('.stats_date');
const statsDay = document.querySelector('.stats_day');
const statsTime = document.querySelector('.stats_time');

class Weather {
  constructor() {
    this.temperature = undefined;
    this.weatherCode = undefined;
  }
}

const weatherConditions = new Weather();

function initializeUI() {
  // Sizing the window properly for mobile
  const page = document.querySelector('.page');
  const innerViewportHeight = window.innerHeight;
  page.style.height = `${innerViewportHeight}px`;
}

initializeUI();

const updateWeatherUI = () => {
  // Set temperature
  statsTemp.textContent = `${(weatherConditions.temperature - 273.15).toFixed(0)}°C`;
  // Set weather background
  const mediaQuery = window.matchMedia('(min-device-width: 1200px)');
  // Only set video background for large screens
  if (mediaQuery.matches) {
    video.innerHTML = '<video src="" type="video/mp4" class="video_background" autoplay loop muted></video>';
    const videoBackground = document.querySelector('.video_background');
    videoBackground.src = `/../assets/backgrounds/${weatherConditions.weatherCode}.mp4`;
  }
  // Smaller screens get a still background image
  const main = document.querySelector('.main');
  main.style.backgroundImage = `url('/assets/backgrounds/${weatherConditions.weatherCode}.jpg'`;
};

const updateWeatherConditions = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      fetch(
        `http://localhost:3000/weather?lat=${latitude}&lon=${longitude}`,
      )
        .then((response) => response.json())
        .then((data) => {
          weatherConditions.temperature = data.main.temp;
          weatherConditions.weatherCode = data.weather[0].icon.slice(0, 2);
          updateWeatherUI();
        });
    });
  }
};

updateWeatherConditions();

const updateYojijukugoUI = () => {
  yojijukugoKanji.textContent = JSON.parse(sessionStorage.getItem('jukugo'));
  yojijukugoKana.textContent = JSON.parse(sessionStorage.getItem('yomi'));
};

// Yojijukugo
function yojijukugo() {
  // User does not have yojijukugo in session storage
  if (
    sessionStorage.getItem('jukugo') === null
      && sessionStorage.getItem('yomi') === null
  ) {
    fetch('https://corsservice.appspot.com/yojijukugo/api/')
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem('jukugo', JSON.stringify(data.jukugo));
        sessionStorage.setItem('yomi', JSON.stringify(data.yomi));
      });
  }
  updateYojijukugoUI();
}

yojijukugo();

// Bottom menu bar

// Play or pause music
playPause.addEventListener('click', () => {
  if (playPause.innerText === 'play_arrow') {
    audioPlayer.play();
    playPause.innerText = 'pause';
  } else {
    audioPlayer.pause();
    playPause.innerText = 'play_arrow';
  }
});

// Day/Time
const today = new Date();
// Month and day (date)
const month = today.getMonth() + 1;
const date = today.getDate();
statsDate.innerText = `${month}月${date}日`;
// Day of the week
function day() {
  const dayNumber = today.getDay();
  let dayWord = '日';
  if (dayNumber === 1) {
    dayWord = '月';
  } else if (dayNumber === 2) {
    dayWord = '火';
  } else if (dayNumber === 3) {
    dayWord = '水';
  } else if (dayNumber === 4) {
    dayWord = '木';
  } else if (dayNumber === 5) {
    dayWord = '金';
  } else if (dayNumber === 6) {
    dayWord = '土';
  }
  statsDay.innerText = dayWord;
}
day();

function time() {
  const hourData = today.getHours();
  let hour = '0';
  if (hourData < 10) {
    hour += hourData;
  } else {
    hour = hourData;
  }
  const minuteData = today.getMinutes();
  let minute = '0';
  if (minuteData < 10) {
    minute += minuteData;
  } else {
    minute = minuteData;
  }
  statsTime.innerText = `${hour}:${minute}`;
}

time();
