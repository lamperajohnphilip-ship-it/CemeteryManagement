# Cemetery Management - Video Files Directory

Place your video files here (e.g. `cemetery-tour.mp4`, `mapping-guide.mp4`).

### How to connect your video to the Dashboard Slideshow:
1. Copy your video file into this folder:
   `apps/web/public/videos/your-video.mp4`
2. Open [`apps/web/components/VideoSlideshow.tsx`](file:///c:/Users/John%20philip/OneDrive/Documents/CemeteryManagement/apps/web/components/VideoSlideshow.tsx).
3. Find the `DEFAULT_SLIDES` configuration array at the top and set `videoUrl`:
   ```ts
   {
     id: 'memorial-tour',
     badge: 'MEMORIAL TOUR',
     title: 'Eternal Rest Memorial Grounds & Overview',
     subtitle: 'Municipality of Jasaan Cemetery Portal',
     description: 'A scenic walk-through showcasing the grounds...',
     videoUrl: '/videos/your-video.mp4', // <-- Put your filename here
     posterUrl: '', // Optional thumbnail image
   }
   ```
4. Save the file. The slideshow will instantly load and play your video with full controls!

