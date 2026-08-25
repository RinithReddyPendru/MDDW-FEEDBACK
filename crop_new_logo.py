from PIL import Image
import os

img_path = 'public/new_logo.png'
out_path = 'public/final_logo.png'

try:
    img = Image.open(img_path).convert("RGBA")
    
    # We want to crop to the bounding box of the white circle.
    # The background is pink. Let's find the first white-ish pixel from top, bottom, left, right.
    # A pixel is white-ish if R>240, G>240, B>240.
    
    width, height = img.size
    pixels = img.load()
    
    min_x = width
    min_y = height
    max_x = 0
    max_y = 0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r > 240 and g > 240 and b > 240:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if min_x < max_x and min_y < max_y:
        # Pad slightly to not cut edges
        pad = 2
        min_x = max(0, min_x - pad)
        min_y = max(0, min_y - pad)
        max_x = min(width, max_x + pad)
        max_y = min(height, max_y + pad)
        
        cropped = img.crop((min_x, min_y, max_x, max_y))
        cropped.save(out_path)
        print(f"Successfully cropped white circle to {out_path}")
    else:
        print("Could not find white circle.")
        
except Exception as e:
    print(f"Error: {e}")
