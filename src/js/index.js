// DOM nodes

const component = document.querySelector('.component');
const video = document.querySelector('.video');
const yojijukugoKanji = document.querySelector('.yojijukugo__kanji');
const yojijukugoKana = document.querySelector('.yojijukugo__kana');
const yojijukugoImi = document.querySelector('.yojijukugo__imi');
const APP_URL = 'https://idioms.herokuapp.com/';

class Weather {
  constructor() {
    this.state = 'Uninitialized'; // Uninitialized, active, or paused
    this.temperature = undefined;
    this.weatherCode = undefined;
    this.today = new Date();
    this.month = this.today.getMonth() + 1;
    this.date = this.today.getDate();
    this.day = this.today.getDay();
    this.hour = this.today.getHours();
    this.minute = this.today.getMinutes();
  }

  getDayOfTheWeek() {
    if (this.day === 1) {
      return '月';
    }
    if (this.day === 2) {
      return '火';
    }
    if (this.day === 3) {
      return '水';
    }
    if (this.day === 4) {
      return '木';
    }
    if (this.day === 5) {
      return '金';
    }
    if (this.day === 6) {
      return '土';
    }
    return '日';
  }

  // eslint-disable-next-line class-methods-use-this
  getFormattedTime(timeUnit) {
    if (timeUnit > 10) {
      return timeUnit;
    }
    const formattedTime = `0${timeUnit}`;
    return formattedTime;
  }
}

const weatherConditions = new Weather();

function initializeUI() {
  // Sizing the window properly for mobile
  const innerViewportHeight = window.innerHeight;
  component.style.maxheight = `${innerViewportHeight}px`;
  // Progressive enhancement: if no JS, footer will be empty
  const footer = document.querySelector('.stats');
  const footerHtml = `<button type="button" class="material-icons video__control" aria-label="位置情報">location_on</button>
  <span class="stats__temp"></span>
  <span class="stats__date"></span>
  <span class="stats__day"></span>
  <span class="stats__time"></span>`;
  footer.innerHTML = footerHtml;
  const statsDate = document.querySelector('.stats__date');
  const statsDay = document.querySelector('.stats__day');
  const statsTime = document.querySelector('.stats__time');
  statsDate.textContent = `${weatherConditions.month}月${weatherConditions.date}日`;
  statsDay.textContent = weatherConditions.getDayOfTheWeek();
  statsTime.textContent = `${weatherConditions.getFormattedTime(weatherConditions.hour)}:${weatherConditions.getFormattedTime(weatherConditions.minute)}`;
}

initializeUI();

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
    videoBackground.pause();
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

// Play or pause music
const playPause = document.querySelector('.video__control');
playPause.addEventListener('click', () => {
  if (weatherConditions.state === 'Uninitialized') {
    updateWeatherConditions();
    playPause.innerText = 'play_arrow';
    playPause.setAttribute('aria-label', 'プレー');
    weatherConditions.state = 'Active';
    return;
  }
  if (weatherConditions.state === 'Active') {
    const videoBackground = document.querySelector('.video_background');
    if (!videoBackground) {
      playPause.innerText = 'error';
      playPause.setAttribute('aria-label', 'エラー');
      return;
    }
    videoBackground.play();
    playPause.innerText = 'pause';
    playPause.setAttribute('aria-label', 'ポーズ');
    weatherConditions.state = 'Paused';
    return;
  }
  if (weatherConditions.state === 'Paused') {
    const videoBackground = document.querySelector('.video_background');
    videoBackground.pause();
    playPause.innerText = 'play_arrow';
    playPause.setAttribute('aria-label', 'プレー');
    weatherConditions.state = 'Active';
  }
});
