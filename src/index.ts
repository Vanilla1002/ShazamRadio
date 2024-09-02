import { Socket } from 'dgram';
import radioStationsInfo from './radioStationsInfo.json';

class RadioToHebrewNames{
    hebrewName: string; 
    link: string;

    public constructor(hebrewName: string,link: string){
        this.hebrewName = hebrewName;
        this.link = link
    }
}
const radioMap: {[key: string]: RadioToHebrewNames}={};
function createRadioDict(dict: {[key: string]: RadioToHebrewNames}){
    let helper = false;
    let newHebrewName;
    for (const [key,value] of Object.entries(radioStationsInfo)){
        for (const [_,value1] of Object.entries(value)){
            if (!helper){
                newHebrewName = value1
                helper = true;
            }
            else{
                dict[key]=new RadioToHebrewNames(newHebrewName,value1);
                helper = false;
            }
            
        }
    }
}
createRadioDict(radioMap);



//DOM 
const body = document.querySelector('body');
const main = document.getElementById("screen");
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const topBar = document.getElementById("bar");
const nightMode = document.getElementById("dark-mode-icon");
const search = document.getElementById("search"); //looks
const searchIcon = document.getElementById("searchIcon");



const enlargedView = document.getElementById("enlarged-view");
const backArrow = document.getElementById("back-arrow");
const rightArrow = document.getElementById("right-arrow-id");
const enlargedImg  = document.getElementById("enlarged-img") as HTMLImageElement;
const stationNameBig = document.getElementById("station-name-big");
const liveButton = document.getElementById("live-button");
const pauseButton = document.getElementById("pause-button");
const songDestcripton = document.getElementById('song-name');


const volumeSlider = document.getElementById("slider-vol") as HTMLInputElement;
const volumeOffIcon = document.getElementById("volume-off");
const volumeMaxIcon = document.getElementById("volume-max");


let currentStationAudio: HTMLAudioElement = new Audio();
let currentStationName: string = '';
let isRadio: boolean = false;
let isDark: boolean = false;
let isPaused :boolean = false;
let hasScrolled: boolean = false;
let descriptions: HTMLElement[] = [];
let alpha: number = 1;
let everstopped : boolean = false;
let lastsong : {};
let currentVolume = parseInt(volumeSlider.value)/100;

//CSS variables
function getCSSVariableValue(variableName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  
  const lightModePrimary = getCSSVariableValue('--light-mode-primary');
  const lightModeSecondary = getCSSVariableValue('--light-mode-Secondary');
  const lightModeAccent = getCSSVariableValue('--light-mode-Accent');
  
  const darkModePrimary = getCSSVariableValue('--dark-mode-primary');
  const darkModeSecondary = getCSSVariableValue('--dark-mode-Secondary');
  const darkModeAccent = getCSSVariableValue('--dark-mode-Accent');


//send request, and get response
async function sendSongRequest(radioName: string) {
    const response = await fetch('/identify_song', {
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
    const currentSong = await response.json();
    console.log(currentSong);
    if (currentSong == null){
        songDestcripton.innerHTML = ``;
        return;
    }
    if (currentSong != lastsong){
        songDestcripton.innerHTML = `${currentSong['songName']} - ${currentSong['singer']}`;
        songDestcripton.setAttribute("href", `${currentSong['href']}`);
        lastsong = currentSong;
    }
} 


function sendUpdate() {
    if (isRadio && !everstopped ){
        sendSongRequest(currentStationName);
    }
}

setInterval(function(){
    sendUpdate()
}, 30000)




//creating the main (all the stations)
for (const radioName in radioMap){
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
    figure.setAttribute('id',radioName);
    figure.appendChild(element);
    figure.appendChild(elementDescription);

    descriptions.push(figure);
    main?.appendChild(figure);
}

function whenChosingStation(stationId : string, imgSource : string = `../assets/_images/StationsPng/${stationId}.png`) {
    
    loadImg(imgSource);
    
    stationNameBig.textContent = radioMap[stationId].hebrewName;
    if(currentStationName!= stationId){
        startingTheStation(stationId);

    }
    currentStationName = stationId;
    openingBigStationTab();
}

async function startingTheStation(stationId : string){
    songDestcripton.innerHTML = ``;
    
    currentStationAudio.pause();
    currentStationAudio = new Audio(radioMap[stationId].link);
    currentStationAudio.volume = currentVolume;
    currentStationAudio.play();
    pauseButton.classList.remove('fa-play')
    pauseButton.classList.add('fa-stop')
    liveButton.style.display = 'none';
    isPaused = false;
    everstopped = false;
    isRadio = true;
    sendSongRequest(stationId);
}

function backToMainScreen() {
    enlargedView.classList.remove('active');
    //showing all again
    main.style.display = '';
    for (const radioName in radioMap){
        const currentFigure = document.getElementById(radioName);
        currentFigure?.classList.remove('hidden');

    }
    //wait for animation
    setTimeout(() => {
        enlargedView.classList.add('hidden');
        rightArrow.classList.remove('hidden');
        body.classList.remove('no-scroll');
    }, 500); 
}

function openingBigStationTab(){
    enlargedView.classList.remove('hidden');
    setTimeout(() => {
        enlargedView.classList.add('active');
        searchInput.value = '';
        rightArrow.classList.add('hidden');
        
        
    }, 10); 

    setTimeout(()=>{
        main.style.display = 'none';
        window.scrollTo(0, 0);
    },500);
    body.classList.add('no-scroll');
}

backArrow.addEventListener('click', backToMainScreen);
rightArrow.addEventListener('click', openingBigStationTab);


//search bar contant

searchInput?.addEventListener("input", (e) =>{

    const input = (e.target as HTMLInputElement).value;
    for (const radioName in radioMap){
        const isVisible = (radioMap[radioName].hebrewName).includes(input) || radioName.includes(input);
        const currentFigure = document.getElementById(radioName);
        currentFigure?.classList.toggle("hidden", !isVisible);
        
    }
        
});

//preventing enter
topBar.addEventListener("submit", (e) => {
    e.preventDefault(); 
});

//darkmode 
nightMode?.addEventListener("click", () => {
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
    searchIcon.style.color = isDark ? 'rgba(231, 196, 249, 0.25)' :'rgba(0, 0, 0, 0.25)';

    // enlarge view
    enlargedView.style.backgroundColor = isDark ? darkModePrimary : lightModePrimary;
    enlargedImg.style.boxShadow = boxShadow();
    stationNameBig.style.color = isDark ?  darkModeAccent : lightModeAccent;
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

function updateAlpha(element: HTMLElement, newAlpha: number) {
    // update background color alpha value
    const currentColor = window.getComputedStyle(element).backgroundColor;
    const rgbValues = currentColor.match(/\d+/g);
    
    if (rgbValues) {
        const [r, g, b] = rgbValues;
        element.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    }
}



window.onscroll = function () {  

    if (!hasScrolled || window.scrollY==0){
        //scrolling
        if (window.scrollY!=0){
            //search looks
            updateAlpha(search,0);
            alpha=0;
            //search position
            topBar.style.justifyContent = 'flex-end'
            searchIcon.style.cursor = 'pointer'
            hasScrolled = true;
            searchInput.style.display = 'none'

        }
        //geting back to top
        else{
            //search looks
            updateAlpha(search,1);
            alpha=1

            //search position
            topBar.style.justifyContent = 'center'
            searchIcon.style.cursor = 'default'

            hasScrolled = false;

            searchInput.style.display = ''
        }
    }
} 


searchIcon?.addEventListener("click", () =>{
    if (hasScrolled){
        window.scrollTo(0, 0);
        setTimeout(() => {
            searchInput?.focus();
        }, 10);
    }
})


//right screen buttons

function pauseOrResume(){
    if (!isPaused){
        currentStationAudio.pause();
        pauseButton.classList.remove('fa-stop')
        pauseButton.classList.add('fa-play')
        isPaused = !isPaused;
        ifStopped()
        liveButton.style.display = '';
    }
    else{
        currentStationAudio.play();
        pauseButton.classList.remove('fa-play')
        pauseButton.classList.add('fa-stop')
        isPaused = !isPaused;
    }
}

function goLive(){
        startingTheStation(currentStationName);
}



pauseButton.addEventListener("click",pauseOrResume);
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


function ifStopped(){
    lastsong = {}
    everstopped = true;
    liveButton.style.display = '';
    setTimeout(()=>{
        songDestcripton.innerHTML = ``;
    },10000);
    
}


async function loadImg(imgSource : string) {
    enlargedImg.src = imgSource;
}
