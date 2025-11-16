# ShazamRadio

ShazamRadio is a modern and easy-to-use web-based radio application with a sleek UI. It allows users to listen to their favorite radio stations, automatically identify currently playing songs, and easily add personal stations. ShazamRadio is built with a TypeScript frontend and a Python backend, offering a seamless and dynamic user experience.

![shazam radio main](https://github.com/user-attachments/assets/cdc9d4f9-061f-4aeb-9ce1-067e20323c0b)

<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/803ec9e6-d687-4a8d-b627-a4be7325c679" />

## Features
- **Real-Time Song Information:** Automatically identifies the currently playing song and updates the UI with the song title and a link to more information.
- **Dark/Light Mode Toggle:** Easily switch between dark and light themes for comfortable viewing in different environments.
- **Smooth Transitions:** Enjoy a seamless user experience with smooth animations and transitions between views.
- **Customizable Stations:** Easily add your personal radio stations through a simple setup process.
- **Live News Feed:** Stay updated with the latest headlines delivered straight from the Ynet news feed, automatically refreshed and cycled in the app.

## What's new (recent commits)
- Add stations from the client UI: You can now add stations directly from the running web app without rebuilding. The client-side "Add Station" form uploads images (stored as blobs) and persists station data to the browser's localStorage so the newly added station appears immediately in the UI.
- Backend API integration: The frontend uses the backend API you created to handle station creation mechanics; the client posts station data and image data to the API and keeps the local copy so it is available instantly to the user.
- Backwards compatibility: The previous script-based workflow for build-time station additions is still supported.

## How ShazamRadio Works
ShazamRadio operates by dynamically fetching radio stations, automatically identifying the currently playing song, and updating the UI in real time. Below is an overview of the main components and workflow of the application:

### Frontend (TypeScript):

* Displays radio stations, live news headlines, and song information in a sleek, interactive UI.
* Supports dark and light mode toggles for a better user experience in different environments.
* When the user selects a radio station, the app starts playing the stream and communicates with the backend to update the currently playing song.
* Shows a dedicated news area that cycles through the latest news headlines, with clickable links to full articles.
* New: provides an "Add Station" form that lets users add a station from the client. Images are uploaded/handled by the client and stored locally (as blobs/persisted data) so they show up immediately in the station list.

### Backend (Python/FastAPI):

* The backend server fetches the live stream URL and utilizes song identification logic to automatically detect the currently playing song using Shazamio and FFmpeg.
* Provides a `/news` endpoint that fetches and caches the latest news articles from the Ynet RSS feed and serves them to the frontend as JSON.
* Provides API endpoints used by the frontend to add and manage stations (see your code for exact route names). The backend works with the frontend mechanics to support instant client-side station addition.
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
  Runs the Python FastAPI server (requires `uvicorn` installed)  
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

### 4. Access the App

After starting the backend, open the app in your web browser. The backend default port is typically 8000 (http://localhost:8000) and the frontend dev server commonly runs on 8080 (http://localhost:8080/) — check your console output for exact addresses.

## Adding Custom Stations

You can add custom stations in two ways: build-time (scripts) or runtime (client-side). Both methods are supported.

### Add stations from the client (new)
This is the new, recommended way for quick, per-user additions — no rebuild required.

1. Start the backend and frontend servers.
2. Open the web app in your browser.
3. Use the "Add Station" UI form:
<img width="264" height="270" alt="image" src="https://github.com/user-attachments/assets/4aba8a72-5e4e-4a2c-a258-fdbd7738f927" /> 
<img width="290" height="400" alt="image" src="https://github.com/user-attachments/assets/1818f51b-3b36-4312-8ade-c4f2dbe66721" />


   - Enter the station identifier (as on Radio Garden).

![radio garden copy](https://github.com/user-attachments/assets/ae28760c-dc0b-419f-b9ae-06c6b767d627)!
   - Provide a display name for how it should appear in the UI.
   - Optionally upload an image for the station logo/thumbnail.
4. Submit the form. The frontend will:
   - Upload the image data and station metadata to the backend API (the mechanics implemented in the recent commits).
   - Persist a local copy in browser storage (localStorage) using blobs/persisted image data so the station is available immediately in the UI for that browser.
5. The new station will appear in your stations list without needing to rebuild the site.

Notes:
- Client-side added stations are saved per-browser (in localStorage) and are immediate for the current user. If you need station additions to be globally available to all users, use the build-time script method or add server-side persistence.
- Image data is handled as blobs on the client and persisted locally; inspect your repository code to see exact serialization/storage format if you need cross-browser persistence or server-side storage of images.

### Add stations at build time (existing scripts)
If you prefer to add stations globally (baked into the web build), use the existing scripts workflow:

1. Run `scripts/jsonCreator.py` and open [Radio Garden](https://radio.garden/).
2. Search and copy the station name exactly from Radio Garden.
3. Paste the name into `Radio identifier` in the script prompts, and set the `Display name`.
4. (Optional) Add station image files into `scripts/StationPngsForWeb` — filenames should match the `Radio identifier`.
5. Run `python scripts/imgAdder.py`.
6. Build the project:
```bash
npm run build
```
7. Start the backend server.

Both methods are supported; use the one that fits your needs.

## Acknowledgements

ShazamRadio uses the following third-party services and libraries:

- **Radio Garden API** - fetching radio station streams. All radio station data and streams are provided by Radio Garden API. Visit [Radio Garden](https://radio.garden) for more information.
- **Shazamio** for identifying currently playing songs.
- **FFmpeg** for processing audio streams.
- **Ynet RSS** for providing the latest news headlines.
