import os
import json
from PIL import Image

PROJECTS_DIR = r"w:\Portpholio\Shourov-paul.github.io\public\images\projects"
JSON_DIR = r"w:\Portpholio\Shourov-paul.github.io\content\projects"

def optimize_images():
    print("Starting image optimization...")
    image_mappings = {}  # Map old relative path to new relative path
    total_saved = 0

    for root, dirs, files in os.walk(PROJECTS_DIR):
        for file in files:
            lower_file = file.lower()
            if lower_file.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Skip already generated thumb files or webp files that we created in previous runs if we rerun
                if "_thumb.webp" in file:
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, start=r"w:\Portpholio\Shourov-paul.github.io\public").replace('\\', '/')
                
                # Check original size
                orig_size = os.path.getsize(full_path)
                
                # Setup destination paths
                base_name, ext = os.path.splitext(file)
                
                # If we are analyzing a webp file that was already created, let's skip it unless the original PNG/JPG is missing
                # In our case, original PNG/JPG is restored, so if file is webp, check if the corresponding PNG/JPG exists.
                # If yes, we skip this webp file to avoid optimizing the optimized file itself.
                if ext.lower() == '.webp':
                    png_exists = os.path.exists(os.path.join(root, base_name + ".png"))
                    jpg_exists = os.path.exists(os.path.join(root, base_name + ".jpg"))
                    jpeg_exists = os.path.exists(os.path.join(root, base_name + ".jpeg"))
                    if png_exists or jpg_exists or jpeg_exists:
                        continue
                
                webp_name = base_name + ".webp"
                webp_path = os.path.join(root, webp_name)
                
                try:
                    with Image.open(full_path) as img:
                        is_cover = "cover" in file.lower()
                        
                        # 1. Convert to full-size WebP.
                        # For non-cover detail images, resize them to max 1000px width.
                        width, height = img.size
                        max_full_width = 1000
                        if not is_cover and width > max_full_width:
                            new_height = int(height * (max_full_width / width))
                            full_img = img.resize((max_full_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resized detail image: {file} ({width}px -> {max_full_width}px width)")
                        else:
                            full_img = img
                            
                        # Save with optimized quality
                        full_img.save(webp_path, "WEBP", quality=82)
                        new_size = os.path.getsize(webp_path)
                        saved = orig_size - new_size
                        if saved > 0:
                            total_saved += saved
                        print(f"Optimized: {file} -> {webp_name} ({orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB, saved {saved/1024:.1f}KB)")
                        
                        new_rel_path = os.path.relpath(webp_path, start=r"w:\Portpholio\Shourov-paul.github.io\public").replace('\\', '/')
                        image_mappings["/" + rel_path] = "/" + new_rel_path
                        
                        # 2. If it is a cover image, generate a thumbnail (max-width 350px)
                        if is_cover:
                            thumb_name = base_name + "_thumb.webp"
                            thumb_path = os.path.join(root, thumb_name)
                            
                            max_width = 350
                            if width > max_width:
                                new_height = int(height * (max_width / width))
                                thumb_img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                            else:
                                thumb_img = img
                                
                            thumb_img.save(thumb_path, "WEBP", quality=80)
                            thumb_size = os.path.getsize(thumb_path)
                            print(f"Generated thumbnail: {thumb_name} ({thumb_size/1024:.1f}KB)")
                            
                            thumb_rel_path = os.path.relpath(thumb_path, start=r"w:\Portpholio\Shourov-paul.github.io\public").replace('\\', '/')
                            image_mappings["/" + rel_path + "_thumb"] = "/" + thumb_rel_path

                    # Remove the original file if it was a PNG or JPG to save space
                    if lower_file.endswith(('.png', '.jpg', '.jpeg')) and webp_path != full_path:
                        os.remove(full_path)
                        print(f"Deleted original: {file}")
                except Exception as e:
                    print(f"Failed to process {file}: {e}")

    print(f"\nImage optimization complete. Total space saved: {total_saved/1024/1024:.2f} MB")
    return image_mappings

def update_json_files(mappings):
    print("\nUpdating JSON project files with new image paths...")
    for file in os.listdir(JSON_DIR):
        if file.endswith('.json') and file != 'pinned.json':
            json_path = os.path.join(JSON_DIR, file)
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Update main cover image to the thumbnail version
                old_cover = data.get("cover")
                if old_cover:
                    # Look up if there's a thumbnail mapping
                    thumb_key = old_cover + "_thumb"
                    if thumb_key in mappings:
                        data["cover"] = mappings[thumb_key]
                        print(f"Updated {file} cover: {old_cover} -> {data['cover']}")
                    elif old_cover in mappings:
                        # Fallback to full-size webp if no thumbnail
                        data["cover"] = mappings[old_cover]
                        print(f"Updated {file} cover (no thumb): {old_cover} -> {data['cover']}")

                # Update other images in detailSections to optimized full-size webp
                if "detailSections" in data:
                    for section in data["detailSections"]:
                        # If section has "image"
                        old_img = section.get("image")
                        if old_img and old_img in mappings:
                            section["image"] = mappings[old_img]
                            print(f"Updated {file} detail section image: {old_img} -> {section['image']}")
                        
                        # Also scan "content" for inline img html tags
                        content = section.get("content")
                        if content and isinstance(content, str):
                            # Replace any occurrences of old image paths in HTML
                            for old_path, new_path in mappings.items():
                                if not old_path.endswith('_thumb') and old_path in content:
                                    content = content.replace(old_path, new_path)
                                    print(f"Updated inline HTML image in {file}: {old_path} -> {new_path}")
                            section["content"] = content

                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
            except Exception as e:
                print(f"Failed to update JSON {file}: {e}")

if __name__ == "__main__":
    mappings = optimize_images()
    update_json_files(mappings)
    print("\nAll done!")
