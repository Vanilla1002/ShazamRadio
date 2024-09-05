const body = document.querySelector('body') as HTMLBodyElement;
const main = document.getElementById("screen") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const topBar = document.getElementById("bar") as HTMLFormElement;
const nightMode = document.getElementById("dark-mode-icon") as HTMLSpanElement;
const search = document.getElementById("search") as HTMLDivElement; 
const searchIcon = document.getElementById("searchIcon") as HTMLSpanElement;

const enlargedView = document.getElementById("enlarged-view") as HTMLDivElement;
const backArrow = document.getElementById("back-arrow") as HTMLSpanElement;
const rightArrow = document.getElementById("right-arrow-id") as HTMLDivElement;
const enlargedImg  = document.getElementById("enlarged-img") as HTMLImageElement;
const stationNameBig = document.getElementById("station-name-big") as HTMLElement;
const liveButton = document.getElementById("live-button") as HTMLSpanElement;
const pauseButton = document.getElementById("pause-button") as HTMLElement;
const songDescription = document.getElementById('song-name') as HTMLAnchorElement;


const volumeSlider = document.getElementById("slider-vol") as HTMLInputElement;
const volumeOffIcon = document.getElementById("volume-off") as HTMLSpanElement;
const volumeMaxIcon = document.getElementById("volume-max") as HTMLSpanElement;

export { 
    body, 
    main, 
    searchInput, 
    topBar, 
    nightMode, 
    search, 
    searchIcon, 
    enlargedView, 
    backArrow, 
    rightArrow, 
    enlargedImg, 
    stationNameBig, 
    liveButton, 
    pauseButton, 
    songDescription, 
    volumeSlider, 
    volumeOffIcon, 
    volumeMaxIcon
}