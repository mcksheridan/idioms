window.onload = function idioms() {
    // DOM nodes
    const page = document.querySelector('.page')
    const video = document.querySelector('.video')
    const yojijukugoKanji = document.querySelector('.yojijukugo_kanji')
    const yojijukugoKana = document.querySelector('.yojijukugo_kana')
    const audioPlayer = document.querySelector('.music_player')
    const playPause = document.querySelector('.music_control')
    const statsTemp = document.querySelector('.stats_temp')
    const statsDate = document.querySelector('.stats_date')
    const statsDay = document.querySelector('.stats_day')
    const statsTime = document.querySelector('.stats_time')

    // Sizing the window properly for mobile
    const innerViewportHeight = window.innerHeight
    page.style.height = `${innerViewportHeight}px`

    // Weather
    // Get latitude and logitude
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            // Get API
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={appid}`
            )
                .then((response) => response.json())
                .then((data) => {
                    // Set temperature
                    const { temp } = data.main
                    statsTemp.innerText = `${(temp - 273.15).toFixed(0)}°C`
                    // Set backgrounds
                    const weather = data.weather[0].icon.slice(0, 2)
                    const mediaQuery = window.matchMedia(
                        '(min-device-width: 1200px)'
                    )
                    if (mediaQuery.matches) {
                        video.innerHTML =
                            '<video src="" type="video/mp4" class="video_background" autoplay loop muted></video>'
                        const videoBackground = document.querySelector(
                            '.video_background'
                        )
                        videoBackground.src = `backgrounds/${weather}.mp4`
                    }
                    page.style.backgroundImage = `url('backgrounds/${weather}.jpg'`
                })
        })
    }

    // Yojijukugo
    function yojijukugo() {
        // User has yojijukugo in session storage
        if (
            sessionStorage.getItem('jukugo') !== null &&
            sessionStorage.getItem('yomi') !== null
        ) {
            yojijukugoKanji.innerText = JSON.parse(
                sessionStorage.getItem('jukugo')
            )
            yojijukugoKana.innerText = JSON.parse(
                sessionStorage.getItem('yomi')
            )
        } else {
            // User does not have yojijukugo in session storage
            fetch('https://corsservice.appspot.com/yojijukugo/api/')
                .then((response) => response.json())
                .then((data) => {
                    sessionStorage.setItem(
                        'jukugo',
                        JSON.stringify(data.jukugo)
                    )
                    sessionStorage.setItem('yomi', JSON.stringify(data.yomi))
                    yojijukugoKanji.innerText = JSON.parse(
                        sessionStorage.getItem('jukugo')
                    )
                    yojijukugoKana.innerText = JSON.parse(
                        sessionStorage.getItem('yomi')
                    )
                })
        }
    }

    yojijukugo()

    // Bottom menu bar

    // Play or pause music
    playPause.addEventListener('click', () => {
        if (playPause.innerText === 'play_arrow') {
            audioPlayer.play()
            playPause.innerText = 'pause'
        } else {
            audioPlayer.pause()
            playPause.innerText = 'play_arrow'
        }
    })

    // Day/Time
    const today = new Date()
    // Month and day (date)
    const month = today.getMonth() + 1
    const date = today.getDate()
    statsDate.innerText = `${month}月${date}日`
    // Day of the week
    function day() {
        const dayNumber = today.getDay()
        let dayWord = '日'
        if (dayNumber === 1) {
            dayWord = '月'
        } else if (dayNumber === 2) {
            dayWord = '火'
        } else if (dayNumber === 3) {
            dayWord = '水'
        } else if (dayNumber === 4) {
            dayWord = '木'
        } else if (dayNumber === 5) {
            dayWord = '金'
        } else if (dayNumber === 6) {
            dayWord = '土'
        }
        statsDay.innerText = dayWord
    }
    day()

    function time() {
        const hourData = today.getHours()
        let hour = '0'
        if (hourData < 10) {
            hour += hourData
        } else {
            hour = hourData
        }
        const minuteData = today.getMinutes()
        let minute = '0'
        if (minuteData < 10) {
            minute += minuteData
        } else {
            minute = minuteData
        }
        statsTime.innerText = `${hour}:${minute}`
    }

    time()
}
