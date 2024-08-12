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
let currentVolume = parseInt(volumeSlider.value);


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

function whenChosingStation(stationId : string) {
    
    enlargedImg.src = `../assets/_images/StationsPng/${stationId}.png`;
    stationNameBig.textContent = radioMap[stationId].hebrewName;
    if (!isRadio){
        currentStationAudio = new Audio(radioMap[stationId].link);
        currentStationAudio.play();
        isRadio = true;

    }
    else if(currentStationName!= stationId ){
        startingTheStation(stationId);
        
    }
    currentStationName = stationId;
    rotatingToRight();
}
function startingTheStation(stationId : string){
    currentStationAudio.pause();
    currentStationAudio = new Audio(radioMap[stationId].link);
    currentStationAudio.play();
    pauseButton.classList.remove('fa-play')
    pauseButton.classList.add('fa-stop')
    isPaused = false;
    everstopped = false;
        
}

function rotatingToLeft() {
    enlargedView.classList.remove('active');
    //showing all again
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

function rotatingToRight(){
    enlargedView.classList.remove('hidden');
    setTimeout(() => {
        enlargedView.classList.add('active');
        searchInput.value = '';
        rightArrow.classList.add('hidden');
        
        
    }, 10); 

    setTimeout(()=>{
        window.scrollTo(0, 0);
    },500);
    body.classList.add('no-scroll');
}

backArrow.addEventListener('click', rotatingToLeft);
rightArrow.addEventListener('click', rotatingToRight);


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
    searchIcon.style.color = isDark ? 'rgba(255,255,255,0.25)' :'rgba(0,0,0,0.25)';

    // enlarge view
    enlargedView.style.backgroundColor = isDark ? 'black' : 'white';
    enlargedImg.style.boxShadow = boxShadow();
    stationNameBig.style.color = isDark ? 'white' : 'black';
});

function boxShadow() {
    const color = isDark ? '180, 180, 180' : '0, 0, 0';
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
        everstopped = true;
    }
    else{
        currentStationAudio.play();
        pauseButton.classList.remove('fa-play')
        pauseButton.classList.add('fa-stop')
        isPaused = !isPaused;
    }
}

function goLive(){
    if (everstopped){
        startingTheStation(currentStationName);
    }
}


pauseButton.addEventListener("click",pauseOrResume);
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
