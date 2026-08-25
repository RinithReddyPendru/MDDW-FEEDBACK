from PIL import Image
import os

img_path = 'public/bg.png'
out_path = 'public/logo.png'

try:
    img = Image.open(img_path)
    width, height = img.size
    
    # The logo is a circle in the center. Let's find its bounding box.
    # We will just take the center square.
    # Assuming logo is in the exact center and its size is about 50-60% of height.
    # Let's crop a square from the center.
    
    # The user wants just the logo. The logo seems to be a white circle with some art in it.
    # Let's crop a box in the center of the image.
    box_size = int(height * 0.75) # Guessing the logo takes 75% of height
    
    left = (width - box_size) / 2
    top = (height - box_size) / 2
    right = (width + box_size) / 2
    bottom = (height + box_size) / 2
    
    cropped = img.crop((left, top, right, bottom))
    cropped.save(out_path)
    print(f"Successfully cropped to {out_path}")
except Exception as e:
    print(f"Error: {e}")
