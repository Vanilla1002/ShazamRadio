#run this script after you added all of the station images in 'scripts\StationPngsForWeb'
#make sure you named the images with the station name like in the JSON file

from PIL import Image
import os


script_dir = os.path.dirname(os.path.abspath(__file__))
print(script_dir)
source_root = os.path.join(script_dir, 'StationPngsForWeb')
output_root = os.path.join(script_dir, '.', '..', 'assets', '_images', 'StationsPng')
print(output_root)

new_size = (420, 400)
def create_images():
    for image in os.listdir(source_root):
        new_image_name = os.path.splitext(image)[0] + '.png'
        new_image_path = os.path.join(output_root, new_image_name)
        
        new_image = Image.open(os.path.join(source_root, image))

        if new_image.mode in ('RGBA', 'LA') or (new_image.mode == 'P' and 'transparency' in new_image.info):
            background = Image.new('RGBA', new_image.size, (255, 255, 255, 255))
            background.paste(new_image, (0, 0), new_image)
            new_image = background.convert('RGB')  
        else:
            new_image = new_image.convert('RGB')

        resized_image = new_image.resize(new_size)

        resized_image.save(new_image_path, format='PNG', optimize=True, quality=50)

if __name__ == '__main__':
    entry = input('Do you want to delete the old images? (y/n)').strip().lower()
    while entry not in {'y', 'n'}:
        print('Invalid entry. Please try again.')
        entry = input('Do you want to delete the old images? (y/n)').strip().lower()

    if entry == 'y':
        for image in os.listdir(output_root):
            if image.startswith('default'):
                continue
            os.remove(os.path.join(output_root, image))
        print('all images deleted')
    create_images()
    print('finished')

