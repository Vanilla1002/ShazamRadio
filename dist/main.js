/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
//CSS variables
function getCSSVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
const lightModePrimary = getCSSVariableValue('--light-mode-primary');
const lightModeSecondary = getCSSVariableValue('--light-mode-Secondary');
const lightModeAccent = getCSSVariableValue('--light-mode-Accent');
const darkModePrimary = getCSSVariableValue('--dark-mode-primary');
const darkModeSecondary = getCSSVariableValue('--dark-mode-Secondary');
const darkModeAccent = getCSSVariableValue('--dark-mode-Accent');
//send request, and get response
function sendSongRequest(radioName) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/identify_song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ radio_name: radioName }),
        });
        if (!response.ok) {
            songDestcripton.innerHTML = ``;
            console.error('Failed to fetch:', response.statusText);
            return;
        }
        const currentSong = yield response.json();
        console.log(currentSong);
        if (currentSong == null) {
            songDestcripton.innerHTML = ``;
            return;
        }
        if (currentSong != lastsong) {
            songDestcripton.innerHTML = `${currentSong['songName']} - ${currentSong['singer']}`;
            songDestcripton.setAttribute("href", `${currentSong['href']}`);
            lastsong = currentSong;
        }
    });
}
function sendUpdate() {
    if (isRadio && !everstopped) {
        sendSongRequest(currentStationName);
    }
}
setInterval(function () {
    sendUpdate();
}, 30000);
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
function whenChosingStation(stationId, imgSource = `../assets/_images/StationsPng/${stationId}.png`) {
    loadImg(imgSource);
    stationNameBig.textContent = radioMap[stationId].hebrewName;
    if (currentStationName != stationId) {
        startingTheStation(stationId);
    }
    currentStationName = stationId;
    openingBigStationTab();
}
function startingTheStation(stationId) {
    return __awaiter(this, void 0, void 0, function* () {
        songDestcripton.innerHTML = ``;
        currentStationAudio.pause();
        currentStationAudio = new Audio(radioMap[stationId].link);
        currentStationAudio.volume = currentVolume;
        currentStationAudio.play();
        pauseButton.classList.remove('fa-play');
        pauseButton.classList.add('fa-stop');
        liveButton.style.display = 'none';
        isPaused = false;
        everstopped = false;
        isRadio = true;
        sendSongRequest(stationId);
    });
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
    nightMode.style.color = isDark ? darkModeSecondary : lightModeSecondary;
    // background
    body.style.backgroundColor = isDark ? darkModePrimary : lightModePrimary;
    body.style.color = isDark ? darkModeSecondary : lightModeSecondary;
    // name and pictures border
    descriptions.forEach(figure => {
        const img = figure.querySelector('img');
        const figcaption = figure.querySelector('figcaption');
        // name
        figcaption.classList.toggle("description", !isDark);
        figcaption.classList.toggle("descriptionDark", isDark);
        //song name
        songDestcripton.style.color = isDark ? darkModeAccent : lightModeAccent;
        // pictures border
        img.classList.toggle("pictures", !isDark);
        img.classList.toggle("picturesDark", isDark);
    });
    // search looks
    search.style.backgroundColor = `rgba(${isDark ? '80, 80, 80' : '217,220,222'}, ${alpha})`;
    search.style.color = isDark ? darkModeAccent : lightModeAccent;
    searchInput.style.color = isDark ? darkModeAccent : lightModeAccent;
    searchIcon.style.color = isDark ? 'rgba(231, 196, 249, 0.25)' : 'rgba(0, 0, 0, 0.25)';
    // enlarge view
    enlargedView.style.backgroundColor = isDark ? darkModePrimary : lightModePrimary;
    enlargedImg.style.boxShadow = boxShadow();
    stationNameBig.style.color = isDark ? darkModeAccent : lightModeAccent;
    liveButton.style.color = isDark ? darkModeSecondary : lightModeSecondary;
    pauseButton.style.color = isDark ? darkModeAccent : lightModeAccent;
    backArrow.style.color = isDark ? darkModeSecondary : lightModeAccent;
    rightArrow.style.color = isDark ? darkModeSecondary : lightModeAccent;
    volumeOffIcon.style.color = isDark ? darkModeSecondary : lightModeAccent;
    volumeMaxIcon.style.color = isDark ? darkModeSecondary : lightModeAccent;
});
function boxShadow() {
    const color = isDark ? '231, 196, 249' : '117, 117, 117';
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
    currentVolume = parseInt(volumeSlider.value) / 100;
    currentStationAudio.volume = currentVolume;
}
volumeOffIcon.addEventListener('click', () => {
    currentStationAudio.volume = 0;
    currentVolume = 0;
    volumeSlider.value = '0';
});
volumeMaxIcon.addEventListener('click', () => {
    currentStationAudio.volume = 1;
    currentVolume = 1;
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
function loadImg(imgSource) {
    return __awaiter(this, void 0, void 0, function* () {
        enlargedImg.src = imgSource;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7OztVQ2pWQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFkaW8td2ViLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3JhZGlvLXdlYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3JhZGlvLXdlYi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhZGlvU3RhdGlvbnNJbmZvX2pzb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yYWRpb1N0YXRpb25zSW5mby5qc29uXCIpKTtcbmNsYXNzIFJhZGlvVG9IZWJyZXdOYW1lcyB7XG4gICAgY29uc3RydWN0b3IoaGVicmV3TmFtZSwgbGluaykge1xuICAgICAgICB0aGlzLmhlYnJld05hbWUgPSBoZWJyZXdOYW1lO1xuICAgICAgICB0aGlzLmxpbmsgPSBsaW5rO1xuICAgIH1cbn1cbmNvbnN0IHJhZGlvTWFwID0ge307XG5mdW5jdGlvbiBjcmVhdGVSYWRpb0RpY3QoZGljdCkge1xuICAgIGxldCBoZWxwZXIgPSBmYWxzZTtcbiAgICBsZXQgbmV3SGVicmV3TmFtZTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyYWRpb1N0YXRpb25zSW5mb19qc29uXzEuZGVmYXVsdCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBbXywgdmFsdWUxXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICghaGVscGVyKSB7XG4gICAgICAgICAgICAgICAgbmV3SGVicmV3TmFtZSA9IHZhbHVlMTtcbiAgICAgICAgICAgICAgICBoZWxwZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGljdFtrZXldID0gbmV3IFJhZGlvVG9IZWJyZXdOYW1lcyhuZXdIZWJyZXdOYW1lLCB2YWx1ZTEpO1xuICAgICAgICAgICAgICAgIGhlbHBlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY3JlYXRlUmFkaW9EaWN0KHJhZGlvTWFwKTtcbi8vRE9NIFxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbmNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmVlblwiKTtcbmNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtaW5wdXRcIik7XG5jb25zdCB0b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhclwiKTtcbmNvbnN0IG5pZ2h0TW9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFyay1tb2RlLWljb25cIik7XG5jb25zdCBzZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKTsgLy9sb29rc1xuY29uc3Qgc2VhcmNoSWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoSWNvblwiKTtcbmNvbnN0IGVubGFyZ2VkVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5sYXJnZWQtdmlld1wiKTtcbmNvbnN0IGJhY2tBcnJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFjay1hcnJvd1wiKTtcbmNvbnN0IHJpZ2h0QXJyb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LWFycm93LWlkXCIpO1xuY29uc3QgZW5sYXJnZWRJbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVubGFyZ2VkLWltZ1wiKTtcbmNvbnN0IHN0YXRpb25OYW1lQmlnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0aW9uLW5hbWUtYmlnXCIpO1xuY29uc3QgbGl2ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGl2ZS1idXR0b25cIik7XG5jb25zdCBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2UtYnV0dG9uXCIpO1xuY29uc3Qgc29uZ0Rlc3RjcmlwdG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvbmctbmFtZScpO1xuY29uc3Qgdm9sdW1lU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItdm9sXCIpO1xuY29uc3Qgdm9sdW1lT2ZmSWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9sdW1lLW9mZlwiKTtcbmNvbnN0IHZvbHVtZU1heEljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZvbHVtZS1tYXhcIik7XG5sZXQgY3VycmVudFN0YXRpb25BdWRpbyA9IG5ldyBBdWRpbygpO1xubGV0IGN1cnJlbnRTdGF0aW9uTmFtZSA9ICcnO1xubGV0IGlzUmFkaW8gPSBmYWxzZTtcbmxldCBpc0RhcmsgPSBmYWxzZTtcbmxldCBpc1BhdXNlZCA9IGZhbHNlO1xubGV0IGhhc1Njcm9sbGVkID0gZmFsc2U7XG5sZXQgZGVzY3JpcHRpb25zID0gW107XG5sZXQgYWxwaGEgPSAxO1xubGV0IGV2ZXJzdG9wcGVkID0gZmFsc2U7XG5sZXQgbGFzdHNvbmc7XG5sZXQgY3VycmVudFZvbHVtZSA9IHBhcnNlSW50KHZvbHVtZVNsaWRlci52YWx1ZSkgLyAxMDA7XG4vL0NTUyB2YXJpYWJsZXNcbmZ1bmN0aW9uIGdldENTU1ZhcmlhYmxlVmFsdWUodmFyaWFibGVOYW1lKSB7XG4gICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHZhcmlhYmxlTmFtZSkudHJpbSgpO1xufVxuY29uc3QgbGlnaHRNb2RlUHJpbWFyeSA9IGdldENTU1ZhcmlhYmxlVmFsdWUoJy0tbGlnaHQtbW9kZS1wcmltYXJ5Jyk7XG5jb25zdCBsaWdodE1vZGVTZWNvbmRhcnkgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWxpZ2h0LW1vZGUtU2Vjb25kYXJ5Jyk7XG5jb25zdCBsaWdodE1vZGVBY2NlbnQgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWxpZ2h0LW1vZGUtQWNjZW50Jyk7XG5jb25zdCBkYXJrTW9kZVByaW1hcnkgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWRhcmstbW9kZS1wcmltYXJ5Jyk7XG5jb25zdCBkYXJrTW9kZVNlY29uZGFyeSA9IGdldENTU1ZhcmlhYmxlVmFsdWUoJy0tZGFyay1tb2RlLVNlY29uZGFyeScpO1xuY29uc3QgZGFya01vZGVBY2NlbnQgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWRhcmstbW9kZS1BY2NlbnQnKTtcbi8vc2VuZCByZXF1ZXN0LCBhbmQgZ2V0IHJlc3BvbnNlXG5mdW5jdGlvbiBzZW5kU29uZ1JlcXVlc3QocmFkaW9OYW1lKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCBmZXRjaCgnL2lkZW50aWZ5X3NvbmcnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcmFkaW9fbmFtZTogcmFkaW9OYW1lIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgc29uZ0Rlc3RjcmlwdG9uLmlubmVySFRNTCA9IGBgO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoOicsIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTb25nID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50U29uZyk7XG4gICAgICAgIGlmIChjdXJyZW50U29uZyA9PSBudWxsKSB7XG4gICAgICAgICAgICBzb25nRGVzdGNyaXB0b24uaW5uZXJIVE1MID0gYGA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRTb25nICE9IGxhc3Rzb25nKSB7XG4gICAgICAgICAgICBzb25nRGVzdGNyaXB0b24uaW5uZXJIVE1MID0gYCR7Y3VycmVudFNvbmdbJ3NvbmdOYW1lJ119IC0gJHtjdXJyZW50U29uZ1snc2luZ2VyJ119YDtcbiAgICAgICAgICAgIHNvbmdEZXN0Y3JpcHRvbi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGAke2N1cnJlbnRTb25nWydocmVmJ119YCk7XG4gICAgICAgICAgICBsYXN0c29uZyA9IGN1cnJlbnRTb25nO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZW5kVXBkYXRlKCkge1xuICAgIGlmIChpc1JhZGlvICYmICFldmVyc3RvcHBlZCkge1xuICAgICAgICBzZW5kU29uZ1JlcXVlc3QoY3VycmVudFN0YXRpb25OYW1lKTtcbiAgICB9XG59XG5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgc2VuZFVwZGF0ZSgpO1xufSwgMzAwMDApO1xuLy9jcmVhdGluZyB0aGUgbWFpbiAoYWxsIHRoZSBzdGF0aW9ucylcbmZvciAoY29uc3QgcmFkaW9OYW1lIGluIHJhZGlvTWFwKSB7XG4gICAgY29uc3QgaW1nU291cmNlID0gYC4uL2Fzc2V0cy9faW1hZ2VzL1N0YXRpb25zUG5nLyR7cmFkaW9OYW1lfS5wbmdgO1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBlbGVtZW50LnNyYyA9IGltZ1NvdXJjZTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BpY3R1cmVzJyk7XG4gICAgLy9wcmVzc2FibGVcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gd2hlbkNob3NpbmdTdGF0aW9uKHJhZGlvTmFtZSkpO1xuICAgIGNvbnN0IGVsZW1lbnREZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZ2NhcHRpb24nKTtcbiAgICBlbGVtZW50RGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnZGVzY3JpcHRpb24nKTtcbiAgICBlbGVtZW50RGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmFkaW9NYXBbcmFkaW9OYW1lXS5oZWJyZXdOYW1lKSk7XG4gICAgY29uc3QgZmlndXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmlndXJlJyk7XG4gICAgZmlndXJlLnNldEF0dHJpYnV0ZSgnaWQnLCByYWRpb05hbWUpO1xuICAgIGZpZ3VyZS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZWxlbWVudERlc2NyaXB0aW9uKTtcbiAgICBkZXNjcmlwdGlvbnMucHVzaChmaWd1cmUpO1xuICAgIG1haW4gPT09IG51bGwgfHwgbWFpbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogbWFpbi5hcHBlbmRDaGlsZChmaWd1cmUpO1xufVxuZnVuY3Rpb24gd2hlbkNob3NpbmdTdGF0aW9uKHN0YXRpb25JZCwgaW1nU291cmNlID0gYC4uL2Fzc2V0cy9faW1hZ2VzL1N0YXRpb25zUG5nLyR7c3RhdGlvbklkfS5wbmdgKSB7XG4gICAgbG9hZEltZyhpbWdTb3VyY2UpO1xuICAgIHN0YXRpb25OYW1lQmlnLnRleHRDb250ZW50ID0gcmFkaW9NYXBbc3RhdGlvbklkXS5oZWJyZXdOYW1lO1xuICAgIGlmIChjdXJyZW50U3RhdGlvbk5hbWUgIT0gc3RhdGlvbklkKSB7XG4gICAgICAgIHN0YXJ0aW5nVGhlU3RhdGlvbihzdGF0aW9uSWQpO1xuICAgIH1cbiAgICBjdXJyZW50U3RhdGlvbk5hbWUgPSBzdGF0aW9uSWQ7XG4gICAgb3BlbmluZ0JpZ1N0YXRpb25UYWIoKTtcbn1cbmZ1bmN0aW9uIHN0YXJ0aW5nVGhlU3RhdGlvbihzdGF0aW9uSWQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBzb25nRGVzdGNyaXB0b24uaW5uZXJIVE1MID0gYGA7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpbyA9IG5ldyBBdWRpbyhyYWRpb01hcFtzdGF0aW9uSWRdLmxpbmspO1xuICAgICAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnZvbHVtZSA9IGN1cnJlbnRWb2x1bWU7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGxheSgpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1wbGF5Jyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZhLXN0b3AnKTtcbiAgICAgICAgbGl2ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBpc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICBldmVyc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBpc1JhZGlvID0gdHJ1ZTtcbiAgICAgICAgc2VuZFNvbmdSZXF1ZXN0KHN0YXRpb25JZCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBiYWNrVG9NYWluU2NyZWVuKCkge1xuICAgIGVubGFyZ2VkVmlldy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAvL3Nob3dpbmcgYWxsIGFnYWluXG4gICAgbWFpbi5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgZm9yIChjb25zdCByYWRpb05hbWUgaW4gcmFkaW9NYXApIHtcbiAgICAgICAgY29uc3QgY3VycmVudEZpZ3VyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhZGlvTmFtZSk7XG4gICAgICAgIGN1cnJlbnRGaWd1cmUgPT09IG51bGwgfHwgY3VycmVudEZpZ3VyZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEZpZ3VyZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB9XG4gICAgLy93YWl0IGZvciBhbmltYXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICByaWdodEFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xuICAgIH0sIDUwMCk7XG59XG5mdW5jdGlvbiBvcGVuaW5nQmlnU3RhdGlvblRhYigpIHtcbiAgICBlbmxhcmdlZFZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGVubGFyZ2VkVmlldy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgcmlnaHRBcnJvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB9LCAxMCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG1haW4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIH0sIDUwMCk7XG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcbn1cbmJhY2tBcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJhY2tUb01haW5TY3JlZW4pO1xucmlnaHRBcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9wZW5pbmdCaWdTdGF0aW9uVGFiKTtcbi8vc2VhcmNoIGJhciBjb250YW50XG5zZWFyY2hJbnB1dCA9PT0gbnVsbCB8fCBzZWFyY2hJbnB1dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBmb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcCkge1xuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSAocmFkaW9NYXBbcmFkaW9OYW1lXS5oZWJyZXdOYW1lKS5pbmNsdWRlcyhpbnB1dCkgfHwgcmFkaW9OYW1lLmluY2x1ZGVzKGlucHV0KTtcbiAgICAgICAgY29uc3QgY3VycmVudEZpZ3VyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhZGlvTmFtZSk7XG4gICAgICAgIGN1cnJlbnRGaWd1cmUgPT09IG51bGwgfHwgY3VycmVudEZpZ3VyZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEZpZ3VyZS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIsICFpc1Zpc2libGUpO1xuICAgIH1cbn0pO1xuLy9wcmV2ZW50aW5nIGVudGVyXG50b3BCYXIuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn0pO1xuLy9kYXJrbW9kZSBcbm5pZ2h0TW9kZSA9PT0gbnVsbCB8fCBuaWdodE1vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5pZ2h0TW9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlzRGFyayA9ICFpc0Rhcms7XG4gICAgLy8gbmlnaHRtb2RlIGljb25cbiAgICBuaWdodE1vZGUuY2xhc3NMaXN0LnRvZ2dsZShcImZhLW1vb25cIiwgIWlzRGFyayk7XG4gICAgbmlnaHRNb2RlLmNsYXNzTGlzdC50b2dnbGUoXCJmYS1zdW5cIiwgaXNEYXJrKTtcbiAgICBuaWdodE1vZGUuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBkYXJrTW9kZVNlY29uZGFyeSA6IGxpZ2h0TW9kZVNlY29uZGFyeTtcbiAgICAvLyBiYWNrZ3JvdW5kXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpc0RhcmsgPyBkYXJrTW9kZVByaW1hcnkgOiBsaWdodE1vZGVQcmltYXJ5O1xuICAgIGJvZHkuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBkYXJrTW9kZVNlY29uZGFyeSA6IGxpZ2h0TW9kZVNlY29uZGFyeTtcbiAgICAvLyBuYW1lIGFuZCBwaWN0dXJlcyBib3JkZXJcbiAgICBkZXNjcmlwdGlvbnMuZm9yRWFjaChmaWd1cmUgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSBmaWd1cmUucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIGNvbnN0IGZpZ2NhcHRpb24gPSBmaWd1cmUucXVlcnlTZWxlY3RvcignZmlnY2FwdGlvbicpO1xuICAgICAgICAvLyBuYW1lXG4gICAgICAgIGZpZ2NhcHRpb24uY2xhc3NMaXN0LnRvZ2dsZShcImRlc2NyaXB0aW9uXCIsICFpc0RhcmspO1xuICAgICAgICBmaWdjYXB0aW9uLmNsYXNzTGlzdC50b2dnbGUoXCJkZXNjcmlwdGlvbkRhcmtcIiwgaXNEYXJrKTtcbiAgICAgICAgLy9zb25nIG5hbWVcbiAgICAgICAgc29uZ0Rlc3RjcmlwdG9uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gZGFya01vZGVBY2NlbnQgOiBsaWdodE1vZGVBY2NlbnQ7XG4gICAgICAgIC8vIHBpY3R1cmVzIGJvcmRlclxuICAgICAgICBpbWcuY2xhc3NMaXN0LnRvZ2dsZShcInBpY3R1cmVzXCIsICFpc0RhcmspO1xuICAgICAgICBpbWcuY2xhc3NMaXN0LnRvZ2dsZShcInBpY3R1cmVzRGFya1wiLCBpc0RhcmspO1xuICAgIH0pO1xuICAgIC8vIHNlYXJjaCBsb29rc1xuICAgIHNlYXJjaC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgke2lzRGFyayA/ICc4MCwgODAsIDgwJyA6ICcyMTcsMjIwLDIyMid9LCAke2FscGhhfSlgO1xuICAgIHNlYXJjaC5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGRhcmtNb2RlQWNjZW50IDogbGlnaHRNb2RlQWNjZW50O1xuICAgIHNlYXJjaElucHV0LnN0eWxlLmNvbG9yID0gaXNEYXJrID8gZGFya01vZGVBY2NlbnQgOiBsaWdodE1vZGVBY2NlbnQ7XG4gICAgc2VhcmNoSWNvbi5zdHlsZS5jb2xvciA9IGlzRGFyayA/ICdyZ2JhKDIzMSwgMTk2LCAyNDksIDAuMjUpJyA6ICdyZ2JhKDAsIDAsIDAsIDAuMjUpJztcbiAgICAvLyBlbmxhcmdlIHZpZXdcbiAgICBlbmxhcmdlZFZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXNEYXJrID8gZGFya01vZGVQcmltYXJ5IDogbGlnaHRNb2RlUHJpbWFyeTtcbiAgICBlbmxhcmdlZEltZy5zdHlsZS5ib3hTaGFkb3cgPSBib3hTaGFkb3coKTtcbiAgICBzdGF0aW9uTmFtZUJpZy5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGRhcmtNb2RlQWNjZW50IDogbGlnaHRNb2RlQWNjZW50O1xuICAgIGxpdmVCdXR0b24uc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBkYXJrTW9kZVNlY29uZGFyeSA6IGxpZ2h0TW9kZVNlY29uZGFyeTtcbiAgICBwYXVzZUJ1dHRvbi5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGRhcmtNb2RlQWNjZW50IDogbGlnaHRNb2RlQWNjZW50O1xuICAgIGJhY2tBcnJvdy5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGRhcmtNb2RlU2Vjb25kYXJ5IDogbGlnaHRNb2RlQWNjZW50O1xuICAgIHJpZ2h0QXJyb3cuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBkYXJrTW9kZVNlY29uZGFyeSA6IGxpZ2h0TW9kZUFjY2VudDtcbiAgICB2b2x1bWVPZmZJY29uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gZGFya01vZGVTZWNvbmRhcnkgOiBsaWdodE1vZGVBY2NlbnQ7XG4gICAgdm9sdW1lTWF4SWNvbi5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGRhcmtNb2RlU2Vjb25kYXJ5IDogbGlnaHRNb2RlQWNjZW50O1xufSk7XG5mdW5jdGlvbiBib3hTaGFkb3coKSB7XG4gICAgY29uc3QgY29sb3IgPSBpc0RhcmsgPyAnMjMxLCAxOTYsIDI0OScgOiAnMTE3LCAxMTcsIDExNyc7XG4gICAgcmV0dXJuIGAwcHggMTBweCAxNXB4IHJnYmEoJHtjb2xvcn0sIDAuNSksIDEwcHggMjBweCAyMHB4IHJnYmEoJHtjb2xvcn0sIDAuNSksIDBweCAzMHB4IDQwcHggcmdiYSgke2NvbG9yfSwgMC41KWA7XG59XG5mdW5jdGlvbiB1cGRhdGVBbHBoYShlbGVtZW50LCBuZXdBbHBoYSkge1xuICAgIC8vIHVwZGF0ZSBiYWNrZ3JvdW5kIGNvbG9yIGFscGhhIHZhbHVlXG4gICAgY29uc3QgY3VycmVudENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuYmFja2dyb3VuZENvbG9yO1xuICAgIGNvbnN0IHJnYlZhbHVlcyA9IGN1cnJlbnRDb2xvci5tYXRjaCgvXFxkKy9nKTtcbiAgICBpZiAocmdiVmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IFtyLCBnLCBiXSA9IHJnYlZhbHVlcztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgke3J9LCAke2d9LCAke2J9LCAke25ld0FscGhhfSlgO1xuICAgIH1cbn1cbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWhhc1Njcm9sbGVkIHx8IHdpbmRvdy5zY3JvbGxZID09IDApIHtcbiAgICAgICAgLy9zY3JvbGxpbmdcbiAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcbiAgICAgICAgICAgIC8vc2VhcmNoIGxvb2tzXG4gICAgICAgICAgICB1cGRhdGVBbHBoYShzZWFyY2gsIDApO1xuICAgICAgICAgICAgYWxwaGEgPSAwO1xuICAgICAgICAgICAgLy9zZWFyY2ggcG9zaXRpb25cbiAgICAgICAgICAgIHRvcEJhci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LWVuZCc7XG4gICAgICAgICAgICBzZWFyY2hJY29uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICAgICAgICAgIGhhc1Njcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlYXJjaElucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgLy9nZXRpbmcgYmFjayB0byB0b3BcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL3NlYXJjaCBsb29rc1xuICAgICAgICAgICAgdXBkYXRlQWxwaGEoc2VhcmNoLCAxKTtcbiAgICAgICAgICAgIGFscGhhID0gMTtcbiAgICAgICAgICAgIC8vc2VhcmNoIHBvc2l0aW9uXG4gICAgICAgICAgICB0b3BCYXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICAgICAgICAgIHNlYXJjaEljb24uc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgaGFzU2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlYXJjaElucHV0LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbn07XG5zZWFyY2hJY29uID09PSBudWxsIHx8IHNlYXJjaEljb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlYXJjaEljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpZiAoaGFzU2Nyb2xsZWQpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNlYXJjaElucHV0ID09PSBudWxsIHx8IHNlYXJjaElucHV0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWFyY2hJbnB1dC5mb2N1cygpO1xuICAgICAgICB9LCAxMCk7XG4gICAgfVxufSk7XG4vL3JpZ2h0IHNjcmVlbiBidXR0b25zXG5mdW5jdGlvbiBwYXVzZU9yUmVzdW1lKCkge1xuICAgIGlmICghaXNQYXVzZWQpIHtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpby5wYXVzZSgpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1zdG9wJyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZhLXBsYXknKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgICAgIGlmU3RvcHBlZCgpO1xuICAgICAgICBsaXZlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGxheSgpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1wbGF5Jyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZhLXN0b3AnKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ29MaXZlKCkge1xuICAgIHN0YXJ0aW5nVGhlU3RhdGlvbihjdXJyZW50U3RhdGlvbk5hbWUpO1xufVxucGF1c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBhdXNlT3JSZXN1bWUpO1xubGl2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZ29MaXZlKTtcbi8vdm9sdW1lXG5mdW5jdGlvbiB1cGRhdGVWb2x1bWUoKSB7XG4gICAgY3VycmVudFZvbHVtZSA9IHBhcnNlSW50KHZvbHVtZVNsaWRlci52YWx1ZSkgLyAxMDA7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby52b2x1bWUgPSBjdXJyZW50Vm9sdW1lO1xufVxudm9sdW1lT2ZmSWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnZvbHVtZSA9IDA7XG4gICAgY3VycmVudFZvbHVtZSA9IDA7XG4gICAgdm9sdW1lU2xpZGVyLnZhbHVlID0gJzAnO1xufSk7XG52b2x1bWVNYXhJY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8udm9sdW1lID0gMTtcbiAgICBjdXJyZW50Vm9sdW1lID0gMTtcbiAgICB2b2x1bWVTbGlkZXIudmFsdWUgPSAnMTAwJztcbn0pO1xudm9sdW1lU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCB1cGRhdGVWb2x1bWUpO1xuZnVuY3Rpb24gaWZTdG9wcGVkKCkge1xuICAgIGxhc3Rzb25nID0ge307XG4gICAgZXZlcnN0b3BwZWQgPSB0cnVlO1xuICAgIGxpdmVCdXR0b24uc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzb25nRGVzdGNyaXB0b24uaW5uZXJIVE1MID0gYGA7XG4gICAgfSwgMTAwMDApO1xufVxuZnVuY3Rpb24gbG9hZEltZyhpbWdTb3VyY2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBlbmxhcmdlZEltZy5zcmMgPSBpbWdTb3VyY2U7XG4gICAgfSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=