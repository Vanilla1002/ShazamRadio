# ShazamRadio

ShazamRadio is a modern and easy-to-use web-based radio application with a sleek UI. It allows users to listen to their favorite radio stations, automatically identify currently playing songs, and easily add personal stations. ShazamRadio is built with a TypeScript frontend and a Python backend, offering a seamless and dynamic user experience.

![shazam radio main](https://github.com/user-attachments/assets/53f89650-9cc4-4a94-92e7-9e31040f64d2)



## Features
- **Real-Time Song Information:** Automatically identifies the currently playing song and updates the UI with the song title and a link to more information.
- **Dark/Light Mode Toggle:** Easily switch between dark and light themes for comfortable viewing in different environments.
- **Smooth Transitions:** Enjoy a seamless user experience with smooth animations and transitions between views.
- **Customizable Stations**: Easily add your personal radio stations through a simple setup process.



## How ShazamRadio Works
ShazamRadio operates by dynamically fetching radio stations, automatically identifying the currently playing song, and updating the UI in real time. Below is an overview of the main components and workflow of the application:

### Frontend (TypeScript):

* Displays radio stations and song information in a sleek, interactive UI.
* Supports dark and light mode toggles for a better user experience in different    environments.
* When the user selects a radio station, the app starts playing the stream and communicates with the backend to update the currently playing song.

### Backend (Python/FastAPI):

* The backend server fetches the live stream URL and utilizes song identification logic to automatically detect the currently playing song using Shazamio and FFmpeg.
* Updates the UI with the song title and relevant information in real time.

### Customizable Stations(Python scripts):
* By using Radio-Garden API, users can add their own radio stations to ShazamRadio  By entering the exact station name from Radio Garden into the provided Python script, the script retrieves the station's ID and get a link that redirecting to the direct streaming link
* Additionally, users can add custom station images by placing the images in a designated folder and naming them the same as the station name. Running the imgAdder.py script will process and resize the images for use in the application.
* If no custom image is provided, a default station image will be automatically used, allowing users to skip this step if they don't want to add images.


## Setup
Follow these steps to set up ShazamRadio on your local machine:
1. **Clone the Repository**
```bash
git clone https://github.com/Vanilla1002/Radio-web.git
```
2. **Install Dependencies:** Navigate to the project directory and install the necessary Node.js modules:

```bash
npm install
```
3. **Customize Stations (optional):** If you want to customize the stations, [skip to the Customizing Stations section](#customizing-stations) Otherwise, proceed to the next step to run the application.


4. **Start the Backend Server:** Navigate to the backend directory and start the server:
```bash
cd backend
python -m uvicorn server:app --reload
```
Now, you can access ShazamRadio in your web browser and enjoy your personalized radio experience.
## Customizing Stations
If you wish to add your customizing Stations to the web, you need to follow these steps
1. **Run** `scripts\jsonCreator.py` and **open** [Radio Garden](https://radio.garden/)

2. **Search the station** you want in Radio garden, and make sure to **copy the name** as is written in the site.
![radio garden copy](https://github.com/user-attachments/assets/ae28760c-dc0b-419f-b9ae-06c6b767d627)![copy](https://github.com/user-attachments/assets/465a1798-a5f3-40ae-90dc-fe39dfdfb048)


4. **Paste the name** into `Radio identifier`, and in display name, write the name you want to see on the site that linking to the station

5. **add Station image** (optional)  - add the stations images to the 'scripts\StationPngsForWeb' make sure the name of the file to be the same as the 'Radio identifier'

6. **run** `Python scripts\imgAdder.py`

7. **build project** by using
```shell
npm run build 
```
7. **Start The Backend Server**



## Acknowledgements

 ShazamRadio uses the following third-party services and libraries:

- **Radio Garden API**  fetching radio station streams. All radio station data and streams are provided by Radio Garden API. Visit [Radio Garden](https://radio.garden) for more information.
- **Shazamio** for identifying currently playing songs.
- **FFmpeg** for processing audio streams.
