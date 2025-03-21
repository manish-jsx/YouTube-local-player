# Local LMS Player

A Udemy-like Learning Management System (LMS) that works with your local video files.

## How to Use This Application

1. **Getting Started**
   - Open the `index.html` file in your web browser.
   - Click on "Choose Course Folder" to select a folder containing video files.
   - The application will automatically scan the folder and create a playlist from all video files.

2. **Managing Courses**
   - Click on the graduation cap icon to access the "My Courses" page.
   - View all previously loaded courses and their progress.
   - Click "Add New Course" to add more course folders.
   - Click "Continue Learning" to resume a course where you left off.

3. **Playing Videos**
   - Click on any video in the playlist to start playing.
   - Use the Previous/Next buttons to navigate between videos.
   - Videos will automatically play one after another when finished.

4. **Progress Tracking**
   - Your watch progress is automatically saved.
   - The application remembers where you left off in each video.
   - Videos are marked as completed when you've watched 90% of the content.
   - Overall course progress is displayed at the bottom of the video info section.

5. **Navigation Shortcuts**
   - Use `Ctrl + Right Arrow` to move to the next video.
   - Use `Ctrl + Left Arrow` to move to the previous video.
   - The video player also supports standard keyboard controls (spacebar for play/pause, etc.).

6. **Customizing the Layout**
   - Drag the divider between the sidebar and main content to adjust the playlist width.
   - Use the size controls above the video player to increase or decrease the video size.
   - Your layout preferences will be remembered for future sessions.

## Features

- **Course Management**: View, add, and resume multiple courses from a dedicated courses page.
- **Folder-based Course Creation**: Instantly turn any folder of videos into a structured course.
- **Automatic Playlist Generation**: Creates a playlist from all video files in the selected folder.
- **Video Progress Tracking**: Remembers your position in each video and marks completed videos.
- **Course Progress Monitoring**: Shows overall completion percentage of the course.
- **Professional Video Player**: Using Plyr.js with playback speed control, volume control, and fullscreen mode.
- **Customizable Interface**: Adjust the sidebar width and video size to your preference.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Local Storage**: All progress data is saved to your browser's local storage.
- **No Internet Required**: Works entirely offline with your local files.
- **Clean, Intuitive Interface**: Mimics popular online learning platforms for a familiar experience.
- **Keyboard Shortcuts**: Navigate quickly between videos using keyboard shortcuts.
- **Notifications**: Toast notifications for important events.

## Supported Video Formats

The application supports all video formats that your browser can play, including:
- MP4 (.mp4)
- WebM (.webm)
- Ogg (.ogg)
- QuickTime (.mov)
- Matroska (.mkv) - browser support may vary

## Technical Details

The application is built with:
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5 (for UI components)
- Font Awesome (for icons)
- Plyr.js (for professional video playback)

No server-side code is required, and all data is stored locally in your browser.

## Privacy & Data Storage

All data (including your watch history and progress) is stored only on your device using the browser's localStorage API. No data is sent to any server.
