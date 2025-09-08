/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/RadioInfoClass.ts":
/*!**********************************!*\
  !*** ./src/ts/RadioInfoClass.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RadioInfoClass = void 0;
class RadioInfoClass {
    constructor(hebrewName, link) {
        this.hebrewName = hebrewName;
        this.link = link;
    }
}
exports.RadioInfoClass = RadioInfoClass;


/***/ }),

/***/ "./src/ts/appServices.ts":
/*!*******************************!*\
  !*** ./src/ts/appServices.ts ***!
  \*******************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const radioMap_1 = __webpack_require__(/*! ./radioMap */ "./src/ts/radioMap.ts");
const domElements_1 = __webpack_require__(/*! ./domElements */ "./src/ts/domElements.ts");
const cssVariables_1 = __webpack_require__(/*! ./cssVariables */ "./src/ts/cssVariables.ts");
const defaultImgSource = "../assets/_images/StationsPng/default.png";
let currentStationAudio = new Audio();
let currentStationName = "";
let isRadio = false;
let isDark = false;
let isPaused = false;
let hasScrolled = false;
let descriptions = [];
let alpha = 1;
let everstopped = false;
let lastsong;
let currentVolume = parseInt(domElements_1.volumeSlider.value) / 100;
//networking
function sendSongRequest(radioName) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/identify_song", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ radio_name: radioName }),
        });
        if (!response.ok) {
            domElements_1.songDescription.innerHTML = ``;
            console.error("Failed to fetch:", response.statusText);
            return;
        }
        const currentSong = yield response.json();
        //console.log(currentSong);
        if (currentSong == null) {
            domElements_1.songDescription.innerHTML = ``;
            return;
        }
        if (currentSong != lastsong) {
            domElements_1.songDescription.innerHTML = `${currentSong["songName"]} - ${currentSong["singer"]}`;
            domElements_1.songDescription.setAttribute("href", `${currentSong["href"]}`);
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
for (const radioName in radioMap_1.radioMap) {
    let imgSource = `../assets/_images/StationsPng/${radioName}.png`;
    const element = document.createElement("img");
    element.src = imgSource;
    element.classList.add("pictures");
    element.onerror = () => {
        imgSource = defaultImgSource;
        element.src = defaultImgSource;
    };
    //pressable
    element.addEventListener("click", () => whenChosingStation(radioName, imgSource));
    const elementDescription = document.createElement("figcaption");
    elementDescription.classList.add("description");
    elementDescription.appendChild(document.createTextNode(radioMap_1.radioMap[radioName].hebrewName));
    const figure = document.createElement("figure");
    figure.setAttribute("id", radioName);
    figure.appendChild(element);
    figure.appendChild(elementDescription);
    descriptions.push(figure);
    domElements_1.main === null || domElements_1.main === void 0 ? void 0 : domElements_1.main.appendChild(figure);
}
function whenChosingStation(stationId, imgSource = `../assets/_images/StationsPng/${stationId}.png`) {
    loadImg(imgSource);
    domElements_1.stationNameBig.textContent = radioMap_1.radioMap[stationId].hebrewName;
    if (currentStationName != stationId) {
        startingTheStation(stationId);
    }
    currentStationName = stationId;
    openingBigStationTab();
}
function startingTheStation(stationId) {
    return __awaiter(this, void 0, void 0, function* () {
        domElements_1.songDescription.innerHTML = ``;
        currentStationAudio.pause();
        currentStationAudio = new Audio(radioMap_1.radioMap[stationId].link);
        currentStationAudio.volume = currentVolume;
        currentStationAudio.play();
        domElements_1.pauseButton.classList.remove("fa-play");
        domElements_1.pauseButton.classList.add("fa-stop");
        domElements_1.liveButton.style.display = "none";
        isPaused = false;
        everstopped = false;
        isRadio = true;
        sendSongRequest(stationId);
    });
}
function backToMainScreen() {
    // Slide night mode button out
    domElements_1.nightMode.classList.remove("slide-in");
    domElements_1.nightMode.classList.add("hide");
    domElements_1.enlargedView.classList.remove("active");
    //showing all again
    domElements_1.main.style.display = "";
    for (const radioName in radioMap_1.radioMap) {
        const currentFigure = document.getElementById(radioName);
        currentFigure === null || currentFigure === void 0 ? void 0 : currentFigure.classList.remove("hidden");
    }
    //wait for animation
    setTimeout(() => {
        domElements_1.enlargedView.classList.add("hidden");
        domElements_1.rightArrow.classList.remove("hidden");
        domElements_1.body.classList.remove("no-scroll");
        // Show night mode button again after slide up
        setTimeout(() => {
            domElements_1.nightMode.classList.remove("hide");
        }, 350);
    }, 500);
}
function openingBigStationTab() {
    // Slide night mode button out, then in
    domElements_1.nightMode.classList.add("hide");
    domElements_1.nightMode.classList.remove("slide-in");
    domElements_1.enlargedView.classList.remove("hidden");
    // Set box-shadow immediately for enlarged-img
    domElements_1.enlargedImg.style.boxShadow = boxShadow();
    setTimeout(() => {
        domElements_1.enlargedView.classList.add("active");
        domElements_1.searchInput.value = "";
        domElements_1.rightArrow.classList.add("hidden");
        // Slide night mode button in after enlarged view is active
        setTimeout(() => {
            domElements_1.nightMode.classList.remove("hide");
            domElements_1.nightMode.classList.add("slide-in");
        }, 350);
    }, 10);
    setTimeout(() => {
        domElements_1.main.style.display = "none";
        window.scrollTo(0, 0);
    }, 500);
    domElements_1.body.classList.add("no-scroll");
}
domElements_1.backArrow.addEventListener("click", backToMainScreen);
domElements_1.rightArrow.addEventListener("click", openingBigStationTab);
//search bar contant
domElements_1.searchInput === null || domElements_1.searchInput === void 0 ? void 0 : domElements_1.searchInput.addEventListener("input", (e) => {
    const input = e.target.value.toLowerCase();
    for (const radioName in radioMap_1.radioMap) {
        const radioNameLower = radioName.toLowerCase();
        const hebrewNameLower = radioMap_1.radioMap[radioName].hebrewName.toLowerCase();
        const isVisible = hebrewNameLower.includes(input) || radioNameLower.includes(input);
        const currentFigure = document.getElementById(radioName);
        currentFigure === null || currentFigure === void 0 ? void 0 : currentFigure.classList.toggle("hidden", !isVisible);
    }
});
//preventing enter
domElements_1.topBar.addEventListener("submit", (e) => {
    e.preventDefault();
});
//darkmode
domElements_1.nightMode === null || domElements_1.nightMode === void 0 ? void 0 : domElements_1.nightMode.addEventListener("click", () => {
    isDark = !isDark;
    // nightmode icon
    domElements_1.nightMode.classList.toggle("fa-moon", !isDark);
    domElements_1.nightMode.classList.toggle("fa-sun", isDark);
    domElements_1.nightMode.style.color = isDark ? cssVariables_1.darkModeSecondary : "#222";
    // background
    domElements_1.body.style.backgroundColor = isDark ? cssVariables_1.darkModePrimary : cssVariables_1.lightModePrimary;
    domElements_1.body.style.color = isDark ? cssVariables_1.darkModeSecondary : cssVariables_1.lightModeSecondary;
    // name and pictures border
    descriptions.forEach((figure) => {
        const img = figure.querySelector("img");
        const figcaption = figure.querySelector("figcaption");
        // name
        if (figcaption) {
            figcaption.classList.toggle("description", !isDark);
            figcaption.classList.toggle("descriptionDark", isDark);
        }
        //song name
        domElements_1.songDescription.style.color = isDark ? cssVariables_1.darkModeAccent : cssVariables_1.lightModeAccent;
        // pictures border
        if (img) {
            img.classList.toggle("pictures", !isDark);
            img.classList.toggle("picturesDark", isDark);
        }
    });
    // search looks
    domElements_1.search.style.backgroundColor = `rgba(${isDark ? "80, 80, 80" : "217,220,222"}, ${alpha})`;
    domElements_1.search.style.color = isDark ? cssVariables_1.darkModeAccent : cssVariables_1.lightModeAccent;
    domElements_1.searchInput.style.color = isDark ? cssVariables_1.darkModeAccent : cssVariables_1.lightModeAccent;
    domElements_1.searchIcon.style.color = isDark
        ? "rgba(231, 196, 249, 0.25)"
        : "rgba(0, 0, 0, 0.25)";
    // enlarge view
    domElements_1.enlargedView.style.backgroundColor = isDark
        ? cssVariables_1.darkModePrimary
        : cssVariables_1.lightModePrimary;
    domElements_1.enlargedImg.style.boxShadow = boxShadow();
    domElements_1.stationNameBig.style.color = isDark ? cssVariables_1.darkModeAccent : cssVariables_1.lightModeAccent;
    domElements_1.liveButton.style.color = isDark ? cssVariables_1.darkModeSecondary : "#222";
    domElements_1.pauseButton.style.color = isDark ? cssVariables_1.darkModeAccent : cssVariables_1.lightModeAccent;
    domElements_1.backArrow.style.color = isDark ? cssVariables_1.darkModeSecondary : cssVariables_1.lightModeAccent;
    const rightChevron = domElements_1.rightArrow.querySelector(".chevron");
    if (rightChevron) {
        rightChevron.style.color = isDark
            ? cssVariables_1.darkModeSecondary
            : cssVariables_1.lightModeAccent;
    }
    else {
        domElements_1.rightArrow.style.color = isDark ? cssVariables_1.darkModeSecondary : cssVariables_1.lightModeAccent;
    }
    domElements_1.volumeOffIcon.style.color = isDark ? cssVariables_1.darkModeSecondary : cssVariables_1.lightModeAccent;
    domElements_1.volumeMaxIcon.style.color = isDark ? cssVariables_1.darkModeSecondary : cssVariables_1.lightModeAccent;
});
function boxShadow() {
    const color = isDark ? "231, 196, 249" : "117, 117, 117";
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
// Collapsible search bar logic
// Only collapse search bar after scrolling down a bit (e.g., 40px)
const searchPlaceholder = document.getElementById("search-placeholder");
window.onscroll = function () {
    const threshold = 40;
    if (window.scrollY > threshold) {
        domElements_1.search.classList.add("collapsed");
        if (searchPlaceholder)
            searchPlaceholder.style.display = "block";
        domElements_1.topBar.style.justifyContent = "flex-start";
        hasScrolled = true;
    }
    else {
        domElements_1.search.classList.remove("collapsed");
        if (searchPlaceholder)
            searchPlaceholder.style.display = "none";
        domElements_1.topBar.style.justifyContent = "center";
        hasScrolled = false;
    }
};
function customScrollToTop(duration = 600) {
    const startY = window.scrollY;
    const startTime = performance.now();
    function easeOut(t) {
        // Ease out cubic
        return 1 - Math.pow(1 - t, 3);
    }
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOut(progress);
        window.scrollTo(0, startY * (1 - eased));
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}
domElements_1.searchIcon === null || domElements_1.searchIcon === void 0 ? void 0 : domElements_1.searchIcon.addEventListener("click", () => {
    if (domElements_1.search.classList.contains("collapsed")) {
        customScrollToTop(600);
        setTimeout(() => {
            domElements_1.search.classList.remove("collapsed");
            domElements_1.searchInput === null || domElements_1.searchInput === void 0 ? void 0 : domElements_1.searchInput.focus();
        }, 600);
    }
    else if (hasScrolled) {
        customScrollToTop(600);
        setTimeout(() => {
            domElements_1.searchInput === null || domElements_1.searchInput === void 0 ? void 0 : domElements_1.searchInput.focus();
        }, 600);
    }
});
//right screen buttons
function pauseOrResume() {
    if (!isPaused) {
        currentStationAudio.pause();
        domElements_1.pauseButton.classList.remove("fa-stop");
        domElements_1.pauseButton.classList.add("fa-play");
        isPaused = !isPaused;
        ifStopped();
        domElements_1.liveButton.style.display = "";
    }
    else {
        currentStationAudio.play();
        domElements_1.pauseButton.classList.remove("fa-play");
        domElements_1.pauseButton.classList.add("fa-stop");
        isPaused = !isPaused;
    }
}
function goLive() {
    startingTheStation(currentStationName);
}
domElements_1.pauseButton.addEventListener("click", pauseOrResume);
domElements_1.liveButton.addEventListener("click", goLive);
//volume
function updateVolume() {
    currentVolume = parseInt(domElements_1.volumeSlider.value) / 100;
    currentStationAudio.volume = currentVolume;
}
domElements_1.volumeOffIcon.addEventListener("click", () => {
    currentStationAudio.volume = 0;
    currentVolume = 0;
    domElements_1.volumeSlider.value = "0";
});
domElements_1.volumeMaxIcon.addEventListener("click", () => {
    currentStationAudio.volume = 1;
    currentVolume = 1;
    domElements_1.volumeSlider.value = "100";
});
domElements_1.volumeSlider.addEventListener("input", updateVolume);
function ifStopped() {
    lastsong = {};
    everstopped = true;
    domElements_1.liveButton.style.display = "";
    setTimeout(() => {
        domElements_1.songDescription.innerHTML = ``;
    }, 10000);
}
function loadImg(imgSource) {
    return __awaiter(this, void 0, void 0, function* () {
        domElements_1.enlargedImg.src = imgSource;
    });
}


/***/ }),

/***/ "./src/ts/cssVariables.ts":
/*!********************************!*\
  !*** ./src/ts/cssVariables.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.darkModeAccent = exports.darkModeSecondary = exports.darkModePrimary = exports.lightModeAccent = exports.lightModeSecondary = exports.lightModePrimary = void 0;
function getCSSVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
const lightModePrimary = getCSSVariableValue('--light-mode-primary');
exports.lightModePrimary = lightModePrimary;
const lightModeSecondary = getCSSVariableValue('--light-mode-Secondary');
exports.lightModeSecondary = lightModeSecondary;
const lightModeAccent = getCSSVariableValue('--light-mode-Accent');
exports.lightModeAccent = lightModeAccent;
const darkModePrimary = getCSSVariableValue('--dark-mode-primary');
exports.darkModePrimary = darkModePrimary;
const darkModeSecondary = getCSSVariableValue('--dark-mode-Secondary');
exports.darkModeSecondary = darkModeSecondary;
const darkModeAccent = getCSSVariableValue('--dark-mode-Accent');
exports.darkModeAccent = darkModeAccent;


/***/ }),

/***/ "./src/ts/domElements.ts":
/*!*******************************!*\
  !*** ./src/ts/domElements.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.volumeMaxIcon = exports.volumeOffIcon = exports.volumeSlider = exports.songDescription = exports.pauseButton = exports.liveButton = exports.stationNameBig = exports.enlargedImg = exports.rightArrow = exports.backArrow = exports.enlargedView = exports.searchIcon = exports.search = exports.nightMode = exports.topBar = exports.searchInput = exports.main = exports.body = void 0;
const body = document.querySelector('body');
exports.body = body;
const main = document.getElementById("screen");
exports.main = main;
const searchInput = document.getElementById("search-input");
exports.searchInput = searchInput;
const topBar = document.getElementById("bar");
exports.topBar = topBar;
const nightMode = document.getElementById("dark-mode-icon");
exports.nightMode = nightMode;
const search = document.getElementById("search");
exports.search = search;
const searchIcon = document.getElementById("searchIcon");
exports.searchIcon = searchIcon;
const enlargedView = document.getElementById("enlarged-view");
exports.enlargedView = enlargedView;
const backArrow = document.getElementById("back-arrow");
exports.backArrow = backArrow;
const rightArrow = document.getElementById("right-arrow-id");
exports.rightArrow = rightArrow;
const enlargedImg = document.getElementById("enlarged-img");
exports.enlargedImg = enlargedImg;
const stationNameBig = document.getElementById("station-name-big");
exports.stationNameBig = stationNameBig;
const liveButton = document.getElementById("live-button");
exports.liveButton = liveButton;
const pauseButton = document.getElementById("pause-button");
exports.pauseButton = pauseButton;
const songDescription = document.getElementById('song-name');
exports.songDescription = songDescription;
const volumeSlider = document.getElementById("slider-vol");
exports.volumeSlider = volumeSlider;
const volumeOffIcon = document.getElementById("volume-off");
exports.volumeOffIcon = volumeOffIcon;
const volumeMaxIcon = document.getElementById("volume-max");
exports.volumeMaxIcon = volumeMaxIcon;


/***/ }),

/***/ "./src/ts/radioMap.ts":
/*!****************************!*\
  !*** ./src/ts/radioMap.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.radioMap = void 0;
const radioStationsInfo_json_1 = __importDefault(__webpack_require__(/*! ../radioStationsInfo.json */ "./src/radioStationsInfo.json"));
const RadioInfoClass_1 = __webpack_require__(/*! ./RadioInfoClass */ "./src/ts/RadioInfoClass.ts");
const radioMap = {};
exports.radioMap = radioMap;
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
                dict[key] = new RadioInfoClass_1.RadioInfoClass(newHebrewName, value1);
                helper = false;
            }
        }
    }
}
createRadioDict(radioMap);


/***/ }),

/***/ "./src/radioStationsInfo.json":
/*!************************************!*\
  !*** ./src/radioStationsInfo.json ***!
  \************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"glglz":{"displayName":"גלגלצ","link":"https://glzwizzlv.bynetcdn.com/glglz_mp3"},"glz":{"displayName":"גלי צהל","link":"https://glzwizzlv.bynetcdn.com/glz_mp3"},"darom":{"displayName":"רדיו דרום","link":"https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio"},"darom101.5FM":{"displayName":"רדיו דרום 101.5","link":"https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio"},"kan88":{"displayName":"כאן 88","link":"https://27873.live.streamtheworld.com/KAN_88.mp3"},"kanBet":{"displayName":"כאן רשת ב","link":"https://22593.live.streamtheworld.com/KAN_BET.mp3"},"kanGimmel":{"displayName":"כאן רשת ג","link":"https://25583.live.streamtheworld.com/KAN_GIMMEL.mp3"},"kanMoreshet":{"displayName":"כאן מורשת","link":"https://25483.live.streamtheworld.com/KAN_MORESHET.mp3"},"kanKolHamusica":{"displayName":"כאן קול המוזיקה","link":"https://27873.live.streamtheworld.com/KAN_KOL_HAMUSICA.mp3"},"kanReka":{"displayName":"כאן רקע","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3"},"kanTarbut":{"displayName":"כאן תרבות","link":"https://25483.live.streamtheworld.com/KAN_REKA.mp3"},"eco99FM":{"displayName":"אקו 99","link":"https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio"},"kolUniversity":{"displayName":"קול האוניברסיטה","link":"https://1062onair.runi.ac.il/idc123.mp3"},"bgu":{"displayName":"אוניברסיטת בן-גוריון","link":"https://bguradio.co/listen/bguradio/radio.mp3"},"103FM":{"displayName":"רדיו 103FM","link":"https://cdn.cybercdn.live/103FM/Live/icecast.audio"},"tzafon104.5":{"displayName":"צפון 104.5","link":"https://cdn.cybercdn.live/Tzafon_NonStop/Live_Audio/icecast.audio"},"ivriShesh":{"displayName":"עברי שש","link":"https://streaming.radio.co/sa06221901/listen"},"radius":{"displayName":"רדיו רדיוס","link":"https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio"},"r90":{"displayName":"רדיו 90","link":"https://cdn.cybercdn.live/Emtza_Haderech/Live_Audio/icecast.audio"},"telAviv102FM":{"displayName":"רדיו תל אביב ","link":"https://102.livecdn.biz/102fm_mp3"},"shiridikaon":{"displayName":"שירי דיכאון","link":"https://diki.mediacast.co.il/diki"},"shiriAhava":{"displayName":"שירי אהבה","link":"https://liveradio.co.il/radiolove"},"kezevMizrahi":{"displayName":"קצב מזרחי","link":"https://liveradio.co.il/radio_i"},"kezevYamTichoni":{"displayName":"קצב ים-תיכוני","link":"https://liveradio.co.il:1040/;?type=http&nocache=135533"},"kolRamatHasharon":{"displayName":"קול רמת השרון","link":"https://radio.streamgates.net/stream/1036"},"kolBarama":{"displayName":"קול ברמה","link":"https://cdn.cybercdn.live/Kol_Barama/Live_Audio/icecast.audio"},"kolHagolan":{"displayName":"קול הגולן","link":"https://liveradio.co.il/kolhagolan"},"kolHagalilTop":{"displayName":"קול הגליל","link":"https://radio.streamgates.net/stream/galil"},"kolHayamHaadom":{"displayName":"קול הים התיכון","link":"https://cdn.cybercdn.live/Eilat_Radio/Live/icecast.audio"},"kolHaKinneret":{"displayName":"קול הכינרת","link":"https://radio.streamgates.net/stream/kinneret"},"kolHamizrah":{"displayName":"קול המזרח","link":"https://mzr.mediacast.co.il/mzradio"},"kolHamerkaz":{"displayName":"קול המרכז","link":"https://liveradio.co.il:9050/;"},"kolHashfela":{"displayName":"קול השפלה","link":"https://radio.streamgates.net/stream/1036kh"},"kolHai":{"displayName":"קול חי","link":"https://live.kcm.fm/live:"},"kolYezreel":{"displayName":"קול יזרעאל","link":"https://radio.streamgates.net/stream/yezreel"},"kolNatanya":{"displayName":"קול נתניה","link":"https://radio.streamgates.net/stream/netanya"},"kolHanachal":{"displayName":"קול הנחל","link":"https://cast4.asurahosting.com/proxy/yaniv/stream"},"kolRega":{"displayName":"קול רגע","link":"https://cdn.cybercdn.live/Kol_Rega/Live_Audio/icecast.audio"},"sol":{"displayName":"רדיו סול","link":"https://radio.streamgates.net/stream/sol"},"sahar":{"displayName":"רדיו סהר","link":"https://live.ecast.co.il/stream/sahar"},"neto":{"displayName":"רדיו נטו","link":"https://live.ecast.co.il/stream/radioneto1"},"noshmimMizrahit":{"displayName":"נושמים מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"nostalgiaIsraeli":{"displayName":"נוסטלגיה ישראלי","link":"http://194.213.4.197:8000/;stream/1"},"martitMeitarBalev":{"displayName":"רדיו מרטיט מיתר בלב","link":"https://liveradio.co.il/wet"},"mizrahit":{"displayName":"רדיו מזרחית","link":"https://mzr.mediacast.co.il/mzradio"},"mahotHachaim":{"displayName":"רדיו מהות-החיים","link":"https://eol-live.cdnwiz.com/eol/eolsite/icecast.audio"},"levHamedina":{"displayName":"רדיו לב המדינה","link":"https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio"},"KaholYavan":{"displayName":"רדיו כחול-יוון","link":"https://icecast.live/proxy/livegreece/livegreece"},"jerusalem":{"displayName":"רדיו ירושלים","link":"https://cdn.cybercdn.live/JerusalemRadio/Live/icecast.audio"},"101.5":{"displayName":"רדיו 101.5","link":"https://cdn.cybercdn.live/Hatahana_1015/Live_Audio/icecast.audio"},"hakatze":{"displayName":"רדיו הקצה","link":"https://kzradio.mediacast.co.il/kzradio_live/kzradio/icecast.audio"},"galiIsrael":{"displayName":"רדיו גלי-ישראל","link":"https://cdn.cybercdn.live/Galei_Israel/Live/icecast.audio"},"oranim":{"displayName":"רדיו אורנים","link":"https://radio.streamgates.net/stream/oranim"},"anime":{"displayName":"אנימה","link":"https://stream.animeradio.de/animeradio.mp3"},"jazzFM":{"displayName":"ג\'אז","link":"https://jazzfm91.streamb.live/SB00009"},"Lo-fi":{"displayName":"לו-פי","link":"https://ec3.yesstreaming.net:3755/stream"}}');

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ts/appServices.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7Ozs7Ozs7Ozs7QUNUVDtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CLG1CQUFPLENBQUMsd0NBQVk7QUFDdkMsc0JBQXNCLG1CQUFPLENBQUMsOENBQWU7QUFDN0MsdUJBQXVCLG1CQUFPLENBQUMsZ0RBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLG1DQUFtQyx1QkFBdUI7QUFDMUQsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCx5QkFBeUIsSUFBSSxzQkFBc0I7QUFDNUcsa0VBQWtFLG9CQUFvQjtBQUN0RjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLHFEQUFxRCxVQUFVO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0ZBQW9GLFVBQVU7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EseURBQXlELHNDQUFzQyxJQUFJLE1BQU07QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGlDQUFpQyxNQUFNLDhCQUE4QixNQUFNLDZCQUE2QixNQUFNO0FBQzlHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLFNBQVM7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7QUN0VmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCLEdBQUcseUJBQXlCLEdBQUcsdUJBQXVCLEdBQUcsdUJBQXVCLEdBQUcsMEJBQTBCLEdBQUcsd0JBQXdCO0FBQzlKO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0Esc0JBQXNCOzs7Ozs7Ozs7OztBQ2pCVDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxxQkFBcUIsR0FBRyxxQkFBcUIsR0FBRyxvQkFBb0IsR0FBRyx1QkFBdUIsR0FBRyxtQkFBbUIsR0FBRyxrQkFBa0IsR0FBRyxzQkFBc0IsR0FBRyxtQkFBbUIsR0FBRyxrQkFBa0IsR0FBRyxpQkFBaUIsR0FBRyxvQkFBb0IsR0FBRyxrQkFBa0IsR0FBRyxjQUFjLEdBQUcsaUJBQWlCLEdBQUcsY0FBYyxHQUFHLG1CQUFtQixHQUFHLFlBQVksR0FBRyxZQUFZO0FBQ3ZYO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsY0FBYztBQUNkO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsY0FBYztBQUNkO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EscUJBQXFCOzs7Ozs7Ozs7OztBQ3RDUjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQjtBQUNoQixpREFBaUQsbUJBQU8sQ0FBQywrREFBMkI7QUFDcEYseUJBQXlCLG1CQUFPLENBQUMsb0RBQWtCO0FBQ25EO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDMUJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWRpby13ZWIvLi9zcmMvdHMvUmFkaW9JbmZvQ2xhc3MudHMiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViLy4vc3JjL3RzL2FwcFNlcnZpY2VzLnRzIiwid2VicGFjazovL3JhZGlvLXdlYi8uL3NyYy90cy9jc3NWYXJpYWJsZXMudHMiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViLy4vc3JjL3RzL2RvbUVsZW1lbnRzLnRzIiwid2VicGFjazovL3JhZGlvLXdlYi8uL3NyYy90cy9yYWRpb01hcC50cyIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vcmFkaW8td2ViL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9yYWRpby13ZWIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SYWRpb0luZm9DbGFzcyA9IHZvaWQgMDtcbmNsYXNzIFJhZGlvSW5mb0NsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihoZWJyZXdOYW1lLCBsaW5rKSB7XG4gICAgICAgIHRoaXMuaGVicmV3TmFtZSA9IGhlYnJld05hbWU7XG4gICAgICAgIHRoaXMubGluayA9IGxpbms7XG4gICAgfVxufVxuZXhwb3J0cy5SYWRpb0luZm9DbGFzcyA9IFJhZGlvSW5mb0NsYXNzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhZGlvTWFwXzEgPSByZXF1aXJlKFwiLi9yYWRpb01hcFwiKTtcbmNvbnN0IGRvbUVsZW1lbnRzXzEgPSByZXF1aXJlKFwiLi9kb21FbGVtZW50c1wiKTtcbmNvbnN0IGNzc1ZhcmlhYmxlc18xID0gcmVxdWlyZShcIi4vY3NzVmFyaWFibGVzXCIpO1xuY29uc3QgZGVmYXVsdEltZ1NvdXJjZSA9IFwiLi4vYXNzZXRzL19pbWFnZXMvU3RhdGlvbnNQbmcvZGVmYXVsdC5wbmdcIjtcbmxldCBjdXJyZW50U3RhdGlvbkF1ZGlvID0gbmV3IEF1ZGlvKCk7XG5sZXQgY3VycmVudFN0YXRpb25OYW1lID0gXCJcIjtcbmxldCBpc1JhZGlvID0gZmFsc2U7XG5sZXQgaXNEYXJrID0gZmFsc2U7XG5sZXQgaXNQYXVzZWQgPSBmYWxzZTtcbmxldCBoYXNTY3JvbGxlZCA9IGZhbHNlO1xubGV0IGRlc2NyaXB0aW9ucyA9IFtdO1xubGV0IGFscGhhID0gMTtcbmxldCBldmVyc3RvcHBlZCA9IGZhbHNlO1xubGV0IGxhc3Rzb25nO1xubGV0IGN1cnJlbnRWb2x1bWUgPSBwYXJzZUludChkb21FbGVtZW50c18xLnZvbHVtZVNsaWRlci52YWx1ZSkgLyAxMDA7XG4vL25ldHdvcmtpbmdcbmZ1bmN0aW9uIHNlbmRTb25nUmVxdWVzdChyYWRpb05hbWUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKFwiL2lkZW50aWZ5X3NvbmdcIiwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHJhZGlvX25hbWU6IHJhZGlvTmFtZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGRvbUVsZW1lbnRzXzEuc29uZ0Rlc2NyaXB0aW9uLmlubmVySFRNTCA9IGBgO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBmZXRjaDpcIiwgcmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VycmVudFNvbmcgPSB5aWVsZCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coY3VycmVudFNvbmcpO1xuICAgICAgICBpZiAoY3VycmVudFNvbmcgPT0gbnVsbCkge1xuICAgICAgICAgICAgZG9tRWxlbWVudHNfMS5zb25nRGVzY3JpcHRpb24uaW5uZXJIVE1MID0gYGA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRTb25nICE9IGxhc3Rzb25nKSB7XG4gICAgICAgICAgICBkb21FbGVtZW50c18xLnNvbmdEZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBgJHtjdXJyZW50U29uZ1tcInNvbmdOYW1lXCJdfSAtICR7Y3VycmVudFNvbmdbXCJzaW5nZXJcIl19YDtcbiAgICAgICAgICAgIGRvbUVsZW1lbnRzXzEuc29uZ0Rlc2NyaXB0aW9uLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgYCR7Y3VycmVudFNvbmdbXCJocmVmXCJdfWApO1xuICAgICAgICAgICAgbGFzdHNvbmcgPSBjdXJyZW50U29uZztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gc2VuZFVwZGF0ZSgpIHtcbiAgICBpZiAoaXNSYWRpbyAmJiAhZXZlcnN0b3BwZWQpIHtcbiAgICAgICAgc2VuZFNvbmdSZXF1ZXN0KGN1cnJlbnRTdGF0aW9uTmFtZSk7XG4gICAgfVxufVxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIHNlbmRVcGRhdGUoKTtcbn0sIDMwMDAwKTtcbi8vY3JlYXRpbmcgdGhlIG1haW4gKGFsbCB0aGUgc3RhdGlvbnMpXG5mb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcF8xLnJhZGlvTWFwKSB7XG4gICAgbGV0IGltZ1NvdXJjZSA9IGAuLi9hc3NldHMvX2ltYWdlcy9TdGF0aW9uc1BuZy8ke3JhZGlvTmFtZX0ucG5nYDtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBlbGVtZW50LnNyYyA9IGltZ1NvdXJjZTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJwaWN0dXJlc1wiKTtcbiAgICBlbGVtZW50Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIGltZ1NvdXJjZSA9IGRlZmF1bHRJbWdTb3VyY2U7XG4gICAgICAgIGVsZW1lbnQuc3JjID0gZGVmYXVsdEltZ1NvdXJjZTtcbiAgICB9O1xuICAgIC8vcHJlc3NhYmxlXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gd2hlbkNob3NpbmdTdGF0aW9uKHJhZGlvTmFtZSwgaW1nU291cmNlKSk7XG4gICAgY29uc3QgZWxlbWVudERlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZ2NhcHRpb25cIik7XG4gICAgZWxlbWVudERlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJkZXNjcmlwdGlvblwiKTtcbiAgICBlbGVtZW50RGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmFkaW9NYXBfMS5yYWRpb01hcFtyYWRpb05hbWVdLmhlYnJld05hbWUpKTtcbiAgICBjb25zdCBmaWd1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmlndXJlXCIpO1xuICAgIGZpZ3VyZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCByYWRpb05hbWUpO1xuICAgIGZpZ3VyZS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICBmaWd1cmUuYXBwZW5kQ2hpbGQoZWxlbWVudERlc2NyaXB0aW9uKTtcbiAgICBkZXNjcmlwdGlvbnMucHVzaChmaWd1cmUpO1xuICAgIGRvbUVsZW1lbnRzXzEubWFpbiA9PT0gbnVsbCB8fCBkb21FbGVtZW50c18xLm1haW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRvbUVsZW1lbnRzXzEubWFpbi5hcHBlbmRDaGlsZChmaWd1cmUpO1xufVxuZnVuY3Rpb24gd2hlbkNob3NpbmdTdGF0aW9uKHN0YXRpb25JZCwgaW1nU291cmNlID0gYC4uL2Fzc2V0cy9faW1hZ2VzL1N0YXRpb25zUG5nLyR7c3RhdGlvbklkfS5wbmdgKSB7XG4gICAgbG9hZEltZyhpbWdTb3VyY2UpO1xuICAgIGRvbUVsZW1lbnRzXzEuc3RhdGlvbk5hbWVCaWcudGV4dENvbnRlbnQgPSByYWRpb01hcF8xLnJhZGlvTWFwW3N0YXRpb25JZF0uaGVicmV3TmFtZTtcbiAgICBpZiAoY3VycmVudFN0YXRpb25OYW1lICE9IHN0YXRpb25JZCkge1xuICAgICAgICBzdGFydGluZ1RoZVN0YXRpb24oc3RhdGlvbklkKTtcbiAgICB9XG4gICAgY3VycmVudFN0YXRpb25OYW1lID0gc3RhdGlvbklkO1xuICAgIG9wZW5pbmdCaWdTdGF0aW9uVGFiKCk7XG59XG5mdW5jdGlvbiBzdGFydGluZ1RoZVN0YXRpb24oc3RhdGlvbklkKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5zb25nRGVzY3JpcHRpb24uaW5uZXJIVE1MID0gYGA7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpbyA9IG5ldyBBdWRpbyhyYWRpb01hcF8xLnJhZGlvTWFwW3N0YXRpb25JZF0ubGluayk7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8udm9sdW1lID0gY3VycmVudFZvbHVtZTtcbiAgICAgICAgY3VycmVudFN0YXRpb25BdWRpby5wbGF5KCk7XG4gICAgICAgIGRvbUVsZW1lbnRzXzEucGF1c2VCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXBsYXlcIik7XG4gICAgICAgIGRvbUVsZW1lbnRzXzEucGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZChcImZhLXN0b3BcIik7XG4gICAgICAgIGRvbUVsZW1lbnRzXzEubGl2ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIGV2ZXJzdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIGlzUmFkaW8gPSB0cnVlO1xuICAgICAgICBzZW5kU29uZ1JlcXVlc3Qoc3RhdGlvbklkKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJhY2tUb01haW5TY3JlZW4oKSB7XG4gICAgLy8gU2xpZGUgbmlnaHQgbW9kZSBidXR0b24gb3V0XG4gICAgZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuY2xhc3NMaXN0LnJlbW92ZShcInNsaWRlLWluXCIpO1xuICAgIGRvbUVsZW1lbnRzXzEubmlnaHRNb2RlLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgIGRvbUVsZW1lbnRzXzEuZW5sYXJnZWRWaWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgLy9zaG93aW5nIGFsbCBhZ2FpblxuICAgIGRvbUVsZW1lbnRzXzEubWFpbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IHJhZGlvTmFtZSBpbiByYWRpb01hcF8xLnJhZGlvTWFwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGaWd1cmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyYWRpb05hbWUpO1xuICAgICAgICBjdXJyZW50RmlndXJlID09PSBudWxsIHx8IGN1cnJlbnRGaWd1cmUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRGaWd1cmUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9XG4gICAgLy93YWl0IGZvciBhbmltYXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5lbmxhcmdlZFZpZXcuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5yaWdodEFycm93LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvbUVsZW1lbnRzXzEuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibm8tc2Nyb2xsXCIpO1xuICAgICAgICAvLyBTaG93IG5pZ2h0IG1vZGUgYnV0dG9uIGFnYWluIGFmdGVyIHNsaWRlIHVwXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIH0sIDM1MCk7XG4gICAgfSwgNTAwKTtcbn1cbmZ1bmN0aW9uIG9wZW5pbmdCaWdTdGF0aW9uVGFiKCkge1xuICAgIC8vIFNsaWRlIG5pZ2h0IG1vZGUgYnV0dG9uIG91dCwgdGhlbiBpblxuICAgIGRvbUVsZW1lbnRzXzEubmlnaHRNb2RlLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgIGRvbUVsZW1lbnRzXzEubmlnaHRNb2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJzbGlkZS1pblwiKTtcbiAgICBkb21FbGVtZW50c18xLmVubGFyZ2VkVmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIC8vIFNldCBib3gtc2hhZG93IGltbWVkaWF0ZWx5IGZvciBlbmxhcmdlZC1pbWdcbiAgICBkb21FbGVtZW50c18xLmVubGFyZ2VkSW1nLnN0eWxlLmJveFNoYWRvdyA9IGJveFNoYWRvdygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkb21FbGVtZW50c18xLmVubGFyZ2VkVmlldy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICBkb21FbGVtZW50c18xLnNlYXJjaElucHV0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5yaWdodEFycm93LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIC8vIFNsaWRlIG5pZ2h0IG1vZGUgYnV0dG9uIGluIGFmdGVyIGVubGFyZ2VkIHZpZXcgaXMgYWN0aXZlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgICAgICBkb21FbGVtZW50c18xLm5pZ2h0TW9kZS5jbGFzc0xpc3QuYWRkKFwic2xpZGUtaW5cIik7XG4gICAgICAgIH0sIDM1MCk7XG4gICAgfSwgMTApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkb21FbGVtZW50c18xLm1haW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgfSwgNTAwKTtcbiAgICBkb21FbGVtZW50c18xLmJvZHkuY2xhc3NMaXN0LmFkZChcIm5vLXNjcm9sbFwiKTtcbn1cbmRvbUVsZW1lbnRzXzEuYmFja0Fycm93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBiYWNrVG9NYWluU2NyZWVuKTtcbmRvbUVsZW1lbnRzXzEucmlnaHRBcnJvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb3BlbmluZ0JpZ1N0YXRpb25UYWIpO1xuLy9zZWFyY2ggYmFyIGNvbnRhbnRcbmRvbUVsZW1lbnRzXzEuc2VhcmNoSW5wdXQgPT09IG51bGwgfHwgZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yIChjb25zdCByYWRpb05hbWUgaW4gcmFkaW9NYXBfMS5yYWRpb01hcCkge1xuICAgICAgICBjb25zdCByYWRpb05hbWVMb3dlciA9IHJhZGlvTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBoZWJyZXdOYW1lTG93ZXIgPSByYWRpb01hcF8xLnJhZGlvTWFwW3JhZGlvTmFtZV0uaGVicmV3TmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBoZWJyZXdOYW1lTG93ZXIuaW5jbHVkZXMoaW5wdXQpIHx8IHJhZGlvTmFtZUxvd2VyLmluY2x1ZGVzKGlucHV0KTtcbiAgICAgICAgY29uc3QgY3VycmVudEZpZ3VyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhZGlvTmFtZSk7XG4gICAgICAgIGN1cnJlbnRGaWd1cmUgPT09IG51bGwgfHwgY3VycmVudEZpZ3VyZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEZpZ3VyZS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIsICFpc1Zpc2libGUpO1xuICAgIH1cbn0pO1xuLy9wcmV2ZW50aW5nIGVudGVyXG5kb21FbGVtZW50c18xLnRvcEJhci5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG4vL2Rhcmttb2RlXG5kb21FbGVtZW50c18xLm5pZ2h0TW9kZSA9PT0gbnVsbCB8fCBkb21FbGVtZW50c18xLm5pZ2h0TW9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpc0RhcmsgPSAhaXNEYXJrO1xuICAgIC8vIG5pZ2h0bW9kZSBpY29uXG4gICAgZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuY2xhc3NMaXN0LnRvZ2dsZShcImZhLW1vb25cIiwgIWlzRGFyayk7XG4gICAgZG9tRWxlbWVudHNfMS5uaWdodE1vZGUuY2xhc3NMaXN0LnRvZ2dsZShcImZhLXN1blwiLCBpc0RhcmspO1xuICAgIGRvbUVsZW1lbnRzXzEubmlnaHRNb2RlLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gY3NzVmFyaWFibGVzXzEuZGFya01vZGVTZWNvbmRhcnkgOiBcIiMyMjJcIjtcbiAgICAvLyBiYWNrZ3JvdW5kXG4gICAgZG9tRWxlbWVudHNfMS5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGlzRGFyayA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlUHJpbWFyeSA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZVByaW1hcnk7XG4gICAgZG9tRWxlbWVudHNfMS5ib2R5LnN0eWxlLmNvbG9yID0gaXNEYXJrID8gY3NzVmFyaWFibGVzXzEuZGFya01vZGVTZWNvbmRhcnkgOiBjc3NWYXJpYWJsZXNfMS5saWdodE1vZGVTZWNvbmRhcnk7XG4gICAgLy8gbmFtZSBhbmQgcGljdHVyZXMgYm9yZGVyXG4gICAgZGVzY3JpcHRpb25zLmZvckVhY2goKGZpZ3VyZSkgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSBmaWd1cmUucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcbiAgICAgICAgY29uc3QgZmlnY2FwdGlvbiA9IGZpZ3VyZS5xdWVyeVNlbGVjdG9yKFwiZmlnY2FwdGlvblwiKTtcbiAgICAgICAgLy8gbmFtZVxuICAgICAgICBpZiAoZmlnY2FwdGlvbikge1xuICAgICAgICAgICAgZmlnY2FwdGlvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZGVzY3JpcHRpb25cIiwgIWlzRGFyayk7XG4gICAgICAgICAgICBmaWdjYXB0aW9uLmNsYXNzTGlzdC50b2dnbGUoXCJkZXNjcmlwdGlvbkRhcmtcIiwgaXNEYXJrKTtcbiAgICAgICAgfVxuICAgICAgICAvL3NvbmcgbmFtZVxuICAgICAgICBkb21FbGVtZW50c18xLnNvbmdEZXNjcmlwdGlvbi5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlQWNjZW50IDogY3NzVmFyaWFibGVzXzEubGlnaHRNb2RlQWNjZW50O1xuICAgICAgICAvLyBwaWN0dXJlcyBib3JkZXJcbiAgICAgICAgaWYgKGltZykge1xuICAgICAgICAgICAgaW1nLmNsYXNzTGlzdC50b2dnbGUoXCJwaWN0dXJlc1wiLCAhaXNEYXJrKTtcbiAgICAgICAgICAgIGltZy5jbGFzc0xpc3QudG9nZ2xlKFwicGljdHVyZXNEYXJrXCIsIGlzRGFyayk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBzZWFyY2ggbG9va3NcbiAgICBkb21FbGVtZW50c18xLnNlYXJjaC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgke2lzRGFyayA/IFwiODAsIDgwLCA4MFwiIDogXCIyMTcsMjIwLDIyMlwifSwgJHthbHBoYX0pYDtcbiAgICBkb21FbGVtZW50c18xLnNlYXJjaC5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlQWNjZW50IDogY3NzVmFyaWFibGVzXzEubGlnaHRNb2RlQWNjZW50O1xuICAgIGRvbUVsZW1lbnRzXzEuc2VhcmNoSW5wdXQuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBjc3NWYXJpYWJsZXNfMS5kYXJrTW9kZUFjY2VudCA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZUFjY2VudDtcbiAgICBkb21FbGVtZW50c18xLnNlYXJjaEljb24uc3R5bGUuY29sb3IgPSBpc0RhcmtcbiAgICAgICAgPyBcInJnYmEoMjMxLCAxOTYsIDI0OSwgMC4yNSlcIlxuICAgICAgICA6IFwicmdiYSgwLCAwLCAwLCAwLjI1KVwiO1xuICAgIC8vIGVubGFyZ2Ugdmlld1xuICAgIGRvbUVsZW1lbnRzXzEuZW5sYXJnZWRWaWV3LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGlzRGFya1xuICAgICAgICA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlUHJpbWFyeVxuICAgICAgICA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZVByaW1hcnk7XG4gICAgZG9tRWxlbWVudHNfMS5lbmxhcmdlZEltZy5zdHlsZS5ib3hTaGFkb3cgPSBib3hTaGFkb3coKTtcbiAgICBkb21FbGVtZW50c18xLnN0YXRpb25OYW1lQmlnLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gY3NzVmFyaWFibGVzXzEuZGFya01vZGVBY2NlbnQgOiBjc3NWYXJpYWJsZXNfMS5saWdodE1vZGVBY2NlbnQ7XG4gICAgZG9tRWxlbWVudHNfMS5saXZlQnV0dG9uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gY3NzVmFyaWFibGVzXzEuZGFya01vZGVTZWNvbmRhcnkgOiBcIiMyMjJcIjtcbiAgICBkb21FbGVtZW50c18xLnBhdXNlQnV0dG9uLnN0eWxlLmNvbG9yID0gaXNEYXJrID8gY3NzVmFyaWFibGVzXzEuZGFya01vZGVBY2NlbnQgOiBjc3NWYXJpYWJsZXNfMS5saWdodE1vZGVBY2NlbnQ7XG4gICAgZG9tRWxlbWVudHNfMS5iYWNrQXJyb3cuc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBjc3NWYXJpYWJsZXNfMS5kYXJrTW9kZVNlY29uZGFyeSA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZUFjY2VudDtcbiAgICBjb25zdCByaWdodENoZXZyb24gPSBkb21FbGVtZW50c18xLnJpZ2h0QXJyb3cucXVlcnlTZWxlY3RvcihcIi5jaGV2cm9uXCIpO1xuICAgIGlmIChyaWdodENoZXZyb24pIHtcbiAgICAgICAgcmlnaHRDaGV2cm9uLnN0eWxlLmNvbG9yID0gaXNEYXJrXG4gICAgICAgICAgICA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlU2Vjb25kYXJ5XG4gICAgICAgICAgICA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZUFjY2VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRvbUVsZW1lbnRzXzEucmlnaHRBcnJvdy5zdHlsZS5jb2xvciA9IGlzRGFyayA/IGNzc1ZhcmlhYmxlc18xLmRhcmtNb2RlU2Vjb25kYXJ5IDogY3NzVmFyaWFibGVzXzEubGlnaHRNb2RlQWNjZW50O1xuICAgIH1cbiAgICBkb21FbGVtZW50c18xLnZvbHVtZU9mZkljb24uc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBjc3NWYXJpYWJsZXNfMS5kYXJrTW9kZVNlY29uZGFyeSA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZUFjY2VudDtcbiAgICBkb21FbGVtZW50c18xLnZvbHVtZU1heEljb24uc3R5bGUuY29sb3IgPSBpc0RhcmsgPyBjc3NWYXJpYWJsZXNfMS5kYXJrTW9kZVNlY29uZGFyeSA6IGNzc1ZhcmlhYmxlc18xLmxpZ2h0TW9kZUFjY2VudDtcbn0pO1xuZnVuY3Rpb24gYm94U2hhZG93KCkge1xuICAgIGNvbnN0IGNvbG9yID0gaXNEYXJrID8gXCIyMzEsIDE5NiwgMjQ5XCIgOiBcIjExNywgMTE3LCAxMTdcIjtcbiAgICByZXR1cm4gYDBweCAxMHB4IDE1cHggcmdiYSgke2NvbG9yfSwgMC41KSwgMTBweCAyMHB4IDIwcHggcmdiYSgke2NvbG9yfSwgMC41KSwgMHB4IDMwcHggNDBweCByZ2JhKCR7Y29sb3J9LCAwLjUpYDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUFscGhhKGVsZW1lbnQsIG5ld0FscGhhKSB7XG4gICAgLy8gdXBkYXRlIGJhY2tncm91bmQgY29sb3IgYWxwaGEgdmFsdWVcbiAgICBjb25zdCBjdXJyZW50Q29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgY29uc3QgcmdiVmFsdWVzID0gY3VycmVudENvbG9yLm1hdGNoKC9cXGQrL2cpO1xuICAgIGlmIChyZ2JWYWx1ZXMpIHtcbiAgICAgICAgY29uc3QgW3IsIGcsIGJdID0gcmdiVmFsdWVzO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7bmV3QWxwaGF9KWA7XG4gICAgfVxufVxuLy8gQ29sbGFwc2libGUgc2VhcmNoIGJhciBsb2dpY1xuLy8gT25seSBjb2xsYXBzZSBzZWFyY2ggYmFyIGFmdGVyIHNjcm9sbGluZyBkb3duIGEgYml0IChlLmcuLCA0MHB4KVxuY29uc3Qgc2VhcmNoUGxhY2Vob2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1wbGFjZWhvbGRlclwiKTtcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSA0MDtcbiAgICBpZiAod2luZG93LnNjcm9sbFkgPiB0aHJlc2hvbGQpIHtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5zZWFyY2guY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgaWYgKHNlYXJjaFBsYWNlaG9sZGVyKVxuICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgZG9tRWxlbWVudHNfMS50b3BCYXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImZsZXgtc3RhcnRcIjtcbiAgICAgICAgaGFzU2Nyb2xsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5zZWFyY2guY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgaWYgKHNlYXJjaFBsYWNlaG9sZGVyKVxuICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBkb21FbGVtZW50c18xLnRvcEJhci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgICAgIGhhc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgfVxufTtcbmZ1bmN0aW9uIGN1c3RvbVNjcm9sbFRvVG9wKGR1cmF0aW9uID0gNjAwKSB7XG4gICAgY29uc3Qgc3RhcnRZID0gd2luZG93LnNjcm9sbFk7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgZnVuY3Rpb24gZWFzZU91dCh0KSB7XG4gICAgICAgIC8vIEVhc2Ugb3V0IGN1YmljXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIHQsIDMpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdGVwKG5vdykge1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gc3RhcnRUaW1lO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWluKGVsYXBzZWQgLyBkdXJhdGlvbiwgMSk7XG4gICAgICAgIGNvbnN0IGVhc2VkID0gZWFzZU91dChwcm9ncmVzcyk7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGFydFkgKiAoMSAtIGVhc2VkKSk7XG4gICAgICAgIGlmIChwcm9ncmVzcyA8IDEpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XG59XG5kb21FbGVtZW50c18xLnNlYXJjaEljb24gPT09IG51bGwgfHwgZG9tRWxlbWVudHNfMS5zZWFyY2hJY29uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkb21FbGVtZW50c18xLnNlYXJjaEljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpZiAoZG9tRWxlbWVudHNfMS5zZWFyY2guY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29sbGFwc2VkXCIpKSB7XG4gICAgICAgIGN1c3RvbVNjcm9sbFRvVG9wKDYwMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9tRWxlbWVudHNfMS5zZWFyY2guY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgICAgIGRvbUVsZW1lbnRzXzEuc2VhcmNoSW5wdXQgPT09IG51bGwgfHwgZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dC5mb2N1cygpO1xuICAgICAgICB9LCA2MDApO1xuICAgIH1cbiAgICBlbHNlIGlmIChoYXNTY3JvbGxlZCkge1xuICAgICAgICBjdXN0b21TY3JvbGxUb1RvcCg2MDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvbUVsZW1lbnRzXzEuc2VhcmNoSW5wdXQgPT09IG51bGwgfHwgZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZG9tRWxlbWVudHNfMS5zZWFyY2hJbnB1dC5mb2N1cygpO1xuICAgICAgICB9LCA2MDApO1xuICAgIH1cbn0pO1xuLy9yaWdodCBzY3JlZW4gYnV0dG9uc1xuZnVuY3Rpb24gcGF1c2VPclJlc3VtZSgpIHtcbiAgICBpZiAoIWlzUGF1c2VkKSB7XG4gICAgICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8ucGF1c2UoKTtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5wYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc3RvcFwiKTtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5wYXVzZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmEtcGxheVwiKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgICAgIGlmU3RvcHBlZCgpO1xuICAgICAgICBkb21FbGVtZW50c18xLmxpdmVCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjdXJyZW50U3RhdGlvbkF1ZGlvLnBsYXkoKTtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5wYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtcGxheVwiKTtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5wYXVzZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc3RvcFwiKTtcbiAgICAgICAgaXNQYXVzZWQgPSAhaXNQYXVzZWQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ29MaXZlKCkge1xuICAgIHN0YXJ0aW5nVGhlU3RhdGlvbihjdXJyZW50U3RhdGlvbk5hbWUpO1xufVxuZG9tRWxlbWVudHNfMS5wYXVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGF1c2VPclJlc3VtZSk7XG5kb21FbGVtZW50c18xLmxpdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGdvTGl2ZSk7XG4vL3ZvbHVtZVxuZnVuY3Rpb24gdXBkYXRlVm9sdW1lKCkge1xuICAgIGN1cnJlbnRWb2x1bWUgPSBwYXJzZUludChkb21FbGVtZW50c18xLnZvbHVtZVNsaWRlci52YWx1ZSkgLyAxMDA7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby52b2x1bWUgPSBjdXJyZW50Vm9sdW1lO1xufVxuZG9tRWxlbWVudHNfMS52b2x1bWVPZmZJY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY3VycmVudFN0YXRpb25BdWRpby52b2x1bWUgPSAwO1xuICAgIGN1cnJlbnRWb2x1bWUgPSAwO1xuICAgIGRvbUVsZW1lbnRzXzEudm9sdW1lU2xpZGVyLnZhbHVlID0gXCIwXCI7XG59KTtcbmRvbUVsZW1lbnRzXzEudm9sdW1lTWF4SWNvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGN1cnJlbnRTdGF0aW9uQXVkaW8udm9sdW1lID0gMTtcbiAgICBjdXJyZW50Vm9sdW1lID0gMTtcbiAgICBkb21FbGVtZW50c18xLnZvbHVtZVNsaWRlci52YWx1ZSA9IFwiMTAwXCI7XG59KTtcbmRvbUVsZW1lbnRzXzEudm9sdW1lU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCB1cGRhdGVWb2x1bWUpO1xuZnVuY3Rpb24gaWZTdG9wcGVkKCkge1xuICAgIGxhc3Rzb25nID0ge307XG4gICAgZXZlcnN0b3BwZWQgPSB0cnVlO1xuICAgIGRvbUVsZW1lbnRzXzEubGl2ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9tRWxlbWVudHNfMS5zb25nRGVzY3JpcHRpb24uaW5uZXJIVE1MID0gYGA7XG4gICAgfSwgMTAwMDApO1xufVxuZnVuY3Rpb24gbG9hZEltZyhpbWdTb3VyY2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBkb21FbGVtZW50c18xLmVubGFyZ2VkSW1nLnNyYyA9IGltZ1NvdXJjZTtcbiAgICB9KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kYXJrTW9kZUFjY2VudCA9IGV4cG9ydHMuZGFya01vZGVTZWNvbmRhcnkgPSBleHBvcnRzLmRhcmtNb2RlUHJpbWFyeSA9IGV4cG9ydHMubGlnaHRNb2RlQWNjZW50ID0gZXhwb3J0cy5saWdodE1vZGVTZWNvbmRhcnkgPSBleHBvcnRzLmxpZ2h0TW9kZVByaW1hcnkgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRDU1NWYXJpYWJsZVZhbHVlKHZhcmlhYmxlTmFtZSkge1xuICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSh2YXJpYWJsZU5hbWUpLnRyaW0oKTtcbn1cbmNvbnN0IGxpZ2h0TW9kZVByaW1hcnkgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWxpZ2h0LW1vZGUtcHJpbWFyeScpO1xuZXhwb3J0cy5saWdodE1vZGVQcmltYXJ5ID0gbGlnaHRNb2RlUHJpbWFyeTtcbmNvbnN0IGxpZ2h0TW9kZVNlY29uZGFyeSA9IGdldENTU1ZhcmlhYmxlVmFsdWUoJy0tbGlnaHQtbW9kZS1TZWNvbmRhcnknKTtcbmV4cG9ydHMubGlnaHRNb2RlU2Vjb25kYXJ5ID0gbGlnaHRNb2RlU2Vjb25kYXJ5O1xuY29uc3QgbGlnaHRNb2RlQWNjZW50ID0gZ2V0Q1NTVmFyaWFibGVWYWx1ZSgnLS1saWdodC1tb2RlLUFjY2VudCcpO1xuZXhwb3J0cy5saWdodE1vZGVBY2NlbnQgPSBsaWdodE1vZGVBY2NlbnQ7XG5jb25zdCBkYXJrTW9kZVByaW1hcnkgPSBnZXRDU1NWYXJpYWJsZVZhbHVlKCctLWRhcmstbW9kZS1wcmltYXJ5Jyk7XG5leHBvcnRzLmRhcmtNb2RlUHJpbWFyeSA9IGRhcmtNb2RlUHJpbWFyeTtcbmNvbnN0IGRhcmtNb2RlU2Vjb25kYXJ5ID0gZ2V0Q1NTVmFyaWFibGVWYWx1ZSgnLS1kYXJrLW1vZGUtU2Vjb25kYXJ5Jyk7XG5leHBvcnRzLmRhcmtNb2RlU2Vjb25kYXJ5ID0gZGFya01vZGVTZWNvbmRhcnk7XG5jb25zdCBkYXJrTW9kZUFjY2VudCA9IGdldENTU1ZhcmlhYmxlVmFsdWUoJy0tZGFyay1tb2RlLUFjY2VudCcpO1xuZXhwb3J0cy5kYXJrTW9kZUFjY2VudCA9IGRhcmtNb2RlQWNjZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZvbHVtZU1heEljb24gPSBleHBvcnRzLnZvbHVtZU9mZkljb24gPSBleHBvcnRzLnZvbHVtZVNsaWRlciA9IGV4cG9ydHMuc29uZ0Rlc2NyaXB0aW9uID0gZXhwb3J0cy5wYXVzZUJ1dHRvbiA9IGV4cG9ydHMubGl2ZUJ1dHRvbiA9IGV4cG9ydHMuc3RhdGlvbk5hbWVCaWcgPSBleHBvcnRzLmVubGFyZ2VkSW1nID0gZXhwb3J0cy5yaWdodEFycm93ID0gZXhwb3J0cy5iYWNrQXJyb3cgPSBleHBvcnRzLmVubGFyZ2VkVmlldyA9IGV4cG9ydHMuc2VhcmNoSWNvbiA9IGV4cG9ydHMuc2VhcmNoID0gZXhwb3J0cy5uaWdodE1vZGUgPSBleHBvcnRzLnRvcEJhciA9IGV4cG9ydHMuc2VhcmNoSW5wdXQgPSBleHBvcnRzLm1haW4gPSBleHBvcnRzLmJvZHkgPSB2b2lkIDA7XG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuZXhwb3J0cy5ib2R5ID0gYm9keTtcbmNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmVlblwiKTtcbmV4cG9ydHMubWFpbiA9IG1haW47XG5jb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWlucHV0XCIpO1xuZXhwb3J0cy5zZWFyY2hJbnB1dCA9IHNlYXJjaElucHV0O1xuY29uc3QgdG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXJcIik7XG5leHBvcnRzLnRvcEJhciA9IHRvcEJhcjtcbmNvbnN0IG5pZ2h0TW9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFyay1tb2RlLWljb25cIik7XG5leHBvcnRzLm5pZ2h0TW9kZSA9IG5pZ2h0TW9kZTtcbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoXCIpO1xuZXhwb3J0cy5zZWFyY2ggPSBzZWFyY2g7XG5jb25zdCBzZWFyY2hJY29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hJY29uXCIpO1xuZXhwb3J0cy5zZWFyY2hJY29uID0gc2VhcmNoSWNvbjtcbmNvbnN0IGVubGFyZ2VkVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5sYXJnZWQtdmlld1wiKTtcbmV4cG9ydHMuZW5sYXJnZWRWaWV3ID0gZW5sYXJnZWRWaWV3O1xuY29uc3QgYmFja0Fycm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrLWFycm93XCIpO1xuZXhwb3J0cy5iYWNrQXJyb3cgPSBiYWNrQXJyb3c7XG5jb25zdCByaWdodEFycm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1hcnJvdy1pZFwiKTtcbmV4cG9ydHMucmlnaHRBcnJvdyA9IHJpZ2h0QXJyb3c7XG5jb25zdCBlbmxhcmdlZEltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW5sYXJnZWQtaW1nXCIpO1xuZXhwb3J0cy5lbmxhcmdlZEltZyA9IGVubGFyZ2VkSW1nO1xuY29uc3Qgc3RhdGlvbk5hbWVCaWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXRpb24tbmFtZS1iaWdcIik7XG5leHBvcnRzLnN0YXRpb25OYW1lQmlnID0gc3RhdGlvbk5hbWVCaWc7XG5jb25zdCBsaXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXZlLWJ1dHRvblwiKTtcbmV4cG9ydHMubGl2ZUJ1dHRvbiA9IGxpdmVCdXR0b247XG5jb25zdCBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2UtYnV0dG9uXCIpO1xuZXhwb3J0cy5wYXVzZUJ1dHRvbiA9IHBhdXNlQnV0dG9uO1xuY29uc3Qgc29uZ0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvbmctbmFtZScpO1xuZXhwb3J0cy5zb25nRGVzY3JpcHRpb24gPSBzb25nRGVzY3JpcHRpb247XG5jb25zdCB2b2x1bWVTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlci12b2xcIik7XG5leHBvcnRzLnZvbHVtZVNsaWRlciA9IHZvbHVtZVNsaWRlcjtcbmNvbnN0IHZvbHVtZU9mZkljb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZvbHVtZS1vZmZcIik7XG5leHBvcnRzLnZvbHVtZU9mZkljb24gPSB2b2x1bWVPZmZJY29uO1xuY29uc3Qgdm9sdW1lTWF4SWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9sdW1lLW1heFwiKTtcbmV4cG9ydHMudm9sdW1lTWF4SWNvbiA9IHZvbHVtZU1heEljb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmFkaW9NYXAgPSB2b2lkIDA7XG5jb25zdCByYWRpb1N0YXRpb25zSW5mb19qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3JhZGlvU3RhdGlvbnNJbmZvLmpzb25cIikpO1xuY29uc3QgUmFkaW9JbmZvQ2xhc3NfMSA9IHJlcXVpcmUoXCIuL1JhZGlvSW5mb0NsYXNzXCIpO1xuY29uc3QgcmFkaW9NYXAgPSB7fTtcbmV4cG9ydHMucmFkaW9NYXAgPSByYWRpb01hcDtcbmZ1bmN0aW9uIGNyZWF0ZVJhZGlvRGljdChkaWN0KSB7XG4gICAgbGV0IGhlbHBlciA9IGZhbHNlO1xuICAgIGxldCBuZXdIZWJyZXdOYW1lO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJhZGlvU3RhdGlvbnNJbmZvX2pzb25fMS5kZWZhdWx0KSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtfLCB2YWx1ZTFdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFoZWxwZXIpIHtcbiAgICAgICAgICAgICAgICBuZXdIZWJyZXdOYW1lID0gdmFsdWUxO1xuICAgICAgICAgICAgICAgIGhlbHBlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaWN0W2tleV0gPSBuZXcgUmFkaW9JbmZvQ2xhc3NfMS5SYWRpb0luZm9DbGFzcyhuZXdIZWJyZXdOYW1lLCB2YWx1ZTEpO1xuICAgICAgICAgICAgICAgIGhlbHBlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY3JlYXRlUmFkaW9EaWN0KHJhZGlvTWFwKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy90cy9hcHBTZXJ2aWNlcy50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==