import { radioMap } from "./radioMap";
import { initAddStationModal } from "./addStation";

import {
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
  volumeMaxIcon,
  newsContent
} from "./domElements";

import {
  lightModePrimary,
  lightModeSecondary,
  lightModeAccent,
  darkModePrimary,
  darkModeSecondary,
  darkModeAccent,
} from "./cssVariables";

const defaultImgSource = "../assets/_images/StationsPng/default.png";
let currentStationAudio: HTMLAudioElement = new Audio();
let currentStationName: string = "";
let isRadio: boolean = false;
let isDark: boolean = false;
let isPaused: boolean = false;
let hasScrolled: boolean = false;
let descriptions: HTMLElement[] = [];
let alpha: number = 1;
let everstopped: boolean = false;
let lastsong: {};
let currentVolume = parseInt(volumeSlider.value) / 100;

// ==== User stations (localStorage) support (moved core logic to addStation.ts) ====
type UserStation = { displayName: string; link: string };
const USER_STATIONS_KEY = "sr_userStations_v1";
function loadUserStations(): Record<string, UserStation> {
  try {
    const raw = localStorage.getItem(USER_STATIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, UserStation>) : {};
  } catch { return {}; }
}
function slugifyId(s: string): string {
  return (s || "user-station")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-");
}
function collectBaseIds(): Set<string> {
  const ids = new Set<string>();
  for (const id in radioMap) ids.add(id);
  return ids;
}
function ensureUniqueId(baseIds: Set<string>, userMap: Record<string, UserStation>, id: string): string {
  if (!baseIds.has(id) && !(id in userMap)) return id;
  let i = 2;
  while (baseIds.has(`${id}-${i}`) || `${id}-${i}` in userMap) i++;
  return `${id}-${i}`;
}
function removeExistingUserFigures() {
  main?.querySelectorAll("figure[data-user='1']").forEach((el) => {
    const img = el.querySelector('img');
    if (img && (img as HTMLImageElement).dataset.objectUrl) {
      URL.revokeObjectURL((img as HTMLImageElement).dataset.objectUrl!);
    }
    el.remove();
  });
  descriptions = descriptions.filter((fig) => fig.getAttribute("data-user") !== "1");
}
function renderUserStations() {
  removeExistingUserFigures();
  const baseIds = collectBaseIds();
  const userMap = loadUserStations();

  Object.entries(userMap).forEach(([idRaw, st]) => {
    // Use the key as-is; it's already unique at save time
    const id = idRaw || slugifyId(st.displayName || "user-station");
    const img = document.createElement("img");
    // Always try IndexedDB blob; show placeholder until it loads
    img.src = defaultImgSource;
    import('./imageStore').then(mod => mod.getStationImage(id)).then(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        img.src = url;
        (img as HTMLImageElement).dataset.objectUrl = url;
      }
    }).catch(() => { /* ignore */ });
    img.classList.add("pictures");
    img.onerror = () => { img.src = defaultImgSource; };

    img.addEventListener("click", () =>
      whenChosingStation(id, defaultImgSource, st.displayName, st.link)
    );

    const elementDescription = document.createElement("figcaption");
    elementDescription.classList.add("description");
    elementDescription.appendChild(document.createTextNode(st.displayName || id));

    const figure = document.createElement("figure");
    figure.setAttribute("id", id);
    figure.setAttribute("data-user", "1");
    figure.appendChild(img);
    figure.appendChild(elementDescription);

    descriptions.push(figure);
    main?.appendChild(figure);
  });
}
// Plus icon
const plusIconSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="16" ry="16" fill="none"/><path d="M60 35 v50 M35 60 h50" stroke="%23888" stroke-width="8" stroke-linecap="round"/></svg>';

// Initialize external modal and get open function
const openAddStationModal = initAddStationModal(() => {
  renderUserStations();
  renderAddTile();
}, collectBaseIds);

// ==== End user stations support ====

//networking
async function sendSongRequest(radioName: string) {
  const response = await fetch("/identify_song", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ radio_name: radioName }),
  });

  if (!response.ok) {
    songDescription.innerHTML = ``;
    console.error("Failed to fetch:", response.statusText);
    return;
  }
  const currentSong = await response.json();
  //console.log(currentSong);
  if (currentSong == null) {
    songDescription.innerHTML = ``;
    return;
  }
  if (currentSong != lastsong) {
    songDescription.innerHTML = `${currentSong["songName"]} - ${currentSong["singer"]}`;
    songDescription.setAttribute("href", `${currentSong["href"]}`);
    lastsong = currentSong;
  }
}

function sendUpdate() {
  if (isRadio && !everstopped) {
    sendSongRequest(currentStationName);
  }
}

setInterval(function () {
  sendUpdate();
}, 30000);



// You can include any data in the body if needed
const requestData = {
  someKey: "someValue"
};

//news suction
interface Article {
  title: string;
  link: string;
  published: string;
  hh_mm?: string;
}

let articles: Article[] = [];

async function fetchNews() {
  try {
    const response = await fetch("/news");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const newArticles: Article[] = await response.json();

    if (newArticles.length > 0) {
      // Replace the local list completely
      articles = newArticles.slice(0, 30); // keep only 30 latest
      // console.log("Updated articles:", articles);
      resetNewsCycle();
    } else {
      console.log("No articles received");
    }
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

let currentArticleIndex = 0;

function renderCurrentArticle() {
  if (!articles.length || !newsContent) {
    newsContent.innerHTML = "<span style='opacity:0.6;'>No news available</span>";
    return;
  }
  const article = articles[currentArticleIndex % articles.length];
  newsContent.innerHTML = `
    <div class='news-article'>
      <span class='news-time'>${article.hh_mm || ''}</span>
      <div class='news-title-container'>
        <a href='${article.link}' target='_blank' class='news-title'>
          <span dir="auto">${article.title}</span>
        </a>
      </div>
    </div>
  `;
}

function fadeNewsOutIn(callback: () => void) {
  if (!newsContent) return;
  newsContent.style.transition = "opacity 0.5s";
  newsContent.style.opacity = "0";
  setTimeout(() => {
    callback();
    newsContent.style.opacity = "1";
  }, 500);
}

function startNewsCycle() {
  renderCurrentArticle();
  newsContent.style.opacity = "1";
  newsContent.style.transition = "opacity 0.5s";
  setInterval(() => {
    if (articles.length > 0) {
      currentArticleIndex = (currentArticleIndex + 1) % articles.length;
      fadeNewsOutIn(renderCurrentArticle);
    }
  }, 10000);
}

// Start cycling after first fetch, only once

let newsCycleInterval: ReturnType<typeof setInterval> | null = null;

function resetNewsCycle() {
  if (newsCycleInterval) clearInterval(newsCycleInterval);
  currentArticleIndex = 0;
  renderCurrentArticle();
  newsContent.style.opacity = "1";
  newsContent.style.transition = "opacity 0.5s";
  newsCycleInterval = setInterval(() => {
    if (articles.length > 0) {
      currentArticleIndex = (currentArticleIndex + 1) % articles.length;
      fadeNewsOutIn(renderCurrentArticle);
    }
  }, 10000);
}

fetchNews().then(() => {
  resetNewsCycle();
});
// Fetch every 5 minutes
setInterval(fetchNews, 300000);

//creating the main (all the stations)
for (const radioName in radioMap) {
  let imgSource = `../assets/_images/StationsPng/${radioName}.png`;
  const element = document.createElement("img");
  element.src = imgSource;
  element.classList.add("pictures");

  element.onerror = () => {
    imgSource = defaultImgSource;
    element.src = defaultImgSource;
  };

  //pressable
  element.addEventListener("click", () =>
    whenChosingStation(radioName, imgSource)
  );

  const elementDescription = document.createElement("figcaption");
  elementDescription.classList.add("description");
  elementDescription.appendChild(
    document.createTextNode(radioMap[radioName].hebrewName)
  );

  const figure = document.createElement("figure");
  figure.setAttribute("id", radioName);
  figure.appendChild(element);
  figure.appendChild(elementDescription);

  descriptions.push(figure);
  main?.appendChild(figure);
}

// Render an in-grid "+" tile (slightly smaller than stations)
function renderAddTile() {
  // Remove existing add tile if present
  const existing = document.getElementById("add-station-tile");
  existing?.remove();
  // Also remove from descriptions if previously added
  descriptions = descriptions.filter((el) => el.id !== "add-station-tile");

  const img = document.createElement("img");
  img.src = plusIconSvg;
  img.classList.add("pictures");
  img.alt = "+";
  // Keep same tile size as others; plus glyph itself is smaller inside the SVG

  img.addEventListener("click", () => openAddStationModal());

  const cap = document.createElement("figcaption");
  cap.classList.add("description");
  cap.appendChild(document.createTextNode("הוסף תחנה"));

  const fig = document.createElement("figure");
  fig.setAttribute("id", "add-station-tile");
  fig.setAttribute("data-add", "1");
  fig.appendChild(img);
  fig.appendChild(cap);

  // Place at the end as the last station
  descriptions.push(fig);
  main?.appendChild(fig);
}

// Render user stations first, then add tile as the last station
renderUserStations();
renderAddTile();
// Optionally keep the header button; comment out if not needed
// mountAddStationButton();

function whenChosingStation(
  stationId: string,
  imgSource: string = `../assets/_images/StationsPng/${stationId}.png`,
  displayName?: string,
  directLink?: string
) {
  loadImg(imgSource);

  stationNameBig.textContent =
    displayName || radioMap[stationId]?.hebrewName || stationId;
  if (currentStationName != stationId) {
    startingTheStation(stationId, directLink);
  }
  currentStationName = stationId;
  openingBigStationTab();
}

async function startingTheStation(stationId: string, directLink?: string) {
  songDescription.innerHTML = ``;

  currentStationAudio.pause();
  const streamLink = directLink || radioMap[stationId]?.link || "";
  currentStationAudio = new Audio(streamLink);
  currentStationAudio.volume = currentVolume;
  currentStationAudio.play();
  pauseButton.classList.remove("fa-play");
  pauseButton.classList.add("fa-stop");
  liveButton.style.display = "none";
  isPaused = false;
  everstopped = false;
  isRadio = true;
  // Only identify songs for built-in stations known to backend
  if (radioMap[stationId]) {
    sendSongRequest(stationId);
  }
  fetchNews();
}

function backToMainScreen() {
  // Slide night mode button out
  nightMode.classList.remove("slide-in");
  nightMode.classList.add("hide");
  enlargedView.classList.remove("active");
  //showing all again
  main.style.display = "";
  // Show all figures (built-in + user)
  main?.querySelectorAll("figure").forEach((fig) => fig.classList.remove("hidden"));
  //wait for animation
  setTimeout(() => {
    enlargedView.classList.add("hidden");
    rightArrow.classList.remove("hidden");
    body.classList.remove("no-scroll");
    setTimeout(() => {
      nightMode.classList.remove("hide");
    }, 350);
  }, 500);
}

function openingBigStationTab() {
  // Slide night mode button out, then in
  nightMode.classList.add("hide");
  nightMode.classList.remove("slide-in");
  enlargedView.classList.remove("hidden");
  // Set box-shadow immediately for enlarged-img
  enlargedImg.style.boxShadow = boxShadow();
  setTimeout(() => {
    enlargedView.classList.add("active");
    searchInput.value = "";
    rightArrow.classList.add("hidden");
    // Slide night mode button in after enlarged view is active
    setTimeout(() => {
      nightMode.classList.remove("hide");
      nightMode.classList.add("slide-in");
    }, 350);
  }, 10);

  setTimeout(() => {
    main.style.display = "none";
    window.scrollTo(0, 0);
  }, 500);
  body.classList.add("no-scroll");
}

backArrow.addEventListener("click", backToMainScreen);
rightArrow.addEventListener("click", openingBigStationTab);

//search bar contant

searchInput?.addEventListener("input", (e) => {
  const input = (e.target as HTMLInputElement).value.toLowerCase();
  const figures = Array.from(main?.querySelectorAll<HTMLElement>("figure") ?? []);
  figures.forEach((fig) => {
    const id = fig.id.toLowerCase();
    const cap = fig.querySelector("figcaption");
    const name = (cap?.textContent || "").toLowerCase();
    const isVisible = id.includes(input) || name.includes(input);
    fig.classList.toggle("hidden", !isVisible);
  });
});

//preventing enter
topBar.addEventListener("submit", (e) => {
  e.preventDefault();
});

//darkmode
nightMode?.addEventListener("click", () => {

  isDark = !isDark;

  // Toggle dark class on body for CSS selectors
  if (isDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  // nightmode icon
  nightMode.classList.toggle("fa-moon", !isDark);
  nightMode.classList.toggle("fa-sun", isDark);
  nightMode.style.color = isDark ? darkModeSecondary : "#222";

  // background handled by CSS via body.dark class

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
    songDescription.style.color = isDark ? darkModeAccent : lightModeAccent;

    // pictures border
    if (img) {
      img.classList.toggle("pictures", !isDark);
      img.classList.toggle("picturesDark", isDark);
    }
  });

  // search looks
  search.style.backgroundColor = `rgba(${
    isDark ? "80, 80, 80" : "217,220,222"
  }, ${alpha})`;
  search.style.color = isDark ? darkModeAccent : lightModeAccent;
  searchInput.style.color = isDark ? darkModeAccent : lightModeAccent;
  searchIcon.style.color = isDark
    ? "rgba(231, 196, 249, 0.25)"
    : "rgba(0, 0, 0, 0.25)";

  // enlarge view (use CSS classes instead of inline background)
  enlargedImg.classList.toggle("dark", isDark);
  stationNameBig.classList.toggle("dark", isDark);
  liveButton.classList.toggle("dark", isDark);
  pauseButton.classList.toggle("dark", isDark);
  enlargedImg.style.boxShadow = boxShadow();
  backArrow.style.color = isDark ? darkModeSecondary : lightModeAccent;

  backArrow.style.color = isDark ? darkModeSecondary : lightModeAccent;
  const rightChevron = rightArrow.querySelector(".chevron");
  if (rightChevron) {
    (rightChevron as HTMLElement).style.color = isDark
      ? darkModeSecondary
      : lightModeAccent;
  } else {
    rightArrow.style.color = isDark ? darkModeSecondary : lightModeAccent;
  }
  volumeOffIcon.style.color = isDark ? darkModeSecondary : lightModeAccent;
  volumeMaxIcon.style.color = isDark ? darkModeSecondary : lightModeAccent;
});

function boxShadow() {
  const color = isDark ? "231, 196, 249" : "117, 117, 117";
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

// Collapsible search bar logic
// Only collapse search bar after scrolling down a bit (e.g., 40px)
const searchPlaceholder = document.getElementById(
  "search-placeholder"
) as HTMLElement;
window.onscroll = function () {
  const threshold = 40;
  if (window.scrollY > threshold) {
    search.classList.add("collapsed");
    if (searchPlaceholder) searchPlaceholder.style.display = "block";
    topBar.style.justifyContent = "flex-start";
    hasScrolled = true;
  } else {
    search.classList.remove("collapsed");
    if (searchPlaceholder) searchPlaceholder.style.display = "none";
    topBar.style.justifyContent = "center";
    hasScrolled = false;
  }
};

function customScrollToTop(duration = 600) {
  const startY = window.scrollY;
  const startTime = performance.now();
  function easeOut(t: number) {
    // Ease out cubic
    return 1 - Math.pow(1 - t, 3);
  }
  function step(now: number) {
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

searchIcon?.addEventListener("click", () => {
  if (search.classList.contains("collapsed")) {
    customScrollToTop(600);
    setTimeout(() => {
      search.classList.remove("collapsed");
      searchInput?.focus();
    }, 600);
  } else if (hasScrolled) {
    customScrollToTop(600);
    setTimeout(() => {
      searchInput?.focus();
    }, 600);
  }
});

//right screen buttons

function pauseOrResume() {
  if (!isPaused) {
    currentStationAudio.pause();
    pauseButton.classList.remove("fa-stop");
    pauseButton.classList.add("fa-play");
    isPaused = !isPaused;
    ifStopped();
    liveButton.style.display = "";
  } else {
    currentStationAudio.play();
    pauseButton.classList.remove("fa-play");
    pauseButton.classList.add("fa-stop");
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

volumeOffIcon.addEventListener("click", () => {
  currentStationAudio.volume = 0;
  currentVolume = 0;
  volumeSlider.value = "0";
});

volumeMaxIcon.addEventListener("click", () => {
  currentStationAudio.volume = 1;
  currentVolume = 1;
  volumeSlider.value = "100";
});

volumeSlider.addEventListener("input", updateVolume);

function ifStopped() {
  lastsong = {};
  everstopped = true;
  liveButton.style.display = "";
  setTimeout(() => {
    songDescription.innerHTML = ``;
  }, 10000);
}

async function loadImg(imgSource: string) {
  enlargedImg.src = imgSource;
}
