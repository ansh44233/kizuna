import os, subprocess, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ffmpeg = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\node_modules\ffmpeg-static\ffmpeg.exe'
src = r'C:\Users\anshm\Downloads\New folder (4)\Video Project 8.mp4'
work_dir = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\video\process_all'
if os.path.exists(work_dir):
    shutil.rmtree(work_dir)
os.makedirs(work_dir, exist_ok=True)

dir_a = os.path.join(work_dir, 'seg_a')
dir_c = os.path.join(work_dir, 'seg_c')
os.makedirs(dir_a, exist_ok=True)
os.makedirs(dir_c, exist_ok=True)

font_path = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\fonts\DancingScript.ttf'
font_main = ImageFont.truetype(font_path, 150)
font_large = ImageFont.truetype(font_path, 165)

# ==========================================
# 1. EXTRACT & PROCESS SEGMENT A (0.0s to 10.5s)
# ==========================================
print('Extracting Segment A (0 to 10.5s)...')
cmd_a = [ffmpeg, '-ss', '00:00:00.000', '-to', '00:00:10.500', '-i', src, '-r', '30', os.path.join(dir_a, 'frame_%04d.png'), '-y']
subprocess.run(cmd_a, check=True)

frames_a = sorted([f for f in os.listdir(dir_a) if f.endswith('.png')])
print(f'Segment A frames: {len(frames_a)}')

for idx, f_name in enumerate(frames_a):
    t = idx / 30.0
    f_path = os.path.join(dir_a, f_name)
    im = Image.open(f_path)
    w, h = im.size

    # Clean patch over text area (x: 400..2120, y: 380..720)
    top_strip = np.array(im.crop((400, 360, 2120, 370))).mean(axis=0)
    bot_strip = np.array(im.crop((400, 730, 2120, 740))).mean(axis=0)
    patch_h = 720 - 380
    patch = np.zeros((patch_h, 1720, 3), dtype=np.uint8)
    for i in range(patch_h):
        alpha = i / float(patch_h)
        patch[i, :, :] = ((1 - alpha) * top_strip + alpha * bot_strip).astype(np.uint8)
    patch_img = Image.fromarray(patch).filter(ImageFilter.GaussianBlur(15))

    mask = Image.new('L', (1720, patch_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle((30, 30, 1690, patch_h - 30), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(25))

    im_clean = im.copy()
    im_clean.paste(patch_img, (400, 380), mask)

    cur_text = None
    cur_font = font_main
    cur_opacity = 0.0

    # 1. My name is Jimjam (0.0 to 3.2s)
    if t < 3.2:
        cur_text = 'My name is Jimjam'
        if t < 0.7: cur_opacity = t / 0.7
        elif t < 2.5: cur_opacity = 1.0
        else: cur_opacity = max(0.0, (3.2 - t) / 0.7)

    # 2. And you? (3.2 to 4.9s)
    elif 3.2 <= t < 4.9:
        cur_text = 'And you?'
        rel = t - 3.2
        if rel < 0.4: cur_opacity = rel / 0.4
        elif rel < 1.3: cur_opacity = 1.0
        else: cur_opacity = max(0.0, (1.7 - rel) / 0.4)

    # 3. Aryaveer (4.9 to 6.6s)
    elif 4.9 <= t < 6.6:
        cur_text = 'Aryaveer'
        cur_font = font_large
        rel = t - 4.9
        if rel < 0.4: cur_opacity = rel / 0.4
        elif rel < 1.3: cur_opacity = 1.0
        else: cur_opacity = max(0.0, (1.7 - rel) / 0.4)

    # 4. Aryaveer? (6.6 to 8.2s)
    elif 6.6 <= t < 8.2:
        cur_text = 'Aryaveer?'
        cur_font = font_large
        rel = t - 6.6
        if rel < 0.4: cur_opacity = rel / 0.4
        elif rel < 1.2: cur_opacity = 1.0
        else: cur_opacity = max(0.0, (1.6 - rel) / 0.4)

    # 5. Aryaveer-Kun! (8.2 to 10.4s)
    elif 8.2 <= t < 10.4:
        cur_text = 'Aryaveer-Kun!'
        cur_font = font_large
        rel = t - 8.2
        if rel < 0.4: cur_opacity = rel / 0.4
        elif rel < 1.6: cur_opacity = 1.0
        else: cur_opacity = max(0.0, (2.2 - rel) / 0.6)

    if cur_text and cur_opacity > 0.01:
        bbox = cur_font.getbbox(cur_text)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        tx = (w - tw) // 2
        ty = (h - th) // 2 - 20

        glow_alpha = int(255 * cur_opacity)
        text_alpha = int(255 * cur_opacity)

        glow_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        glow_draw.text((tx, ty), cur_text, font=cur_font, fill=(70, 140, 255, glow_alpha))
        g1 = glow_layer.filter(ImageFilter.GaussianBlur(18))
        g2 = glow_layer.filter(ImageFilter.GaussianBlur(8))

        im_rgba = im_clean.convert('RGBA')
        im_rgba = Image.alpha_composite(im_rgba, g1)
        im_rgba = Image.alpha_composite(im_rgba, g2)

        txt_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        txt_draw = ImageDraw.Draw(txt_layer)
        txt_draw.text((tx, ty), cur_text, font=cur_font, fill=(255, 255, 255, text_alpha))

        im_final = Image.alpha_composite(im_rgba, txt_layer).convert('RGB')
    else:
        im_final = im_clean

    im_final.save(f_path)

print('Segment A processed!')

# ==========================================
# 2. EXTRACT & PROCESS SEGMENT C (27.5s to 30.53s)
# ==========================================
print('Extracting Segment C (27.5s to end)...')
cmd_c = [ffmpeg, '-ss', '00:00:27.500', '-i', src, '-r', '30', os.path.join(dir_c, 'frame_%04d.png'), '-y']
subprocess.run(cmd_c, check=True)

frames_c = sorted([f for f in os.listdir(dir_c) if f.endswith('.png')])
print(f'Segment C frames: {len(frames_c)}')

for idx, f_name in enumerate(frames_c):
    t_c = idx / 30.0 # 0 to ~3.0s (which is 27.5 to 30.5s in overall video)
    f_path = os.path.join(dir_c, f_name)
    im = Image.open(f_path)
    w, h = im.size

    # Clean patch over text area (x: 400..2120, y: 380..720)
    top_strip = np.array(im.crop((400, 350, 2120, 360))).mean(axis=0)
    bot_strip = np.array(im.crop((400, 740, 2120, 750))).mean(axis=0)
    patch_h = 720 - 380
    patch = np.zeros((patch_h, 1720, 3), dtype=np.uint8)
    for i in range(patch_h):
        alpha = i / float(patch_h)
        patch[i, :, :] = ((1 - alpha) * top_strip + alpha * bot_strip).astype(np.uint8)
    patch_img = Image.fromarray(patch).filter(ImageFilter.GaussianBlur(15))

    mask = Image.new('L', (1720, patch_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle((30, 30, 1690, patch_h - 30), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(25))

    im_clean = im.copy()
    im_clean.paste(patch_img, (400, 380), mask)

    # 'I Love you, Aryaveer' with romantic red glow
    # Appears from t_c ~0.8s to end
    cur_text = 'I Love you, Aryaveer'
    cur_font = font_main
    cur_opacity = 0.0

    if t_c >= 0.6:
        rel = t_c - 0.6
        if rel < 0.6:
            cur_opacity = rel / 0.6
        else:
            cur_opacity = 1.0

    if cur_opacity > 0.01:
        bbox = cur_font.getbbox(cur_text)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        tx = (w - tw) // 2
        ty = (h - th) // 2 - 20

        glow_alpha = int(255 * cur_opacity)
        text_alpha = int(255 * cur_opacity)

        glow_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        glow_draw.text((tx, ty), cur_text, font=cur_font, fill=(255, 40, 70, glow_alpha))
        g1 = glow_layer.filter(ImageFilter.GaussianBlur(18))
        g2 = glow_layer.filter(ImageFilter.GaussianBlur(8))

        im_rgba = im_clean.convert('RGBA')
        im_rgba = Image.alpha_composite(im_rgba, g1)
        im_rgba = Image.alpha_composite(im_rgba, g2)

        txt_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        txt_draw = ImageDraw.Draw(txt_layer)
        txt_draw.text((tx, ty), cur_text, font=cur_font, fill=(255, 255, 255, text_alpha))

        im_final = Image.alpha_composite(im_rgba, txt_layer).convert('RGB')
    else:
        im_final = im_clean

    im_final.save(f_path)

print('Segment C processed!')

# ==========================================
# 3. ENCODE & CONCAT ALL SEGMENTS
# ==========================================
video_a = os.path.join(work_dir, 'part_a.mp4')
video_b = os.path.join(work_dir, 'part_b.mp4')
video_c = os.path.join(work_dir, 'part_c.mp4')

# Encode A
print('Encoding Part A...')
subprocess.run([
    ffmpeg, '-r', '30', '-i', os.path.join(dir_a, 'frame_%04d.png'),
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-preset', 'medium', video_a, '-y'
], check=True)

# Encode B (10.5s to 27.5s)
print('Extracting Part B (10.5s to 27.5s)...')
subprocess.run([
    ffmpeg, '-ss', '00:00:10.500', '-to', '00:00:27.500', '-i', src,
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-preset', 'medium', '-an', video_b, '-y'
], check=True)

# Encode C
print('Encoding Part C...')
subprocess.run([
    ffmpeg, '-r', '30', '-i', os.path.join(dir_c, 'frame_%04d.png'),
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-preset', 'medium', video_c, '-y'
], check=True)

# Concat list
concat_file = os.path.join(work_dir, 'concat.txt')
with open(concat_file, 'w', encoding='utf-8') as f:
    f.write(f"file '{video_a.replace(chr(92), '/')}'\n")
    f.write(f"file '{video_b.replace(chr(92), '/')}'\n")
    f.write(f"file '{video_c.replace(chr(92), '/')}'\n")

# Joined video
joined_video = os.path.join(work_dir, 'joined.mp4')
print('Joining parts...')
subprocess.run([
    ffmpeg, '-f', 'concat', '-safe', '0', '-i', concat_file,
    '-c', 'copy', joined_video, '-y'
], check=True)

# Final mux with audio and faststart
final_video = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\video\love-loop.mp4'
print('Muxing final video with audio and faststart...')
subprocess.run([
    ffmpeg, '-i', joined_video, '-i', src,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', final_video, '-y'
], check=True)

print('COMPLETED: All occurrences of Reze, Denji, Denji?, Denji-kun, and I love you Denji replaced with Jimjam & Aryaveer!')
