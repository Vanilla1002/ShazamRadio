import json
import os
import logging
import ffmpeg
from shazamio import Shazam

dict = {}

with open(os.path.join(os.path.dirname(__file__), r"..\src\radioStationsInfo.json"), 'r', encoding='utf-8') as file:
    data = json.load(file)
    for i in data:
        dict[i] = data[i]['link']


class InformationOfSong:
    songName : str
    singer : str
    fullName : str
    href : str

    def __init__(self, title, subtitle, full_name, href):
        self.songName = title
        self.singer = subtitle
        self.fullName = full_name
        self.href = href
    
    def __str__(self):
        return f"{self.songName} - {self.singer} - {self.fullName} - {self.href}"
    
    def __dict__(self):
        return {
            'songName': self.songName,
            'singer': self.singer,
            'fullName': self.fullName,
            'href': self.href
        }
        
    

logging.basicConfig(level=logging.INFO)

async def identify_song(audio_name: str)->InformationOfSong:
    if audio_name not in dict:
        return None
    audio_url = dict[audio_name]
    audio_file_place = fr"{audio_name}.wav"
    #to prevent errors
    if os.path.exists(audio_file_place):
        os.remove(audio_file_place)

    stream = ffmpeg.input(audio_url, t=10)
    stream.output(audio_file_place, format="wav").run()

    shazam = Shazam()
    out = await shazam.recognize(audio_file_place)
    
    if out['matches']:
        song = out.get('track', {})
        share = song.get('share', {})
        os.remove(audio_file_place)
        return InformationOfSong(
                song.get('title', 'Unknown Title'),
                song.get('subtitle', 'Unknown Subtitle'),
                share.get('subject', 'Unknown Subject'),
                share.get('href', 'Unknown Href')
            )
    
    return None



