
import os
import time

from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from songIdentify import identify_song 
import uvicorn
from fastapi import FastAPI, Request 
import sys

sys.stdout.reconfigure(encoding='utf-8')

def songInfo(radio_name):
    result = identify_song(radio_name)
    return result

app = FastAPI()

# Mount - upload the files to the base web
app.mount("/assets", StaticFiles(directory=os.path.join('..', 'assets')), name="assets")
app.mount('/static', StaticFiles(directory=os.path.join('..', 'dist')), name='static')
# Serve the index.html file directly
@app.get("/radio")
async def serve_index():
    file_path = r"..\dist\index.html"
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return {"message": "Index file not found"}


cache = {} # key : radio_name, value: {InformationOfSong, time.time()} informationofdaughter
last_run_time = None





@app.post("/identify_song")
async def identify_song_endpoint(request: Request):
    data = await request.json()  
    radio_name = data.get("radio_name")
    if radio_name not in cache or (time.time() - cache[radio_name]['time'] > 10):
        result = await songInfo(radio_name)
        cache[radio_name] = {'InformationOfSong': result, 'time': time.time()}
    return what_to_send(cache[radio_name]['InformationOfSong'])


def what_to_send(result):
    if result is not None:
        return result.__dict__()
    return None



# catch-all route for other paths and return to /
@app.get("/{path_name:path}")
async def catch_all(path_name: str):
    return RedirectResponse(url="/radio")

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)


