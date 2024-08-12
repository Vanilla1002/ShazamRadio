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
let currentVolume = parseInt(volumeSlider.value);
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
    if (!isRadio) {
        currentStationAudio = new Audio(radioMap[stationId].link);
        currentStationAudio.play();
        isRadio = true;
    }
    else if (currentStationName != stationId) {
        startingTheStation(stationId);
    }
    currentStationName = stationId;
    rotatingToRight();
}
function startingTheStation(stationId) {
    currentStationAudio.pause();
    currentStationAudio = new Audio(radioMap[stationId].link);
    currentStationAudio.play();
    pauseButton.classList.remove('fa-play');
    pauseButton.classList.add('fa-stop');
    isPaused = false;
    everstopped = false;
}
function rotatingToLeft() {
    enlargedView.classList.remove('active');
    //showing all again
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
function rotatingToRight() {
    enlargedView.classList.remove('hidden');
    setTimeout(() => {
        enlargedView.classList.add('active');
        searchInput.value = '';
        rightArrow.classList.add('hidden');
    }, 10);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
    body.classList.add('no-scroll');
}
backArrow.addEventListener('click', rotatingToLeft);
rightArrow.addEventListener('click', rotatingToRight);
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
        everstopped = true;
    }
    else {
        currentStationAudio.play();
        pauseButton.classList.remove('fa-play');
        pauseButton.classList.add('fa-stop');
        isPaused = !isPaused;
    }
}
function goLive() {
    if (everstopped) {
        startingTheStation(currentStationName);
    }
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


/***/ }),

/***/ "./src/radioStationsInfo.json":
/*!************************************!*\
  !*** ./src/radioStationsInfo.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"glglz":{"hebrewName":"גלגלצ","link":"https://glzwizzlv.bynetcdn.com/glglz_mp3?awCollectionId=misc&awEpisodeId=glglz"},"glz":{"hebrewName":"גלי צהל","link":"https://glzwizzlv.bynetcdn.com/glz_mp3?awCollectionId=misc&awEpisodeId=glz"},"darom":{"hebrewName":"רדיו דרום","link":"https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio"},"darom101.5FM":{"hebrewName":"רדיו דרום 101.5","link":"https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio"},"kan88":{"hebrewName":"כאן 88","link":"https://27873.live.streamtheworld.com/KAN_88.mp3?dist=coolsite"},"kanBet":{"hebrewName":"כאן רשת ב","link":"https://22533.live.streamtheworld.com/KAN_BET.mp3?dist=coolsite"},"kanGimmel":{"hebrewName":"כאן רשת ג","link":"https://25583.live.streamtheworld.com/KAN_GIMMEL.mp3?dist=coolsite"},"kanMoreshet":{"hebrewName":"כאן מורשת","link":"https://25483.live.streamtheworld.com/KAN_MORESHET.mp3?dist=coolsite"},"kanKolHamusica":{"hebrewName":"כאן קול המוזיקה","link":"https://27873.live.streamtheworld.com/KAN_KOL_HAMUSICA.mp3?dist=coolsite"},"kanReka":{"hebrewName":"כאן רקע","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite"},"kanTarbut":{"hebrewName":"כאן תרבות","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3?dist=coolsite"},"eco99FM":{"hebrewName":"אקו 99fm","link":"https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio"},"kolUniversity":{"hebrewName":"קול האוניברסיטה","link":"https://1062onair.runi.ac.il/idc123.mp3"},"bgu":{"hebrewName":"אוניברסיטת בן-גוריון","link":"https://bguradio.co/listen/bguradio/radio.mp3"},"103FM":{"hebrewName":"רדיו 103FM","link":"https://cdn.cybercdn.live/103FM/Live/icecast.audio"},"tzafon104.5":{"hebrewName":"צפון 104.5","link":"https://cdn.cybercdn.live/Tzafon_NonStop/Live_Audio/icecast.audio"},"ivriShesh":{"hebrewName":"עברי שש","link":"https://streaming.radio.co/sa06221901/listen"},"radius":{"hebrewName":"רדיו רדיוס","link":"https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio"},"r90":{"hebrewName":"רדיו 90","link":"https://cdn.cybercdn.live/Emtza_Haderech/Live_Audio/icecast.audio"},"telAviv102FM":{"hebrewName":"רדיו תל אביב ","link":"https://102.livecdn.biz/102fm_mp3"},"shiridikaon":{"hebrewName":"שירי דיכאון","link":"https://diki.mediacast.co.il/diki"},"shiriAhava":{"hebrewName":"שירי אהבה","link":"https://liveradio.co.il/radiolove"},"kezevMizrahi":{"hebrewName":"קצב מזרחי","link":"https://liveradio.co.il/radio_i"},"kezevYamTichoni":{"hebrewName":"קצב ים-תיכוני","link":"https://liveradio.co.il:1040/;"},"kolRamatHasharon":{"hebrewName":"קול רמת השרון","link":"https://radio.streamgates.net/stream/1036"},"kolBarama":{"hebrewName":"קול ברמה","link":"https://cdn.cybercdn.live/Kol_Barama/Live_Audio/icecast.audio"},"kolHagolan":{"hebrewName":"קול הגולן","link":"https://liveradio.co.il/kolhagolan"},"kolHagalilTop":{"hebrewName":"קול הגליל","link":"https://radio.streamgates.net/stream/galil"},"kolHayamHaadom":{"hebrewName":"קול הים התיכון","link":"https://cdn.cybercdn.live/Eilat_Radio/Live/icecast.audio"},"kolHaKinneret":{"hebrewName":"קול הכינרת","link":"https://radio.streamgates.net/stream/kinneret"},"kolHamizrah":{"hebrewName":"קול המזרח","link":"https://mzr.mediacast.co.il/mzradio"},"kolHamerkaz":{"hebrewName":"קול המרכז","link":"https://liveradio.co.il:9050/;"},"kolHashfela":{"hebrewName":"קול השפלה","link":"https://radio.streamgates.net/stream/1036kh"},"kolHai":{"hebrewName":"קול חי","link":"https://live.kcm.fm/live:"},"kolYezreel":{"hebrewName":"קול יזרעאל","link":"https://radio.streamgates.net/stream/yezreel"},"kolNatanya":{"hebrewName":"קול נתניה","link":"https://radio.streamgates.net/stream/netanya"},"kolHanachal":{"hebrewName":"קול הנחל","link":"https://cast4.asurahosting.com/proxy/yaniv/stream"},"kolRega":{"hebrewName":"קול רגע","link":"https://cdn.cybercdn.live/Kol_Rega/Live_Audio/icecast.audio"},"sol":{"hebrewName":"רדיו סול","link":"https://radio.streamgates.net/stream/sol"},"sahar":{"hebrewName":"רדיו סהר","link":"https://live.ecast.co.il/stream/sahar"},"neto":{"hebrewName":"רדיו נטו","link":"https://live.ecast.co.il/stream/radioneto1"},"noshmimMizrahit":{"hebrewName":"נושמים מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"nostalgiaIsraeli":{"hebrewName":"נוסטלגיה ישראלי","link":"http://194.213.4.197:8000/;stream/1"},"martitMeitarBalev":{"hebrewName":"רדיו מרטיט מיתר בלב","link":"https://liveradio.co.il/wet"},"mizrahit":{"hebrewName":"רדיו מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"mahotHachaim":{"hebrewName":"רדיו מהות-החיים","link":"https://eol-live.cdnwiz.com/eol/eolsite/icecast.audio"},"levHamedina":{"hebrewName":"רדיו לב המדינה","link":"https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio"},"KaholYavan":{"hebrewName":"רדיו כחול-יוון","link":"https://icecast.live/proxy/livegreece/livegreece"},"jerusalem":{"hebrewName":"רדיו ירושלים","link":"https://cdn.cybercdn.live/JerusalemRadio/Live/icecast.audio"},"101.5":{"hebrewName":"רדיו 101.5","link":"https://cdn.cybercdn.live/Hatahana_1015/Live_Audio/icecast.audio"},"hakatze":{"hebrewName":"רדיו הקצה","link":"https://kzradio.mediacast.co.il/kzradio_live/kzradio/icecast.audio"},"galiIsrael":{"hebrewName":"רדיו גלי-ישראל","link":"https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio"},"oranim":{"hebrewName":"רדיו אורנים","link":"https://radio.streamgates.net/stream/oranim"},"anime":{"hebrewName":"אנימה","link":"https://stream.animeradio.de/animeradio.mp3"},"jazzFM":{"hebrewName":"ג\'אז","link":"https://jazzfm91.streamb.live/SB00009"},"Lo-fi":{"hebrewName":"לו-פי","link":"https://ec3.yesstreaming.net:3755/stream"}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpREFBaUQsbUJBQU8sQ0FBQyw4REFBMEI7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELFVBQVU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsVUFBVTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwyQ0FBMkMsd0NBQXdDLElBQUksTUFBTTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsaUNBQWlDLE1BQU0sOEJBQThCLE1BQU0sNkJBQTZCLE1BQU07QUFDOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksU0FBUztBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7Ozs7OztVQzdQQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFkaW8td2ViLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3JhZGlvLXdlYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3JhZGlvLXdlYi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByYWRpb1N0YXRpb25zSW5mb19qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmFkaW9TdGF0aW9uc0luZm8uanNvblwiKSk7XG5jbGFzcyBSYWRpb1RvSGVicmV3TmFtZXMge1xuICAgIGNvbnN0cnVjdG9yKGhlYnJld05hbWUsIGxpbmspIHtcbiAgICAgICAgdGhpcy5oZWJyZXdOYW1lID0gaGVicmV3TmFtZTtcbiAgICAgICAgdGhpcy5saW5rID0gbGluaztcbiAgICB9XG59XG5jb25zdCByYWRpb01hcCA9IHt9O1xuZnVuY3Rpb24gY3JlYXRlUmFkaW9EaWN0KGRpY3QpIHtcbiAgICBsZXQgaGVscGVyID0gZmFsc2U7XG4gICAgbGV0IG5ld0hlYnJld05hbWU7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocmFkaW9TdGF0aW9uc0luZm9fanNvbl8xLmRlZmF1bHQpKSB7XG4gICAgICAgIGZvciAoY29uc3QgW18sIHZhbHVlMV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoIWhlbHBlcikge1xuICAgICAgICAgICAgICAgIG5ld0hlYnJld05hbWUgPSB2YWx1ZTE7XG4gICAgICAgICAgICAgICAgaGVscGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpY3Rba2V5XSA9IG5ldyBSYWRpb1RvSGVicmV3TmFtZXMobmV3SGVicmV3TmFtZSwgdmFsdWUxKTtcbiAgICAgICAgICAgICAgICBoZWxwZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNyZWF0ZVJhZGlvRGljdChyYWRpb01hcCk7XG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuY29uc3QgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NyZWVuXCIpO1xuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcbmNvbnN0IHRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFyXCIpO1xuY29uc3QgbmlnaHRNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXJrLW1vZGUtaWNvblwiKTtcbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpOyAvL2xvb2tzXG5jb25zdCBzZWFyY2hJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hJY29uXCIpO1xuY29uc3QgZW5sYXJnZWRWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmxhcmdlZC12aWV3XCIpO1xuY29uc3QgYmFja0Fycm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrLWFycm93XCIpO1xuY29uc3QgcmlnaHRBcnJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtYXJyb3ctaWRcIik7XG5jb25zdCBlbmxhcmdlZEltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5sYXJnZWQtaW1nXCIpO1xuY29uc3Qgc3RhdGlvbk5hbWVCaWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXRpb24tbmFtZS1iaWdcIik7XG5jb25zdCBsaXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXZlLWJ1dHRvblwiKTtcbmNvbnN0IHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZS1idXR0b25cIik7XG5jb25zdCB2b2x1bWVTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlci12b2xcIik7XG5jb25zdCB2b2x1bWVPZmZJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2b2x1bWUtb2ZmXCIpO1xuY29uc3Qgdm9sdW1lTWF4SWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9sdW1lLW1heFwiKTtcbmxldCBjdXJyZW50U3RhdGlvbkF1ZGlvID0gbmV3IEF1ZGlvKCk7XG5sZXQgY3VycmVudFN0YXRpb25OYW1lID0gJyc7XG5sZXQgaXNSYWRpbyA9IGZhbHNlO1xubGV0IGlzRGFyayA9IGZhbHNlO1xubGV0IGlzUGF1c2VkID0gZmFsc2U7XG5sZXQgaGFzU2Nyb2xsZWQgPSBmYWxzZTtcbmxldCBkZXNjcmlwdGlvbnMgPSBbXTtcbmxldCBhbHBoYSA9IDE7XG5sZXQgZXZlcnN0b3BwZWQgPSBmYWxzZTtcbmxldCBjdXJyZW50Vm9sdW1lID0gcGFyc2VJbnQodm9sdW1lU2xpZGVyLnZhbHVlKTtcbi8vY3JlYXRpbmcgdGhlIG1haW4gKGFsbCB0aGUgc3RhdGlvbnMpXG5mb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcCkge1xuICAgIGNvbnN0IGltZ1NvdXJjZSA9IGAuLi9hc3NldHMvX2ltYWdlcy9TdGF0aW9uc1BuZy8ke3JhZGlvTmFtZX0ucG5nYDtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZWxlbWVudC5zcmMgPSBpbWdTb3VyY2U7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwaWN0dXJlcycpO1xuICAgIC8vcHJlc3NhYmxlXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHdoZW5DaG9zaW5nU3RhdGlvbihyYWRpb05hbWUpKTtcbiAgICBjb25zdCBlbGVtZW50RGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWdjYXB0aW9uJyk7XG4gICAgZWxlbWVudERlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyaXB0aW9uJyk7XG4gICAgZWxlbWVudERlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJhZGlvTWFwW3JhZGlvTmFtZV0uaGVicmV3TmFtZSkpO1xuICAgIGNvbnN0IGZpZ3VyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZ3VyZScpO1xuICAgIGZpZ3VyZS5zZXRBdHRyaWJ1dGUoJ2lkJywgcmFkaW9OYW1lKTtcbiAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgZmlndXJlLmFwcGVuZENoaWxkKGVsZW1lbnREZXNjcmlwdGlvbik7XG4gICAgZGVzY3JpcHRpb25zLnB1c2goZmlndXJlKTtcbiAgICBtYWluID09PSBudWxsIHx8IG1haW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1haW4uYXBwZW5kQ2hpbGQoZmlndXJlKTtcbn1cbmZ1bmN0aW9uIHdoZW5DaG9zaW5nU3RhdGlvbihzdGF0aW9uSWQpIHtcbiAgICBlbmxhcmdlZEltZy5zcmMgPSBgLi4vYXNzZXRzL19pbWFnZXMvU3RhdGlvbnNQbmcvJHtzdGF0aW9uSWR9LnBuZ2A7XG4gICAgc3RhdGlvbk5hbWVCaWcudGV4dENvbnRlbnQgPSByYWRpb01hcFtzdGF0aW9uSWRdLmhlYnJld05hbWU7XG4gICAgaWYgKCFpc1JhZGlvKSB7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8gPSBuZXcgQXVkaW8ocmFkaW9NYXBbc3RhdGlvbklkXS5saW5rKTtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpby5wbGF5KCk7XG4gICAgICAgIGlzUmFkaW8gPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdXJyZW50U3RhdGlvbk5hbWUgIT0gc3RhdGlvbklkKSB7XG4gICAgICAgIHN0YXJ0aW5nVGhlU3RhdGlvbihzdGF0aW9uSWQpO1xuICAgIH1cbiAgICBjdXJyZW50U3RhdGlvbk5hbWUgPSBzdGF0aW9uSWQ7XG4gICAgcm90YXRpbmdUb1JpZ2h0KCk7XG59XG5mdW5jdGlvbiBzdGFydGluZ1RoZVN0YXRpb24oc3RhdGlvbklkKSB7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby5wYXVzZSgpO1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8gPSBuZXcgQXVkaW8ocmFkaW9NYXBbc3RhdGlvbklkXS5saW5rKTtcbiAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnBsYXkoKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1wbGF5Jyk7XG4gICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnZmEtc3RvcCcpO1xuICAgIGlzUGF1c2VkID0gZmFsc2U7XG4gICAgZXZlcnN0b3BwZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHJvdGF0aW5nVG9MZWZ0KCkge1xuICAgIGVubGFyZ2VkVmlldy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAvL3Nob3dpbmcgYWxsIGFnYWluXG4gICAgZm9yIChjb25zdCByYWRpb05hbWUgaW4gcmFkaW9NYXApIHtcbiAgICAgICAgY29uc3QgY3VycmVudEZpZ3VyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhZGlvTmFtZSk7XG4gICAgICAgIGN1cnJlbnRGaWd1cmUgPT09IG51bGwgfHwgY3VycmVudEZpZ3VyZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEZpZ3VyZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB9XG4gICAgLy93YWl0IGZvciBhbmltYXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICByaWdodEFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xuICAgIH0sIDUwMCk7XG59XG5mdW5jdGlvbiByb3RhdGluZ1RvUmlnaHQoKSB7XG4gICAgZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBlbmxhcmdlZFZpZXcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHNlYXJjaElucHV0LnZhbHVlID0gJyc7XG4gICAgICAgIHJpZ2h0QXJyb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgfSwgMTApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgfSwgNTAwKTtcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xufVxuYmFja0Fycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcm90YXRpbmdUb0xlZnQpO1xucmlnaHRBcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJvdGF0aW5nVG9SaWdodCk7XG4vL3NlYXJjaCBiYXIgY29udGFudFxuc2VhcmNoSW5wdXQgPT09IG51bGwgfHwgc2VhcmNoSW5wdXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQudmFsdWU7XG4gICAgZm9yIChjb25zdCByYWRpb05hbWUgaW4gcmFkaW9NYXApIHtcbiAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gKHJhZGlvTWFwW3JhZGlvTmFtZV0uaGVicmV3TmFtZSkuaW5jbHVkZXMoaW5wdXQpIHx8IHJhZGlvTmFtZS5pbmNsdWRlcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGaWd1cmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyYWRpb05hbWUpO1xuICAgICAgICBjdXJyZW50RmlndXJlID09PSBudWxsIHx8IGN1cnJlbnRGaWd1cmUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRGaWd1cmUuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiLCAhaXNWaXNpYmxlKTtcbiAgICB9XG59KTtcbi8vcHJldmVudGluZyBlbnRlclxudG9wQmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcbi8vZGFya21vZGUgXG5uaWdodE1vZGUgPT09IG51bGwgfHwgbmlnaHRNb2RlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuaWdodE1vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpc0RhcmsgPSAhaXNEYXJrO1xuICAgIC8vIG5pZ2h0bW9kZSBpY29uXG4gICAgbmlnaHRNb2RlLmNsYXNzTGlzdC50b2dnbGUoXCJmYS1tb29uXCIsICFpc0RhcmspO1xuICAgIG5pZ2h0TW9kZS5jbGFzc0xpc3QudG9nZ2xlKFwiZmEtc3VuXCIsIGlzRGFyayk7XG4gICAgbmlnaHRNb2RlLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3doaXRlJyA6ICdibGFjayc7XG4gICAgLy8gYmFja2dyb3VuZFxuICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXNEYXJrID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XG4gICAgYm9keS5zdHlsZS5jb2xvciA9IGlzRGFyayA/ICd3aGl0ZScgOiAnYmxhY2snO1xuICAgIC8vIG5hbWUgYW5kIHBpY3R1cmVzIGJvcmRlclxuICAgIGRlc2NyaXB0aW9ucy5mb3JFYWNoKGZpZ3VyZSA9PiB7XG4gICAgICAgIGNvbnN0IGltZyA9IGZpZ3VyZS5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgICAgY29uc3QgZmlnY2FwdGlvbiA9IGZpZ3VyZS5xdWVyeVNlbGVjdG9yKCdmaWdjYXB0aW9uJyk7XG4gICAgICAgIC8vIG5hbWVcbiAgICAgICAgZmlnY2FwdGlvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZGVzY3JpcHRpb25cIiwgIWlzRGFyayk7XG4gICAgICAgIGZpZ2NhcHRpb24uY2xhc3NMaXN0LnRvZ2dsZShcImRlc2NyaXB0aW9uRGFya1wiLCBpc0RhcmspO1xuICAgICAgICAvLyBwaWN0dXJlcyBib3JkZXJcbiAgICAgICAgaW1nLmNsYXNzTGlzdC50b2dnbGUoXCJwaWN0dXJlc1wiLCAhaXNEYXJrKTtcbiAgICAgICAgaW1nLmNsYXNzTGlzdC50b2dnbGUoXCJwaWN0dXJlc0RhcmtcIiwgaXNEYXJrKTtcbiAgICB9KTtcbiAgICAvLyBzZWFyY2ggbG9va3NcbiAgICBzZWFyY2guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoJHtpc0RhcmsgPyAnODAsIDgwLCA4MCcgOiAnMjQ2LCAyNDYsIDI0Nid9LCAke2FscGhhfSlgO1xuICAgIHNlYXJjaC5zdHlsZS5jb2xvciA9IGlzRGFyayA/ICd3aGl0ZScgOiAnYmxhY2snO1xuICAgIHNlYXJjaElucHV0LnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3doaXRlJyA6ICcjMzMzMzMzJztcbiAgICBzZWFyY2hJY29uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gJ3JnYmEoMjU1LDI1NSwyNTUsMC4yNSknIDogJ3JnYmEoMCwwLDAsMC4yNSknO1xuICAgIC8vIGVubGFyZ2Ugdmlld1xuICAgIGVubGFyZ2VkVmlldy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpc0RhcmsgPyAnYmxhY2snIDogJ3doaXRlJztcbiAgICBlbmxhcmdlZEltZy5zdHlsZS5ib3hTaGFkb3cgPSBib3hTaGFkb3coKTtcbiAgICBzdGF0aW9uTmFtZUJpZy5zdHlsZS5jb2xvciA9IGlzRGFyayA/ICd3aGl0ZScgOiAnYmxhY2snO1xufSk7XG5mdW5jdGlvbiBib3hTaGFkb3coKSB7XG4gICAgY29uc3QgY29sb3IgPSBpc0RhcmsgPyAnMTgwLCAxODAsIDE4MCcgOiAnMCwgMCwgMCc7XG4gICAgcmV0dXJuIGAwcHggMTBweCAxNXB4IHJnYmEoJHtjb2xvcn0sIDAuNSksIDEwcHggMjBweCAyMHB4IHJnYmEoJHtjb2xvcn0sIDAuNSksIDBweCAzMHB4IDQwcHggcmdiYSgke2NvbG9yfSwgMC41KWA7XG59XG5mdW5jdGlvbiB1cGRhdGVBbHBoYShlbGVtZW50LCBuZXdBbHBoYSkge1xuICAgIC8vIHVwZGF0ZSBiYWNrZ3JvdW5kIGNvbG9yIGFscGhhIHZhbHVlXG4gICAgY29uc3QgY3VycmVudENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuYmFja2dyb3VuZENvbG9yO1xuICAgIGNvbnN0IHJnYlZhbHVlcyA9IGN1cnJlbnRDb2xvci5tYXRjaCgvXFxkKy9nKTtcbiAgICBpZiAocmdiVmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IFtyLCBnLCBiXSA9IHJnYlZhbHVlcztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgke3J9LCAke2d9LCAke2J9LCAke25ld0FscGhhfSlgO1xuICAgIH1cbn1cbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWhhc1Njcm9sbGVkIHx8IHdpbmRvdy5zY3JvbGxZID09IDApIHtcbiAgICAgICAgLy9zY3JvbGxpbmdcbiAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZICE9IDApIHtcbiAgICAgICAgICAgIC8vc2VhcmNoIGxvb2tzXG4gICAgICAgICAgICB1cGRhdGVBbHBoYShzZWFyY2gsIDApO1xuICAgICAgICAgICAgYWxwaGEgPSAwO1xuICAgICAgICAgICAgLy9zZWFyY2ggcG9zaXRpb25cbiAgICAgICAgICAgIHRvcEJhci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LWVuZCc7XG4gICAgICAgICAgICBzZWFyY2hJY29uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICAgICAgICAgIGhhc1Njcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlYXJjaElucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgLy9nZXRpbmcgYmFjayB0byB0b3BcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL3NlYXJjaCBsb29rc1xuICAgICAgICAgICAgdXBkYXRlQWxwaGEoc2VhcmNoLCAxKTtcbiAgICAgICAgICAgIGFscGhhID0gMTtcbiAgICAgICAgICAgIC8vc2VhcmNoIHBvc2l0aW9uXG4gICAgICAgICAgICB0b3BCYXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcbiAgICAgICAgICAgIHNlYXJjaEljb24uc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgaGFzU2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlYXJjaElucHV0LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbn07XG5zZWFyY2hJY29uID09PSBudWxsIHx8IHNlYXJjaEljb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlYXJjaEljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpZiAoaGFzU2Nyb2xsZWQpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNlYXJjaElucHV0ID09PSBudWxsIHx8IHNlYXJjaElucHV0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWFyY2hJbnB1dC5mb2N1cygpO1xuICAgICAgICB9LCAxMCk7XG4gICAgfVxufSk7XG4vL3JpZ2h0IHNjcmVlbiBidXR0b25zXG5mdW5jdGlvbiBwYXVzZU9yUmVzdW1lKCkge1xuICAgIGlmICghaXNQYXVzZWQpIHtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpby5wYXVzZSgpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1zdG9wJyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZhLXBsYXknKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgICAgIGV2ZXJzdG9wcGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGxheSgpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1wbGF5Jyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZhLXN0b3AnKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ29MaXZlKCkge1xuICAgIGlmIChldmVyc3RvcHBlZCkge1xuICAgICAgICBzdGFydGluZ1RoZVN0YXRpb24oY3VycmVudFN0YXRpb25OYW1lKTtcbiAgICB9XG59XG5wYXVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGF1c2VPclJlc3VtZSk7XG5saXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnb0xpdmUpO1xuLy92b2x1bWVcbmZ1bmN0aW9uIHVwZGF0ZVZvbHVtZSgpIHtcbiAgICBjb25zdCBjdXJyZW50Vm9sdW1lID0gcGFyc2VJbnQodm9sdW1lU2xpZGVyLnZhbHVlKSAvIDEwMDtcbiAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnZvbHVtZSA9IGN1cnJlbnRWb2x1bWU7XG59XG52b2x1bWVPZmZJY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8udm9sdW1lID0gMDtcbiAgICB2b2x1bWVTbGlkZXIudmFsdWUgPSAnMCc7XG59KTtcbnZvbHVtZU1heEljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby52b2x1bWUgPSAxO1xuICAgIHZvbHVtZVNsaWRlci52YWx1ZSA9ICcxMDAnO1xufSk7XG52b2x1bWVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHVwZGF0ZVZvbHVtZSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=