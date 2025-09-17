# ShazamRadio

ShazamRadio is a modern and easy-to-use web-based radio application with a sleek UI. It allows users to listen to their favorite radio stations, automatically identify currently playing songs, and easily add personal stations. ShazamRadio is built with a TypeScript frontend and a Python backend, offering a seamless and dynamic user experience.

![shazam radio main](https://github.com/user-attachments/assets/cdc9d4f9-061f-4aeb-9ce1-067e20323c0b)

<img width="1167" height="1210" alt="image" src="https://github.com/user-attachments/assets/803ec9e6-d687-4a8d-b627-a4be7325c679" />

## Features
- **Real-Time Song Information:** Automatically identifies the currently playing song and updates the UI with the song title and a link to more information.
- **Dark/Light Mode Toggle:** Easily switch between dark and light themes for comfortable viewing in different environments.
- **Smooth Transitions:** Enjoy a seamless user experience with smooth animations and transitions between views.
- **Customizable Stations:** Easily add your personal radio stations through a simple setup process.
- **Live News Feed:** Stay updated with the latest headlines delivered straight from the Ynet news feed, automatically refreshed and cycled in the app.

## How ShazamRadio Works
ShazamRadio operates by dynamically fetching radio stations, automatically identifying the currently playing song, and updating the UI in real time. Below is an overview of the main components and workflow of the application:

### Frontend (TypeScript):

* Displays radio stations, live news headlines, and song information in a sleek, interactive UI.
* Supports dark and light mode toggles for a better user experience in different environments.
* When the user selects a radio station, the app starts playing the stream and communicates with the backend to update the currently playing song.
* Shows a dedicated news area that cycles through the latest news headlines, with clickable links to full articles.

### Backend (Python/FastAPI):

* The backend server fetches the live stream URL and utilizes song identification logic to automatically detect the currently playing song using Shazamio and FFmpeg.
* Provides a `/news` endpoint that fetches and caches the latest news articles from the Ynet RSS feed and serves them to the frontend as JSON.
* Updates the UI with the song title, relevant information, and latest news in real time.

### Live News Feed

* The news area displays the latest headlines from the Ynet news feed.
* News updates are fetched every 5 minutes, and articles are rotated every 10 seconds in the UI.
* Each headline is clickable, opening the full article in a new tab.
* The news section is always visible, keeping users informed while listening to music.

## Setup

Follow these steps to set up ShazamRadio on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Vanilla1002/ShazamRadio.git

cd ShazamRadio
```
### 2. Install Dependencies

Navigate to the project directory and install the necessary Node.js modules (this will also install Python libraries):

```bash
npm install
```

### 3. Backend Environment Setup & Scripts

Several new scripts have been added to `package.json` to make backend setup and running easier:

- **Standard install:**  
  Installs Node modules and Python requirements  
  ```bash
  npm run install
  ```
- **(Recommended) Virtual environment install:**  
  Sets up a Python 3.12 virtual environment, activates it, and installs requirements  
  ```bash
  npm run i-install
  ```

- **Start the backend server (default):**  
  Runs the Python FastAPI server (requires `unicorn` installed)  
  ```bash
  npm run start:api
  ```
- **Start backend with virtual environment:**  
  Activates the virtual environment and runs the server  
  ```bash
  npm run i-start:api
  ```

These scripts automate virtual environment creation and backend startup, making development and deployment smoother.  
*(Note: You may need to adjust commands for Windows or your shell.)*

### 4. Customize Stations (optional)

If you want to customize the stations, [skip to the Customizing Stations section](#customizing-stations). Otherwise, proceed to the next step to run the application.

### 5. Access the App

After starting the backend, open [localhost:8000](http://localhost:8000/) in your web browser and enjoy your personalized radio experience.

## Customizing Stations
If you wish to add your customizing Stations to the web, you need to follow these steps
1. **Run** `scripts\jsonCreator.py` and **open** [Radio Garden](https://radio.garden/)

2. **Search the station** you want in Radio garden, and make sure to **copy the name** as is written in the site.
![radio garden copy](https://github.com/user-attachments/assets/ae28760c-dc0b-419f-b9ae-06c6b767d627)![copy](https://github.com/user-attachments/assets/465a1798-a5f3-40ae-90dc-fe39dfdfb048)

4. **Paste the name** into `Radio identifier`, and in display name, write the name you want to see on the site that linking to the station

5. **Add Station image** (optional)  - add the stations images to the 'scripts\StationPngsForWeb' make sure the name of the file to be the same as the 'Radio identifier'

6. **Run** `Python scripts\imgAdder.py`

7. **Build project** by using
```shell
npm run build 
```
7. **Start The Backend Server**

## Acknowledgements

ShazamRadio uses the following third-party services and libraries:

- **Radio Garden API** - fetching radio station streams. All radio station data and streams are provided by Radio Garden API. Visit [Radio Garden](https://radio.garden) for more information.
- **Shazamio** for identifying currently playing songs.
- **FFmpeg** for processing audio streams.
- **Ynet RSS** for providing the latest news headlines.
