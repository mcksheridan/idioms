// DOM nodes

const component = document.querySelector('.component');
const video = document.querySelector('.video');
const yojijukugoKanji = document.querySelector('.yojijukugo__kanji');
const yojijukugoKana = document.querySelector('.yojijukugo__kana');
const yojijukugoImi = document.querySelector('.yojijukugo__imi');
const APP_URL = 'https://idioms.herokuapp.com/';

class Weather {
  constructor() {
    this.temperature = undefined;
    this.weatherCode = undefined;
  }
}

const weatherConditions = new Weather();

function initializeUI() {
  // Sizing the window properly for mobile
  const innerViewportHeight = window.innerHeight;
  component.style.maxheight = `${innerViewportHeight}px`;
  // Progressive enhancement: if no JS, footer will be empty
  const footer = document.querySelector('.stats');
  const footerHtml = `<button type="button" class="material-icons video__control" aria-label="プレー">play_arrow</button>
  <span class="stats__temp"></span>
  <span class="stats__date"></span>
  <span class="stats__day"></span>
  <span class="stats__time"></span>`;
  footer.innerHTML = footerHtml;
}

initializeUI();

const statsDate = document.querySelector('.stats__date');
const statsDay = document.querySelector('.stats__day');
const statsTime = document.querySelector('.stats__time');

const updateWeatherUI = () => {
  const statsTemp = document.querySelector('.stats__temp');
  statsTemp.textContent = `${weatherConditions.temperature}°C`;
  // Set weather background
  const mediaQuery = window.matchMedia('(min-device-width: 1200px)');
  // Only set video background for large screens
  if (mediaQuery.matches) {
    video.innerHTML = '<video src="" type="video/mp4" class="video_background" autoplay loop muted></video>';
    const videoBackground = document.querySelector('.video_background');
    videoBackground.src = `/../assets/backgrounds/${weatherConditions.weatherCode}.mp4`;
  }
  // Smaller screens get a still background image
  component.style.backgroundImage = `url('/assets/backgrounds/${weatherConditions.weatherCode}.jpg'`;
};

const updateWeatherConditions = () => {
  if (weatherConditions.temperature === undefined) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        fetch(
          `${APP_URL}weather?lat=${latitude}&lon=${longitude}`,
        )
          .then((response) => response.json())
          .then((data) => {
            const temperature = (data.main.temp - 273.15).toFixed(0);
            weatherConditions.temperature = temperature;
            weatherConditions.weatherCode = data.weather[0].icon.slice(0, 2);
            updateWeatherUI();
          });
      });
    }
  }
};

const updateYojijukugoUI = () => {
  yojijukugoKanji.textContent = JSON.parse(sessionStorage.getItem('jukugo'));
  yojijukugoKana.textContent = JSON.parse(sessionStorage.getItem('yomi'));
  yojijukugoImi.textContent = JSON.parse(sessionStorage.getItem('imi'));
};

// Yojijukugo
async function updateYojijukugo() {
  // User does not have yojijukugo in session storage
  if (
    sessionStorage.getItem('jukugo') === 'undefined'
    || sessionStorage.getItem('jukugo') === null
  ) {
    const yojijukugoResponse = await fetch(`${APP_URL}yojijukugo`);
    const yojijukugoData = await yojijukugoResponse.json();
    const { jukugo } = await yojijukugoData[1];
    const { yomi } = await yojijukugoData[0];
    const { imi } = await yojijukugoData[2];
    sessionStorage.setItem('jukugo', await JSON.stringify(jukugo));
    sessionStorage.setItem('yomi', await JSON.stringify(yomi));
    sessionStorage.setItem('imi', await JSON.stringify(imi));
  }
  updateYojijukugoUI();
}

updateYojijukugo();

// Bottom menu bar

// Play or pause music
const playPause = document.querySelector('.video__control');
playPause.addEventListener('click', () => {
  if (playPause.innerText === 'play_arrow') {
    updateWeatherConditions();
    const videoBackground = document.querySelector('.video_background');
    videoBackground.play();
    playPause.innerText = 'pause';
    playPause.setAttribute('aria-label', 'ポーズ');
  } else {
    const videoBackground = document.querySelector('.video_background');
    videoBackground.pause();
    playPause.innerText = 'play_arrow';
    playPause.setAttribute('aria-label', 'プレー');
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
