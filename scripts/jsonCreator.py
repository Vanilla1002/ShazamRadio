import json
import requests

output_root = './src/radioStationsInfo.json'
class RadioStation:
    def __init__(self, identifier, display_name, id, link):
        self.identifier = identifier
        self.display_name = display_name
        self.id = id
        self.link = link

    def __dict__(self):
        return {
            self.identifier : {
                'displayName': self.display_name,
                'link': self.link
            }
        }




def get_id(radio_identifier):
    
    response = requests.get(f'https://radio.garden/api/search?q={radio_identifier}')

    if response.status_code != 200:
        return None
    
    data = response.json()

    if data['hits']['hits']:
        
        url = data['hits']['hits'][0]['_source']['url']
        return url.split('/')[-1]
    
    return None
    
def get_station() :
    radio_identifier = input('Enter the radio identifier: ').strip().lower()
    radio_display_name = input('Enter the radio display name: ')
    radio_id = get_id(radio_identifier)
    if radio_id is None:
        print('Invalid entry. Please try again.')
        return
    radio_link = f'https://radio.garden/api/ara/content/listen/{radio_id}/channel.mp3'
    new_station = RadioStation(radio_identifier, radio_display_name, radio_id, radio_link)
    return new_station.__dict__()



def create_dict() -> dict:
    dict = {}
    keep_going = True
    while keep_going:
        new_station = get_station()
        if new_station is None:
            print('Invalid station. Please try again.')
            continue
        dict.update(new_station)

        while True:
            another = input('do you want to add another radio? (y/n)').strip().lower()
            if another == 'y':
                break
            if another == 'n':
                keep_going = False
                break
            print('Invalid entry. Please try again.')
    return dict


if __name__ == '__main__':
    entry = input('do you wish to delete the last JSON? (y/n)').strip().lower()
    while entry not in {'y', 'n'}:
        print('Invalid entry. Please try again.')
        entry = input('Do you wish to delete the last JSON? (y/n): ').strip().lower()
    if entry == 'y':
        with open(output_root, 'w') as file:
            json.dump(create_dict(), file, indent=4)
    if entry == 'n':
        with open(output_root, 'r+', encoding='utf-8') as file:
            data = json.load(file)
            data.update(create_dict())
            file.seek(0)
            json.dump(data, file, indent=4, ensure_ascii=False)
            file.truncate()

