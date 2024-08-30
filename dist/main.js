/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const radioStationsInfo_json_1 = __importDefault(__webpack_require__(/*! ./radioStationsInfo.json */ "./src/radioStationsInfo.json"));
class RadioToHebrewNames {
    constructor(hebrewName, link) {
        this.hebrewName = hebrewName;
        this.link = link;
    }
}
const radioMap = {};
function createRadioDict(dict) {
    let helper = false;
    let newHebrewName;
    for (const [key, value] of Object.entries(radioStationsInfo_json_1.default)) {
        for (const [_, value1] of Object.entries(value)) {
            if (!helper) {
                newHebrewName = value1;
                helper = true;
            }
            else {
                dict[key] = new RadioToHebrewNames(newHebrewName, value1);
                helper = false;
            }
        }
    }
}
createRadioDict(radioMap);
//DOM 
const body = document.querySelector('body');
const main = document.getElementById("screen");
const searchInput = document.getElementById("search-input");
const topBar = document.getElementById("bar");
const nightMode = document.getElementById("dark-mode-icon");
const search = document.getElementById("search"); //looks
const searchIcon = document.getElementById("searchIcon");
const enlargedView = document.getElementById("enlarged-view");
const backArrow = document.getElementById("back-arrow");
const rightArrow = document.getElementById("right-arrow-id");
const enlargedImg = document.getElementById("enlarged-img");
const stationNameBig = document.getElementById("station-name-big");
const liveButton = document.getElementById("live-button");
const pauseButton = document.getElementById("pause-button");
const songDestcripton = document.getElementById('song-name');
const volumeSlider = document.getElementById("slider-vol");
const volumeOffIcon = document.getElementById("volume-off");
const volumeMaxIcon = document.getElementById("volume-max");
let currentStationAudio = new Audio();
let currentStationName = '';
let isRadio = false;
let isDark = false;
let isPaused = false;
let hasScrolled = false;
let descriptions = [];
let alpha = 1;
let everstopped = false;
let lastsong;
let currentVolume = parseInt(volumeSlider.value) / 100;
//connection
let socket = new WebSocket("ws://localhost:8000/ws");
let messageQueue = [];
let isWebSocketReady = false;
//when connection is established
socket.addEventListener('open', function (event) {
    console.log('Connected to the WS Server!');
    isWebSocketReady = true;
    while (messageQueue.length > 0) {
        const message = messageQueue.shift();
        if (message) {
            socket.send(message);
        }
    }
});
//sending if the connection is ready else putting it in the queue
function sendMessage(message) {
    if (isWebSocketReady) {
        socket.send(message);
    }
    else {
        messageQueue.push(message);
    }
}
socket.addEventListener('error', function (event) {
    console.error('WebSocket error observed:', event);
});
socket.addEventListener('close', function (event) {
    console.log('Connection closed');
});
function sendUpdate() {
    if (isRadio && !everstopped) {
        sendMessage(currentStationName);
    }
}
setInterval(function () {
    sendUpdate();
}, 30000);
//recieving the current song
socket.onmessage = (event) => {
    const currentSong = JSON.parse(event.data);
    if (currentSong != lastsong) {
        songDestcripton.innerHTML = `${currentSong['songName']} - ${currentSong['singer']}`;
        songDestcripton.setAttribute("href", `${currentSong['href']}`);
        lastsong = currentSong;
    }
};
//creating the main (all the stations)
for (const radioName in radioMap) {
    const imgSource = `../assets/_images/StationsPng/${radioName}.png`;
    const element = document.createElement('img');
    element.src = imgSource;
    element.classList.add('pictures');
    //pressable
    element.addEventListener('click', () => whenChosingStation(radioName));
    const elementDescription = document.createElement('figcaption');
    elementDescription.classList.add('description');
    elementDescription.appendChild(document.createTextNode(radioMap[radioName].hebrewName));
    const figure = document.createElement('figure');
    figure.setAttribute('id', radioName);
    figure.appendChild(element);
    figure.appendChild(elementDescription);
    descriptions.push(figure);
    main === null || main === void 0 ? void 0 : main.appendChild(figure);
}
function whenChosingStation(stationId) {
    enlargedImg.src = `../assets/_images/StationsPng/${stationId}.png`;
    stationNameBig.textContent = radioMap[stationId].hebrewName;
    if (currentStationName != stationId) {
        startingTheStation(stationId);
    }
    currentStationName = stationId;
    openingBigStationTab();
}
function startingTheStation(stationId) {
    volumeSlider.value = '50';
    currentStationAudio.pause();
    currentStationAudio = new Audio(radioMap[stationId].link);
    currentStationAudio.play();
    pauseButton.classList.remove('fa-play');
    pauseButton.classList.add('fa-stop');
    liveButton.style.display = 'none';
    isPaused = false;
    everstopped = false;
    isRadio = true;
    sendMessage(stationId);
}
function backToMainScreen() {
    enlargedView.classList.remove('active');
    //showing all again
    main.style.display = '';
    for (const radioName in radioMap) {
        const currentFigure = document.getElementById(radioName);
        currentFigure === null || currentFigure === void 0 ? void 0 : currentFigure.classList.remove('hidden');
    }
    //wait for animation
    setTimeout(() => {
        enlargedView.classList.add('hidden');
        rightArrow.classList.remove('hidden');
        body.classList.remove('no-scroll');
    }, 500);
}
function openingBigStationTab() {
    enlargedView.classList.remove('hidden');
    setTimeout(() => {
        enlargedView.classList.add('active');
        searchInput.value = '';
        rightArrow.classList.add('hidden');
    }, 10);
    setTimeout(() => {
        main.style.display = 'none';
        window.scrollTo(0, 0);
    }, 500);
    body.classList.add('no-scroll');
}
backArrow.addEventListener('click', backToMainScreen);
rightArrow.addEventListener('click', openingBigStationTab);
//search bar contant
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", (e) => {
    const input = e.target.value;
    for (const radioName in radioMap) {
        const isVisible = (radioMap[radioName].hebrewName).includes(input) || radioName.includes(input);
        const currentFigure = document.getElementById(radioName);
        currentFigure === null || currentFigure === void 0 ? void 0 : currentFigure.classList.toggle("hidden", !isVisible);
    }
});
//preventing enter
topBar.addEventListener("submit", (e) => {
    e.preventDefault();
});
//darkmode 
nightMode === null || nightMode === void 0 ? void 0 : nightMode.addEventListener("click", () => {
    isDark = !isDark;
    // nightmode icon
    nightMode.classList.toggle("fa-moon", !isDark);
    nightMode.classList.toggle("fa-sun", isDark);
    nightMode.style.color = isDark ? 'white' : 'black';
    // background
    body.style.backgroundColor = isDark ? 'black' : 'white';
    body.style.color = isDark ? 'white' : 'black';
    // name and pictures border
    descriptions.forEach(figure => {
        const img = figure.querySelector('img');
        const figcaption = figure.querySelector('figcaption');
        // name
        figcaption.classList.toggle("description", !isDark);
        figcaption.classList.toggle("descriptionDark", isDark);
        //song name
        songDestcripton.style.color = isDark ? 'white' : 'black';
        // pictures border
        img.classList.toggle("pictures", !isDark);
        img.classList.toggle("picturesDark", isDark);
    });
    // search looks
    search.style.backgroundColor = `rgba(${isDark ? '80, 80, 80' : '246, 246, 246'}, ${alpha})`;
    search.style.color = isDark ? 'white' : 'black';
    searchInput.style.color = isDark ? 'white' : '#333333';
    searchIcon.style.color = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
    // enlarge view
    enlargedView.style.backgroundColor = isDark ? 'black' : 'white';
    enlargedImg.style.boxShadow = boxShadow();
    stationNameBig.style.color = isDark ? 'white' : 'black';
});
function boxShadow() {
    const color = isDark ? '180, 180, 180' : '0, 0, 0';
    return `0px 10px 15px rgba(${color}, 0.5), 10px 20px 20px rgba(${color}, 0.5), 0px 30px 40px rgba(${color}, 0.5)`;
}
function updateAlpha(element, newAlpha) {
    // update background color alpha value
    const currentColor = window.getComputedStyle(element).backgroundColor;
    const rgbValues = currentColor.match(/\d+/g);
    if (rgbValues) {
        const [r, g, b] = rgbValues;
        element.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    }
}
window.onscroll = function () {
    if (!hasScrolled || window.scrollY == 0) {
        //scrolling
        if (window.scrollY != 0) {
            //search looks
            updateAlpha(search, 0);
            alpha = 0;
            //search position
            topBar.style.justifyContent = 'flex-end';
            searchIcon.style.cursor = 'pointer';
            hasScrolled = true;
            searchInput.style.display = 'none';
        }
        //geting back to top
        else {
            //search looks
            updateAlpha(search, 1);
            alpha = 1;
            //search position
            topBar.style.justifyContent = 'center';
            searchIcon.style.cursor = 'default';
            hasScrolled = false;
            searchInput.style.display = '';
        }
    }
};
searchIcon === null || searchIcon === void 0 ? void 0 : searchIcon.addEventListener("click", () => {
    if (hasScrolled) {
        window.scrollTo(0, 0);
        setTimeout(() => {
            searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
        }, 10);
    }
});
//right screen buttons
function pauseOrResume() {
    if (!isPaused) {
        currentStationAudio.pause();
        pauseButton.classList.remove('fa-stop');
        pauseButton.classList.add('fa-play');
        isPaused = !isPaused;
        ifStopped();
        liveButton.style.display = '';
    }
    else {
        currentStationAudio.play();
        pauseButton.classList.remove('fa-play');
        pauseButton.classList.add('fa-stop');
        isPaused = !isPaused;
    }
}
function goLive() {
    startingTheStation(currentStationName);
}
pauseButton.addEventListener("click", pauseOrResume);
liveButton.addEventListener("click", goLive);
//volume
function updateVolume() {
    const currentVolume = parseInt(volumeSlider.value) / 100;
    currentStationAudio.volume = currentVolume;
}
volumeOffIcon.addEventListener('click', () => {
    currentStationAudio.volume = 0;
    volumeSlider.value = '0';
});
volumeMaxIcon.addEventListener('click', () => {
    currentStationAudio.volume = 1;
    volumeSlider.value = '100';
});
volumeSlider.addEventListener("input", updateVolume);
function ifStopped() {
    lastsong = {};
    everstopped = true;
    liveButton.style.display = '';
    setTimeout(() => {
        songDestcripton.innerHTML = ``;
    }, 10000);
}


/***/ }),

/***/ "./src/radioStationsInfo.json":
/*!************************************!*\
  !*** ./src/radioStationsInfo.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"glglz":{"hebrewName":"גלגלצ","link":"https://glzwizzlv.bynetcdn.com/glglz_mp3"},"glz":{"hebrewName":"גלי צהל","link":"https://glzwizzlv.bynetcdn.com/glz_mp3"},"darom":{"hebrewName":"רדיו דרום","link":"https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio"},"darom101.5FM":{"hebrewName":"רדיו דרום 101.5","link":"https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio"},"kan88":{"hebrewName":"כאן 88","link":"https://27873.live.streamtheworld.com/KAN_88.mp3"},"kanBet":{"hebrewName":"כאן רשת ב","link":"https://22533.live.streamtheworld.com/KAN_BET.mp3"},"kanGimmel":{"hebrewName":"כאן רשת ג","link":"https://25583.live.streamtheworld.com/KAN_GIMMEL.mp3"},"kanMoreshet":{"hebrewName":"כאן מורשת","link":"https://25483.live.streamtheworld.com/KAN_MORESHET.mp3"},"kanKolHamusica":{"hebrewName":"כאן קול המוזיקה","link":"https://27873.live.streamtheworld.com/KAN_KOL_HAMUSICA.mp3"},"kanReka":{"hebrewName":"כאן רקע","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3"},"kanTarbut":{"hebrewName":"כאן תרבות","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3"},"eco99FM":{"hebrewName":"אקו 99fm","link":"https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio"},"kolUniversity":{"hebrewName":"קול האוניברסיטה","link":"https://1062onair.runi.ac.il/idc123.mp3"},"bgu":{"hebrewName":"אוניברסיטת בן-גוריון","link":"https://bguradio.co/listen/bguradio/radio.mp3"},"103FM":{"hebrewName":"רדיו 103FM","link":"https://cdn.cybercdn.live/103FM/Live/icecast.audio"},"tzafon104.5":{"hebrewName":"צפון 104.5","link":"https://cdn.cybercdn.live/Tzafon_NonStop/Live_Audio/icecast.audio"},"ivriShesh":{"hebrewName":"עברי שש","link":"https://streaming.radio.co/sa06221901/listen"},"radius":{"hebrewName":"רדיו רדיוס","link":"https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio"},"r90":{"hebrewName":"רדיו 90","link":"https://cdn.cybercdn.live/Emtza_Haderech/Live_Audio/icecast.audio"},"telAviv102FM":{"hebrewName":"רדיו תל אביב ","link":"https://102.livecdn.biz/102fm_mp3"},"shiridikaon":{"hebrewName":"שירי דיכאון","link":"https://diki.mediacast.co.il/diki"},"shiriAhava":{"hebrewName":"שירי אהבה","link":"https://liveradio.co.il/radiolove"},"kezevMizrahi":{"hebrewName":"קצב מזרחי","link":"https://liveradio.co.il/radio_i"},"kezevYamTichoni":{"hebrewName":"קצב ים-תיכוני","link":"https://liveradio.co.il:1040/;"},"kolRamatHasharon":{"hebrewName":"קול רמת השרון","link":"https://radio.streamgates.net/stream/1036"},"kolBarama":{"hebrewName":"קול ברמה","link":"https://cdn.cybercdn.live/Kol_Barama/Live_Audio/icecast.audio"},"kolHagolan":{"hebrewName":"קול הגולן","link":"https://liveradio.co.il/kolhagolan"},"kolHagalilTop":{"hebrewName":"קול הגליל","link":"https://radio.streamgates.net/stream/galil"},"kolHayamHaadom":{"hebrewName":"קול הים התיכון","link":"https://cdn.cybercdn.live/Eilat_Radio/Live/icecast.audio"},"kolHaKinneret":{"hebrewName":"קול הכינרת","link":"https://radio.streamgates.net/stream/kinneret"},"kolHamizrah":{"hebrewName":"קול המזרח","link":"https://mzr.mediacast.co.il/mzradio"},"kolHamerkaz":{"hebrewName":"קול המרכז","link":"https://liveradio.co.il:9050/;"},"kolHashfela":{"hebrewName":"קול השפלה","link":"https://radio.streamgates.net/stream/1036kh"},"kolHai":{"hebrewName":"קול חי","link":"https://live.kcm.fm/live:"},"kolYezreel":{"hebrewName":"קול יזרעאל","link":"https://radio.streamgates.net/stream/yezreel"},"kolNatanya":{"hebrewName":"קול נתניה","link":"https://radio.streamgates.net/stream/netanya"},"kolHanachal":{"hebrewName":"קול הנחל","link":"https://cast4.asurahosting.com/proxy/yaniv/stream"},"kolRega":{"hebrewName":"קול רגע","link":"https://cdn.cybercdn.live/Kol_Rega/Live_Audio/icecast.audio"},"sol":{"hebrewName":"רדיו סול","link":"https://radio.streamgates.net/stream/sol"},"sahar":{"hebrewName":"רדיו סהר","link":"https://live.ecast.co.il/stream/sahar"},"neto":{"hebrewName":"רדיו נטו","link":"https://live.ecast.co.il/stream/radioneto1"},"noshmimMizrahit":{"hebrewName":"נושמים מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"nostalgiaIsraeli":{"hebrewName":"נוסטלגיה ישראלי","link":"http://194.213.4.197:8000/;stream/1"},"martitMeitarBalev":{"hebrewName":"רדיו מרטיט מיתר בלב","link":"https://liveradio.co.il/wet"},"mizrahit":{"hebrewName":"רדיו מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"mahotHachaim":{"hebrewName":"רדיו מהות-החיים","link":"https://eol-live.cdnwiz.com/eol/eolsite/icecast.audio"},"levHamedina":{"hebrewName":"רדיו לב המדינה","link":"https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio"},"KaholYavan":{"hebrewName":"רדיו כחול-יוון","link":"https://icecast.live/proxy/livegreece/livegreece"},"jerusalem":{"hebrewName":"רדיו ירושלים","link":"https://cdn.cybercdn.live/JerusalemRadio/Live/icecast.audio"},"101.5":{"hebrewName":"רדיו 101.5","link":"https://cdn.cybercdn.live/Hatahana_1015/Live_Audio/icecast.audio"},"hakatze":{"hebrewName":"רדיו הקצה","link":"https://kzradio.mediacast.co.il/kzradio_live/kzradio/icecast.audio"},"galiIsrael":{"hebrewName":"רדיו גלי-ישראל","link":"https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio"},"oranim":{"hebrewName":"רדיו אורנים","link":"https://radio.streamgates.net/stream/oranim"},"anime":{"hebrewName":"אנימה","link":"https://stream.animeradio.de/animeradio.mp3"},"jazzFM":{"hebrewName":"ג\'אז","link":"https://jazzfm91.streamb.live/SB00009"},"Lo-fi":{"hebrewName":"לו-פי","link":"https://ec3.yesstreaming.net:3755/stream"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpREFBaUQsbUJBQU8sQ0FBQyw4REFBMEI7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1Qyx5QkFBeUIsSUFBSSxzQkFBc0I7QUFDMUYsZ0RBQWdELG9CQUFvQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELFVBQVU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsVUFBVTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwyQ0FBMkMsd0NBQXdDLElBQUksTUFBTTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsaUNBQWlDLE1BQU0sOEJBQThCLE1BQU0sNkJBQTZCLE1BQU07QUFDOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksU0FBUztBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7VUN6VEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3JhZGlvLXdlYi8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmFkaW9TdGF0aW9uc0luZm9fanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JhZGlvU3RhdGlvbnNJbmZvLmpzb25cIikpO1xuY2xhc3MgUmFkaW9Ub0hlYnJld05hbWVzIHtcbiAgICBjb25zdHJ1Y3RvcihoZWJyZXdOYW1lLCBsaW5rKSB7XG4gICAgICAgIHRoaXMuaGVicmV3TmFtZSA9IGhlYnJld05hbWU7XG4gICAgICAgIHRoaXMubGluayA9IGxpbms7XG4gICAgfVxufVxuY29uc3QgcmFkaW9NYXAgPSB7fTtcbmZ1bmN0aW9uIGNyZWF0ZVJhZGlvRGljdChkaWN0KSB7XG4gICAgbGV0IGhlbHBlciA9IGZhbHNlO1xuICAgIGxldCBuZXdIZWJyZXdOYW1lO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJhZGlvU3RhdGlvbnNJbmZvX2pzb25fMS5kZWZhdWx0KSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtfLCB2YWx1ZTFdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFoZWxwZXIpIHtcbiAgICAgICAgICAgICAgICBuZXdIZWJyZXdOYW1lID0gdmFsdWUxO1xuICAgICAgICAgICAgICAgIGhlbHBlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaWN0W2tleV0gPSBuZXcgUmFkaW9Ub0hlYnJld05hbWVzKG5ld0hlYnJld05hbWUsIHZhbHVlMSk7XG4gICAgICAgICAgICAgICAgaGVscGVyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5jcmVhdGVSYWRpb0RpY3QocmFkaW9NYXApO1xuLy9ET00gXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuY29uc3QgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NyZWVuXCIpO1xuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcbmNvbnN0IHRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFyXCIpO1xuY29uc3QgbmlnaHRNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXJrLW1vZGUtaWNvblwiKTtcbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpOyAvL2xvb2tzXG5jb25zdCBzZWFyY2hJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hJY29uXCIpO1xuY29uc3QgZW5sYXJnZWRWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmxhcmdlZC12aWV3XCIpO1xuY29uc3QgYmFja0Fycm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrLWFycm93XCIpO1xuY29uc3QgcmlnaHRBcnJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtYXJyb3ctaWRcIik7XG5jb25zdCBlbmxhcmdlZEltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5sYXJnZWQtaW1nXCIpO1xuY29uc3Qgc3RhdGlvbk5hbWVCaWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXRpb24tbmFtZS1iaWdcIik7XG5jb25zdCBsaXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXZlLWJ1dHRvblwiKTtcbmNvbnN0IHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZS1idXR0b25cIik7XG5jb25zdCBzb25nRGVzdGNyaXB0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29uZy1uYW1lJyk7XG5jb25zdCB2b2x1bWVTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlci12b2xcIik7XG5jb25zdCB2b2x1bWVPZmZJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2b2x1bWUtb2ZmXCIpO1xuY29uc3Qgdm9sdW1lTWF4SWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9sdW1lLW1heFwiKTtcbmxldCBjdXJyZW50U3RhdGlvbkF1ZGlvID0gbmV3IEF1ZGlvKCk7XG5sZXQgY3VycmVudFN0YXRpb25OYW1lID0gJyc7XG5sZXQgaXNSYWRpbyA9IGZhbHNlO1xubGV0IGlzRGFyayA9IGZhbHNlO1xubGV0IGlzUGF1c2VkID0gZmFsc2U7XG5sZXQgaGFzU2Nyb2xsZWQgPSBmYWxzZTtcbmxldCBkZXNjcmlwdGlvbnMgPSBbXTtcbmxldCBhbHBoYSA9IDE7XG5sZXQgZXZlcnN0b3BwZWQgPSBmYWxzZTtcbmxldCBsYXN0c29uZztcbmxldCBjdXJyZW50Vm9sdW1lID0gcGFyc2VJbnQodm9sdW1lU2xpZGVyLnZhbHVlKSAvIDEwMDtcbi8vY29ubmVjdGlvblxubGV0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4MDAwL3dzXCIpO1xubGV0IG1lc3NhZ2VRdWV1ZSA9IFtdO1xubGV0IGlzV2ViU29ja2V0UmVhZHkgPSBmYWxzZTtcbi8vd2hlbiBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkXG5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignb3BlbicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgdG8gdGhlIFdTIFNlcnZlciEnKTtcbiAgICBpc1dlYlNvY2tldFJlYWR5ID0gdHJ1ZTtcbiAgICB3aGlsZSAobWVzc2FnZVF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VRdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgc29ja2V0LnNlbmQobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vc2VuZGluZyBpZiB0aGUgY29ubmVjdGlvbiBpcyByZWFkeSBlbHNlIHB1dHRpbmcgaXQgaW4gdGhlIHF1ZXVlXG5mdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKGlzV2ViU29ja2V0UmVhZHkpIHtcbiAgICAgICAgc29ja2V0LnNlbmQobWVzc2FnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBtZXNzYWdlUXVldWUucHVzaChtZXNzYWdlKTtcbiAgICB9XG59XG5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdXZWJTb2NrZXQgZXJyb3Igb2JzZXJ2ZWQ6JywgZXZlbnQpO1xufSk7XG5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBjbG9zZWQnKTtcbn0pO1xuZnVuY3Rpb24gc2VuZFVwZGF0ZSgpIHtcbiAgICBpZiAoaXNSYWRpbyAmJiAhZXZlcnN0b3BwZWQpIHtcbiAgICAgICAgc2VuZE1lc3NhZ2UoY3VycmVudFN0YXRpb25OYW1lKTtcbiAgICB9XG59XG5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgc2VuZFVwZGF0ZSgpO1xufSwgMzAwMDApO1xuLy9yZWNpZXZpbmcgdGhlIGN1cnJlbnQgc29uZ1xuc29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRTb25nID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBpZiAoY3VycmVudFNvbmcgIT0gbGFzdHNvbmcpIHtcbiAgICAgICAgc29uZ0Rlc3RjcmlwdG9uLmlubmVySFRNTCA9IGAke2N1cnJlbnRTb25nWydzb25nTmFtZSddfSAtICR7Y3VycmVudFNvbmdbJ3NpbmdlciddfWA7XG4gICAgICAgIHNvbmdEZXN0Y3JpcHRvbi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGAke2N1cnJlbnRTb25nWydocmVmJ119YCk7XG4gICAgICAgIGxhc3Rzb25nID0gY3VycmVudFNvbmc7XG4gICAgfVxufTtcbi8vY3JlYXRpbmcgdGhlIG1haW4gKGFsbCB0aGUgc3RhdGlvbnMpXG5mb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcCkge1xuICAgIGNvbnN0IGltZ1NvdXJjZSA9IGAuLi9hc3NldHMvX2ltYWdlcy9TdGF0aW9uc1BuZy8ke3JhZGlvTmFtZX0ucG5nYDtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZWxlbWVudC5zcmMgPSBpbWdTb3VyY2U7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwaWN0dXJlcycpO1xuICAgIC8vcHJlc3NhYmxlXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHdoZW5DaG9zaW5nU3RhdGlvbihyYWRpb05hbWUpKTtcbiAgICBjb25zdCBlbGVtZW50RGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWdjYXB0aW9uJyk7XG4gICAgZWxlbWVudERlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyaXB0aW9uJyk7XG4gICAgZWxlbWVudERlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJhZGlvTWFwW3JhZGlvTmFtZV0uaGVicmV3TmFtZSkpO1xuICAgIGNvbnN0IGZpZ3VyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZ3VyZScpO1xuICAgIGZpZ3VyZS5zZXRBdHRyaWJ1dGUoJ2lkJywgcmFkaW9OYW1lKTtcbiAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgZmlndXJlLmFwcGVuZENoaWxkKGVsZW1lbnREZXNjcmlwdGlvbik7XG4gICAgZGVzY3JpcHRpb25zLnB1c2goZmlndXJlKTtcbiAgICBtYWluID09PSBudWxsIHx8IG1haW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1haW4uYXBwZW5kQ2hpbGQoZmlndXJlKTtcbn1cbmZ1bmN0aW9uIHdoZW5DaG9zaW5nU3RhdGlvbihzdGF0aW9uSWQpIHtcbiAgICBlbmxhcmdlZEltZy5zcmMgPSBgLi4vYXNzZXRzL19pbWFnZXMvU3RhdGlvbnNQbmcvJHtzdGF0aW9uSWR9LnBuZ2A7XG4gICAgc3RhdGlvbk5hbWVCaWcudGV4dENvbnRlbnQgPSByYWRpb01hcFtzdGF0aW9uSWRdLmhlYnJld05hbWU7XG4gICAgaWYgKGN1cnJlbnRTdGF0aW9uTmFtZSAhPSBzdGF0aW9uSWQpIHtcbiAgICAgICAgc3RhcnRpbmdUaGVTdGF0aW9uKHN0YXRpb25JZCk7XG4gICAgfVxuICAgIGN1cnJlbnRTdGF0aW9uTmFtZSA9IHN0YXRpb25JZDtcbiAgICBvcGVuaW5nQmlnU3RhdGlvblRhYigpO1xufVxuZnVuY3Rpb24gc3RhcnRpbmdUaGVTdGF0aW9uKHN0YXRpb25JZCkge1xuICAgIHZvbHVtZVNsaWRlci52YWx1ZSA9ICc1MCc7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby5wYXVzZSgpO1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8gPSBuZXcgQXVkaW8ocmFkaW9NYXBbc3RhdGlvbklkXS5saW5rKTtcbiAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnBsYXkoKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1wbGF5Jyk7XG4gICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnZmEtc3RvcCcpO1xuICAgIGxpdmVCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBpc1BhdXNlZCA9IGZhbHNlO1xuICAgIGV2ZXJzdG9wcGVkID0gZmFsc2U7XG4gICAgaXNSYWRpbyA9IHRydWU7XG4gICAgc2VuZE1lc3NhZ2Uoc3RhdGlvbklkKTtcbn1cbmZ1bmN0aW9uIGJhY2tUb01haW5TY3JlZW4oKSB7XG4gICAgZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIC8vc2hvd2luZyBhbGwgYWdhaW5cbiAgICBtYWluLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICBmb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcCkge1xuICAgICAgICBjb25zdCBjdXJyZW50RmlndXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmFkaW9OYW1lKTtcbiAgICAgICAgY3VycmVudEZpZ3VyZSA9PT0gbnVsbCB8fCBjdXJyZW50RmlndXJlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJyZW50RmlndXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH1cbiAgICAvL3dhaXQgZm9yIGFuaW1hdGlvblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBlbmxhcmdlZFZpZXcuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHJpZ2h0QXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgfSwgNTAwKTtcbn1cbmZ1bmN0aW9uIG9wZW5pbmdCaWdTdGF0aW9uVGFiKCkge1xuICAgIGVubGFyZ2VkVmlldy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICByaWdodEFycm93LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIH0sIDEwKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbWFpbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgfSwgNTAwKTtcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xufVxuYmFja0Fycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYmFja1RvTWFpblNjcmVlbik7XG5yaWdodEFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3BlbmluZ0JpZ1N0YXRpb25UYWIpO1xuLy9zZWFyY2ggYmFyIGNvbnRhbnRcbnNlYXJjaElucHV0ID09PSBudWxsIHx8IHNlYXJjaElucHV0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGZvciAoY29uc3QgcmFkaW9OYW1lIGluIHJhZGlvTWFwKSB7XG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IChyYWRpb01hcFtyYWRpb05hbWVdLmhlYnJld05hbWUpLmluY2x1ZGVzKGlucHV0KSB8fCByYWRpb05hbWUuaW5jbHVkZXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBjdXJyZW50RmlndXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmFkaW9OYW1lKTtcbiAgICAgICAgY3VycmVudEZpZ3VyZSA9PT0gbnVsbCB8fCBjdXJyZW50RmlndXJlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJyZW50RmlndXJlLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIiwgIWlzVmlzaWJsZSk7XG4gICAgfVxufSk7XG4vL3ByZXZlbnRpbmcgZW50ZXJcbnRvcEJhci5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG4vL2Rhcmttb2RlIFxubmlnaHRNb2RlID09PSBudWxsIHx8IG5pZ2h0TW9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmlnaHRNb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgaXNEYXJrID0gIWlzRGFyaztcbiAgICAvLyBuaWdodG1vZGUgaWNvblxuICAgIG5pZ2h0TW9kZS5jbGFzc0xpc3QudG9nZ2xlKFwiZmEtbW9vblwiLCAhaXNEYXJrKTtcbiAgICBuaWdodE1vZGUuY2xhc3NMaXN0LnRvZ2dsZShcImZhLXN1blwiLCBpc0RhcmspO1xuICAgIG5pZ2h0TW9kZS5zdHlsZS5jb2xvciA9IGlzRGFyayA/ICd3aGl0ZScgOiAnYmxhY2snO1xuICAgIC8vIGJhY2tncm91bmRcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGlzRGFyayA/ICdibGFjaycgOiAnd2hpdGUnO1xuICAgIGJvZHkuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyAnd2hpdGUnIDogJ2JsYWNrJztcbiAgICAvLyBuYW1lIGFuZCBwaWN0dXJlcyBib3JkZXJcbiAgICBkZXNjcmlwdGlvbnMuZm9yRWFjaChmaWd1cmUgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSBmaWd1cmUucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIGNvbnN0IGZpZ2NhcHRpb24gPSBmaWd1cmUucXVlcnlTZWxlY3RvcignZmlnY2FwdGlvbicpO1xuICAgICAgICAvLyBuYW1lXG4gICAgICAgIGZpZ2NhcHRpb24uY2xhc3NMaXN0LnRvZ2dsZShcImRlc2NyaXB0aW9uXCIsICFpc0RhcmspO1xuICAgICAgICBmaWdjYXB0aW9uLmNsYXNzTGlzdC50b2dnbGUoXCJkZXNjcmlwdGlvbkRhcmtcIiwgaXNEYXJrKTtcbiAgICAgICAgLy9zb25nIG5hbWVcbiAgICAgICAgc29uZ0Rlc3RjcmlwdG9uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3doaXRlJyA6ICdibGFjayc7XG4gICAgICAgIC8vIHBpY3R1cmVzIGJvcmRlclxuICAgICAgICBpbWcuY2xhc3NMaXN0LnRvZ2dsZShcInBpY3R1cmVzXCIsICFpc0RhcmspO1xuICAgICAgICBpbWcuY2xhc3NMaXN0LnRvZ2dsZShcInBpY3R1cmVzRGFya1wiLCBpc0RhcmspO1xuICAgIH0pO1xuICAgIC8vIHNlYXJjaCBsb29rc1xuICAgIHNlYXJjaC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgke2lzRGFyayA/ICc4MCwgODAsIDgwJyA6ICcyNDYsIDI0NiwgMjQ2J30sICR7YWxwaGF9KWA7XG4gICAgc2VhcmNoLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3doaXRlJyA6ICdibGFjayc7XG4gICAgc2VhcmNoSW5wdXQuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyAnd2hpdGUnIDogJyMzMzMzMzMnO1xuICAgIHNlYXJjaEljb24uc3R5bGUuY29sb3IgPSBpc0RhcmsgPyAncmdiYSgyNTUsMjU1LDI1NSwwLjI1KScgOiAncmdiYSgwLDAsMCwwLjI1KSc7XG4gICAgLy8gZW5sYXJnZSB2aWV3XG4gICAgZW5sYXJnZWRWaWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGlzRGFyayA/ICdibGFjaycgOiAnd2hpdGUnO1xuICAgIGVubGFyZ2VkSW1nLnN0eWxlLmJveFNoYWRvdyA9IGJveFNoYWRvdygpO1xuICAgIHN0YXRpb25OYW1lQmlnLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3doaXRlJyA6ICdibGFjayc7XG59KTtcbmZ1bmN0aW9uIGJveFNoYWRvdygpIHtcbiAgICBjb25zdCBjb2xvciA9IGlzRGFyayA/ICcxODAsIDE4MCwgMTgwJyA6ICcwLCAwLCAwJztcbiAgICByZXR1cm4gYDBweCAxMHB4IDE1cHggcmdiYSgke2NvbG9yfSwgMC41KSwgMTBweCAyMHB4IDIwcHggcmdiYSgke2NvbG9yfSwgMC41KSwgMHB4IDMwcHggNDBweCByZ2JhKCR7Y29sb3J9LCAwLjUpYDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUFscGhhKGVsZW1lbnQsIG5ld0FscGhhKSB7XG4gICAgLy8gdXBkYXRlIGJhY2tncm91bmQgY29sb3IgYWxwaGEgdmFsdWVcbiAgICBjb25zdCBjdXJyZW50Q29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgY29uc3QgcmdiVmFsdWVzID0gY3VycmVudENvbG9yLm1hdGNoKC9cXGQrL2cpO1xuICAgIGlmIChyZ2JWYWx1ZXMpIHtcbiAgICAgICAgY29uc3QgW3IsIGcsIGJdID0gcmdiVmFsdWVzO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7bmV3QWxwaGF9KWA7XG4gICAgfVxufVxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghaGFzU2Nyb2xsZWQgfHwgd2luZG93LnNjcm9sbFkgPT0gMCkge1xuICAgICAgICAvL3Njcm9sbGluZ1xuICAgICAgICBpZiAod2luZG93LnNjcm9sbFkgIT0gMCkge1xuICAgICAgICAgICAgLy9zZWFyY2ggbG9va3NcbiAgICAgICAgICAgIHVwZGF0ZUFscGhhKHNlYXJjaCwgMCk7XG4gICAgICAgICAgICBhbHBoYSA9IDA7XG4gICAgICAgICAgICAvL3NlYXJjaCBwb3NpdGlvblxuICAgICAgICAgICAgdG9wQmFyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2ZsZXgtZW5kJztcbiAgICAgICAgICAgIHNlYXJjaEljb24uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgICAgICAgICAgaGFzU2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICAgICAgc2VhcmNoSW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgICAgICAvL2dldGluZyBiYWNrIHRvIHRvcFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vc2VhcmNoIGxvb2tzXG4gICAgICAgICAgICB1cGRhdGVBbHBoYShzZWFyY2gsIDEpO1xuICAgICAgICAgICAgYWxwaGEgPSAxO1xuICAgICAgICAgICAgLy9zZWFyY2ggcG9zaXRpb25cbiAgICAgICAgICAgIHRvcEJhci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xuICAgICAgICAgICAgc2VhcmNoSWNvbi5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG4gICAgICAgICAgICBoYXNTY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VhcmNoSW5wdXQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufTtcbnNlYXJjaEljb24gPT09IG51bGwgfHwgc2VhcmNoSWNvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VhcmNoSWNvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlmIChoYXNTY3JvbGxlZCkge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc2VhcmNoSW5wdXQgPT09IG51bGwgfHwgc2VhcmNoSW5wdXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlYXJjaElucHV0LmZvY3VzKCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG59KTtcbi8vcmlnaHQgc2NyZWVuIGJ1dHRvbnNcbmZ1bmN0aW9uIHBhdXNlT3JSZXN1bWUoKSB7XG4gICAgaWYgKCFpc1BhdXNlZCkge1xuICAgICAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhLXN0b3AnKTtcbiAgICAgICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnZmEtcGxheScpO1xuICAgICAgICBpc1BhdXNlZCA9ICFpc1BhdXNlZDtcbiAgICAgICAgaWZTdG9wcGVkKCk7XG4gICAgICAgIGxpdmVCdXR0b24uc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpby5wbGF5KCk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhLXBsYXknKTtcbiAgICAgICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnZmEtc3RvcCcpO1xuICAgICAgICBpc1BhdXNlZCA9ICFpc1BhdXNlZDtcbiAgICB9XG59XG5mdW5jdGlvbiBnb0xpdmUoKSB7XG4gICAgc3RhcnRpbmdUaGVTdGF0aW9uKGN1cnJlbnRTdGF0aW9uTmFtZSk7XG59XG5wYXVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGF1c2VPclJlc3VtZSk7XG5saXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnb0xpdmUpO1xuLy92b2x1bWVcbmZ1bmN0aW9uIHVwZGF0ZVZvbHVtZSgpIHtcbiAgICBjb25zdCBjdXJyZW50Vm9sdW1lID0gcGFyc2VJbnQodm9sdW1lU2xpZGVyLnZhbHVlKSAvIDEwMDtcbiAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnZvbHVtZSA9IGN1cnJlbnRWb2x1bWU7XG59XG52b2x1bWVPZmZJY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8udm9sdW1lID0gMDtcbiAgICB2b2x1bWVTbGlkZXIudmFsdWUgPSAnMCc7XG59KTtcbnZvbHVtZU1heEljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby52b2x1bWUgPSAxO1xuICAgIHZvbHVtZVNsaWRlci52YWx1ZSA9ICcxMDAnO1xufSk7XG52b2x1bWVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHVwZGF0ZVZvbHVtZSk7XG5mdW5jdGlvbiBpZlN0b3BwZWQoKSB7XG4gICAgbGFzdHNvbmcgPSB7fTtcbiAgICBldmVyc3RvcHBlZCA9IHRydWU7XG4gICAgbGl2ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNvbmdEZXN0Y3JpcHRvbi5pbm5lckhUTUwgPSBgYDtcbiAgICB9LCAxMDAwMCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=