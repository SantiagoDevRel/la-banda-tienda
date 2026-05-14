#!/usr/bin/env bash
# Tienda Los del Sur — background video pipeline
# Cuts the 3 DJI source clips into short pieces, applies a gentle slow-motion,
# downscales to 1080p H.264 for web, and extracts a poster (first frame) per clip.
set -u
cd "$(dirname "$0")/.." || exit 1

SRC="_source-videos"
OUT="public/video"
mkdir -p "$OUT"

# file | start(s) | duration(s) | output-name
clips=(
  "DJI_20260512193153_0539_D.MP4|10|6|bg-1"
  "DJI_20260512193153_0539_D.MP4|45|6|bg-2"
  "DJI_20260512193153_0539_D.MP4|82|6|bg-3"
  "DJI_20260512194635_0542_D.MP4|5|6|bg-4"
  "DJI_20260512194635_0542_D.MP4|24|6|bg-5"
  "DJI_20260512194635_0542_D.MP4|42|6|bg-6"
  "DJI_20260512194830_0543_D.MP4|12|6|bg-7"
  "DJI_20260512194830_0543_D.MP4|50|6|bg-8"
  "DJI_20260512194830_0543_D.MP4|86|6|bg-9"
)

i=0
for c in "${clips[@]}"; do
  i=$((i+1))
  IFS='|' read -r file start dur name <<< "$c"
  echo "[$i/${#clips[@]}] $name  <-  $file @ ${start}s (+${dur}s, slow-mo 0.67x)"
  # -ss/-t before -i = trim the SOURCE; setpts=1.5*PTS slows to ~0.67x => ~9s clip
  ffmpeg -hide_banner -loglevel error -y -ss "$start" -t "$dur" -i "$SRC/$file" -an \
    -vf "scale=1920:1080:flags=lanczos,setpts=1.5*PTS,fps=30" \
    -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$name.mp4" || { echo "  ! failed clip $name"; continue; }
  # poster = first frame of the generated clip (static fallback for slow connections)
  ffmpeg -hide_banner -loglevel error -y -i "$OUT/$name.mp4" -frames:v 1 -q:v 4 "$OUT/$name.jpg" \
    || echo "  ! failed poster $name"
  sz=$(du -h "$OUT/$name.mp4" 2>/dev/null | cut -f1)
  echo "  -> $OUT/$name.mp4 ($sz) + $name.jpg"
done

echo "DONE. Generated clips + posters in $OUT"
ls -la "$OUT"
