
import json
import os

from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from songIdentify import identify_song 
import uvicorn
from fastapi import FastAPI , WebSocket
import sys

sys.stdout.reconfigure(encoding='utf-8')

def songInfo(radio_name):
    result = identify_song(radio_name)
    return result

app = FastAPI()

# Mount - upload the files to the base web


app.mount("/static", StaticFiles(directory="C:/Users/user/Projects/VisualStudioProjects/Radio-web/dist"), name="static")

app.mount("/assets", StaticFiles(directory="C:/Users/user/Projects/VisualStudioProjects/Radio-web/assets"), name="assets")

# Serve the index.html file directly
@app.get("/")
async def serve_index():
    file_path = "C:/Users/user/Projects/VisualStudioProjects/Radio-web/dist/index.html"
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return {"message": "Index file not found"}


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):


    await websocket.accept()
    while True:
        
        data = await websocket.receive_text()
        result = await songInfo(data)
        if result != None:
            await websocket.send_text(json.dumps(result.__dict__(), ensure_ascii=False))
        

# catch-all route for other paths and return to /
@app.get("/{path_name:path}")
async def catch_all(path_name: str):
    return RedirectResponse(url="/")



# result = asyncio.run(songInfo('eco99FM'))
# print(result.songName)
# helper = {}

# result = asyncio.run(songInfo('eco99FM'))
# print(str(result))
# print(result.songName)
# print(result.singer)
# print(result.fullName)
# print(result.href)