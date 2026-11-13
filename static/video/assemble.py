import os, subprocess

ffmpeg = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\node_modules\ffmpeg-static\ffmpeg.exe'
src = r'C:\Users\anshm\Downloads\New folder (4)\Video Project 8.mp4'
temp_dir = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\video\process_temp'
frames_dir = os.path.join(temp_dir, 'frames')

intro_mp4 = os.path.join(temp_dir, 'intro_part.mp4')
rest_mp4 = os.path.join(temp_dir, 'rest_part.mp4')
concat_list = os.path.join(temp_dir, 'concat.txt')
final_video = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\video\love-loop.mp4'

# 1. Encode intro from frames at 30fps
print('Encoding intro part...')
cmd1 = [
    ffmpeg, '-r', '30', '-i', os.path.join(frames_dir, 'frame_%04d.png'),
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-preset', 'medium', intro_mp4, '-y'
]
subprocess.run(cmd1, check=True)

# 2. Extract rest part from 7.8s to end
print('Encoding rest part...')
cmd2 = [
    ffmpeg, '-ss', '00:00:07.800', '-i', src,
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-preset', 'medium', '-an', rest_mp4, '-y'
]
subprocess.run(cmd2, check=True)

# 3. Write concat file
with open(concat_list, 'w', encoding='utf-8') as f:
    p1 = intro_mp4.replace('\\', '/')
    p2 = rest_mp4.replace('\\', '/')
    f.write(f"file '{p1}'\nfile '{p2}'\n")

# 4. Concat video streams
print('Concatenating video parts...')
temp_joined = os.path.join(temp_dir, 'joined.mp4')
cmd3 = [
    ffmpeg, '-f', 'concat', '-safe', '0', '-i', concat_list,
    '-c', 'copy', temp_joined, '-y'
]
subprocess.run(cmd3, check=True)

# 5. Mux with original audio and faststart (both in mp4 and extracted mp3)
print('Muxing with audio and faststart...')
cmd4 = [
    ffmpeg, '-i', temp_joined, '-i', src,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', final_video, '-y'
]
subprocess.run(cmd4, check=True)

# Also update love-bgm.mp3 to ensure it matches 100%
audio_out = r'C:\Users\anshm\Downloads\hbd-kizu-master (1)\hbd-kizu-master\static\audio\love-bgm.mp3'
cmd5 = [
    ffmpeg, '-i', src, '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', audio_out, '-y'
]
subprocess.run(cmd5, check=True)

print('SUCCESS: final video and audio generated!')
