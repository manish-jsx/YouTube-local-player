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

### Current Features

- **Offline Access**: Watch all your courses without an internet connection
- **Easy Import**: Import entire course folders with one click
- **Advanced Video Player**: Features include:
  - Variable speed control (0.5x to 2x)
  - Smart bookmarking with notes
  - Auto-resume from where you left off
- **Progress Tracking**: Never lose your place with automatic progress saving
- **Clean Organization**: Automatically organize content by course, section, and lecture
- **Modern UI**: Sleek, user-friendly interface designed to enhance learning
- **Smart Note-Taking**: Create timestamped notes while watching videos
- **Dark/Light Mode**: Toggle between themes based on your preference

### Key Components

1. **Course Library**: Browse all your imported courses in one place
2. **Video Player**: Enhanced playback with learning-focused features
3. **Progress Dashboard**: Track your learning journey with visual metrics
4. **Content Index**: Easily navigate through course sections and lectures
5. **Notes System**: Take and organize notes synchronized with video timestamps

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge recommended)
- Local video files organized in folders

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/local-lms-player.git
   ```

2. Open `index.html` in your web browser

3. Click "Get Started" to begin adding courses

### Adding Your First Course

1. From the Courses page, click "Add New Course"
2. Select a folder containing your course videos
3. The app will automatically organize and import your content
4. Click on the course to start learning!

## Usage Tips

- **Keyboard Shortcuts**:
  - Space: Play/Pause
  - Left/Right Arrows: Skip backward/forward
  - M: Mute/Unmute
  - F: Toggle fullscreen
  
- **Organizing Courses**:
  - For best results, keep videos in folders named after the course
  - The app will recognize common naming patterns like "01-Introduction.mp4"

- **Taking Notes**:
  - Press "B" while watching to add a bookmark at the current timestamp
  - Add notes to your bookmarks for easy reference later

## Technical Details

The Local LMS Player is built with:

- HTML5, CSS3, and JavaScript (ES6+)
- Bootstrap 5 for responsive design
- GSAP for smooth animations
- LocalStorage for data persistence

## Roadmap

### Planned Features

- **Cloud Sync** - Sync your progress across devices
- **Export/Import** - Share courses and progress with others
- **Enhanced Analytics** - More detailed learning metrics
- **Custom Themes** - Additional theme options beyond dark/light mode
- **Mobile App** - Native applications for iOS and Android

### Future Integrations

- **Google Drive Integration** - Access and play courses directly from Google Drive
- **AWS S3 Storage** - Store and stream your courses from AWS S3 buckets
- **GCP Storage** - Google Cloud Platform storage integration
- **Azure Blob Storage** - Microsoft Azure storage support
- **Dropbox Integration** - Access courses from your Dropbox account
- **OneDrive Support** - Integration with Microsoft OneDrive

## TODO

- [ ] Implement cloud sync functionality
- [ ] Add export/import feature for courses and progress
- [ ] Create mobile app versions
- [ ] Develop Google Drive integration
- [ ] Build AWS S3 storage connector
- [ ] Add GCP storage support
- [ ] Implement Azure Blob Storage integration
- [ ] Add support for subtitles/captions
- [ ] Implement advanced search across all courses
- [ ] Create collaborative features for shared learning
- [ ] Add offline quiz/assessment capabilities
- [ ] Implement machine learning for smart recommendations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools that made this possible

## Contact

For questions, feature requests, or support, please open an issue on GitHub or contact us at support@locallmsplayer.com.

---

Made with ❤️ for learners everywhere
