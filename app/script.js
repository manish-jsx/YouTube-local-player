document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const folderSelector = document.getElementById('folder-selector');
    const folderInput = document.getElementById('folder-input');
    const videoPlaylist = document.getElementById('video-playlist');
    const videoPlayer = document.getElementById('video-player');
    const noVideoMessage = document.getElementById('no-video-message');
    const currentVideoTitle = document.getElementById('current-video-title');
    const currentVideoDescription = document.getElementById('current-video-description');
    const currentVideoDuration = document.getElementById('current-video-duration');
    const courseTitle = document.getElementById('course-title');
    const videoCount = document.getElementById('video-count');
    const prevVideoBtn = document.getElementById('prev-video');
    const nextVideoBtn = document.getElementById('next-video');
    const courseProgress = document.getElementById('course-progress');
    const progressPercentage = document.getElementById('progress-percentage');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    // Initialize Bootstrap toast
    const toastInstance = new bootstrap.Toast(toast);

    // Initialize Plyr player with better settings
    const player = new Plyr(videoPlayer, {
        controls: [
            'play-large', 'play', 'progress', 'current-time', 'mute',
            'volume', 'settings', 'pip', 'airplay', 'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true },
        blankVideo: 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAFttZGF0AAAAMmWIhD///8PAnFAAFPf39/3331/t/+ln3v3//e/t///93fbt///9/t3///+37///u3v//Txl',
        quality: {
            default: 576,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        i18n: {
            restart: 'Restart',
            rewind: 'Rewind {seektime}s',
            play: 'Play',
            pause: 'Pause',
            fastForward: 'Forward {seektime}s',
            seek: 'Seek',
            seekLabel: '{currentTime} of {duration}',
            played: 'Played',
            buffered: 'Buffered',
            currentTime: 'Current time',
            duration: 'Duration',
            volume: 'Volume',
            mute: 'Mute',
            unmute: 'Unmute',
            enableCaptions: 'Enable captions',
            disableCaptions: 'Disable captions',
            download: 'Download',
            enterFullscreen: 'Enter fullscreen',
            exitFullscreen: 'Exit fullscreen',
            frameTitle: 'Player for {title}',
            captions: 'Captions',
            settings: 'Settings',
            menuBack: 'Go back to previous menu',
            speed: 'Speed',
            normal: 'Normal',
            quality: 'Quality',
            loop: 'Loop',
            start: 'Start',
            end: 'End',
            all: 'All',
            reset: 'Reset',
            disabled: 'Disabled',
            enabled: 'Enabled',
            advertisement: 'Ad',
            qualityBadge: {
                2160: '4K',
                1440: 'HD',
                1080: 'HD',
                720: 'HD',
                576: 'SD',
                480: 'SD',
            },
        }
    });

    // Application state
    let videos = [];
    let currentVideoIndex = -1;
    let watchedVideos = new Set();
    let lastWatchedPositions = {};

    // Load saved state from localStorage
    function loadSavedState() {
        try {
            const savedState = localStorage.getItem('lmsPlayerState');
            if (savedState) {
                const state = JSON.parse(savedState);
                watchedVideos = new Set(state.watchedVideos || []);
                lastWatchedPositions = state.lastWatchedPositions || {};
                
                // Show toast if there's saved progress
                if (watchedVideos.size > 0) {
                    showToast('Progress Loaded', 'Your previous watching progress has been loaded.');
                }
            }
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    }

    // Save state to localStorage
    function saveState() {
        try {
            const state = {
                watchedVideos: Array.from(watchedVideos),
                lastWatchedPositions: lastWatchedPositions
            };
            localStorage.setItem('lmsPlayerState', JSON.stringify(state));
        } catch (e) {
            console.error('Error saving state:', e);
        }
    }

    // Handle folder selection
    folderSelector.addEventListener('click', () => {
        folderInput.click();
    });

    folderInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Filter video files
        const videoFiles = files.filter(file => 
            file.type.startsWith('video/') || 
            file.name.match(/\.(mp4|webm|ogg|mov|mkv)$/i)
        );
        
        if (videoFiles.length === 0) {
            showToast('No Videos Found', 'The selected folder does not contain any supported video files.');
            return;
        }
        
        // Get folder name from first file path
        const pathParts = videoFiles[0].webkitRelativePath.split('/');
        const folderName = pathParts[0];
        
        // Sort videos by name
        videos = videoFiles.sort((a, b) => {
            // Extract numbers from filenames for natural sorting
            const aName = a.name.replace(/^\d+\.\s*/, '');
            const bName = b.name.replace(/^\d+\.\s*/, '');
            return aName.localeCompare(bName, undefined, {numeric: true, sensitivity: 'base'});
        });
        
        // Update UI
        courseTitle.textContent = folderName;
        videoCount.textContent = `${videos.length} lectures`;
        
        // Generate playlist
        generatePlaylist();
        updateProgressUI();
        
        // Enable navigation buttons if we have videos
        updateNavigationButtons();
        
        showToast('Course Loaded', `Successfully loaded ${videos.length} videos from "${folderName}"`);
    });

    // Generate video playlist
    function generatePlaylist() {
        videoPlaylist.innerHTML = '';
        
        videos.forEach((video, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';
            if (index === currentVideoIndex) {
                listItem.classList.add('active');
            }
            if (watchedVideos.has(video.name)) {
                listItem.classList.add('completed');
            }
            
            const videoName = video.name.replace(/\.[^/.]+$/, ""); // Remove file extension
            const cleanName = videoName.replace(/^\d+\.\s*/, ''); // Remove leading numbers
            
            listItem.innerHTML = `
                <span class="completed-icon"><i class="fas fa-check-circle"></i></span>
                <span class="video-number">${index + 1}.</span>
                <span class="video-title">${cleanName}</span>
                <span class="video-duration">--:--</span>
            `;
            
            listItem.addEventListener('click', () => {
                playVideo(index);
            });
            
            videoPlaylist.appendChild(listItem);
        });
    }

    // Play selected video
    function playVideo(index) {
        if (index < 0 || index >= videos.length) return;
        
        try {
            currentVideoIndex = index;
            const selectedVideo = videos[index];
            
            // Show loading state
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-spinner';
            loadingIndicator.style.position = 'absolute';
            loadingIndicator.style.top = '50%';
            loadingIndicator.style.left = '50%';
            loadingIndicator.style.transform = 'translate(-50%, -50%)';
            loadingIndicator.style.zIndex = '5';
            
            videoPlayer.parentNode.appendChild(loadingIndicator);
            
            // Update playlist active item
            const playlistItems = videoPlaylist.querySelectorAll('.playlist-item');
            playlistItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
                
                // Ensure active item is visible (auto-scroll)
                if (i === index) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
            
            // Update video player
            const videoURL = URL.createObjectURL(selectedVideo);
            videoPlayer.src = videoURL;
            videoPlayer.style.display = 'block';
            noVideoMessage.style.display = 'none';
            
            // Update video info with better formatting
            const videoName = selectedVideo.name.replace(/\.[^/.]+$/, "");
            const cleanName = videoName.replace(/^\d+\.\s*/, '');
            currentVideoTitle.textContent = cleanName;
            currentVideoDescription.textContent = `This is lecture ${index + 1} of your course. The file name is "${selectedVideo.name}".`;
            
            // Add formatted duration if available
            if (lastWatchedPositions[selectedVideo.name]) {
                const lastPosition = lastWatchedPositions[selectedVideo.name];
                const lastPositionFormatted = formatTime(lastPosition);
                currentVideoDescription.textContent += ` You last watched until ${lastPositionFormatted}.`;
                videoPlayer.currentTime = lastWatchedPositions[selectedVideo.name];
            }
            
            // Update navigation buttons
            updateNavigationButtons();
            
            // Play the video
            player.play().then(() => {
                // Remove loading indicator after successful play
                loadingIndicator.remove();
            }).catch(e => {
                console.log('Playback prevented:', e);
                // Remove loading indicator if playback fails
                loadingIndicator.remove();
                showToast('Playback Issue', 'Autoplay was prevented. Click play to start the video.');
            });
        } catch (error) {
            console.error('Error playing video:', error);
            showToast('Error', 'There was a problem playing this video. Please try again.');
        }
    }

    // Add helper function to format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update navigation buttons state
    function updateNavigationButtons() {
        prevVideoBtn.disabled = currentVideoIndex <= 0;
        nextVideoBtn.disabled = currentVideoIndex >= videos.length - 1 || currentVideoIndex === -1;
    }

    // Handle previous and next video buttons
    prevVideoBtn.addEventListener('click', () => {
        if (currentVideoIndex > 0) {
            playVideo(currentVideoIndex - 1);
        }
    });
    
    nextVideoBtn.addEventListener('click', () => {
        if (currentVideoIndex < videos.length - 1) {
            playVideo(currentVideoIndex + 1);
        }
    });

    // Track video progress 
    player.on('timeupdate', () => {
        if (currentVideoIndex === -1) return;
        
        const currentVideo = videos[currentVideoIndex];
        const currentTime = videoPlayer.currentTime;
        const duration = videoPlayer.duration;
        
        // Update duration display
        if (!isNaN(duration)) {
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = Math.floor(duration % 60);
            currentVideoDuration.textContent = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
            
            // Update duration in playlist
            const playlistItems = videoPlaylist.querySelectorAll('.playlist-item');
            if (playlistItems[currentVideoIndex]) {
                const durationElement = playlistItems[currentVideoIndex].querySelector('.video-duration');
                durationElement.textContent = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
            }
        }
        
        // Save current position every 5 seconds
        if (currentTime % 5 < 1) {
            lastWatchedPositions[currentVideo.name] = currentTime;
            saveState();
        }
        
        // Mark video as watched if 90% completed
        if (duration && !isNaN(duration) && currentTime / duration > 0.9) {
            if (!watchedVideos.has(currentVideo.name)) {
                watchedVideos.add(currentVideo.name);
                updateProgressUI();
                saveState();
                updateCourseProgress(); // Update course progress data
                
                // Update playlist item
                const playlistItems = videoPlaylist.querySelectorAll('.playlist-item');
                if (playlistItems[currentVideoIndex]) {
                    playlistItems[currentVideoIndex].classList.add('completed');
                }
            }
        }
    });

    // Auto-play next video when current one ends
    player.on('ended', function() {
        if (currentVideoIndex < videos.length - 1) {
            playVideo(currentVideoIndex + 1);
        }
    });

    // Update progress UI
    function updateProgressUI() {
        if (videos.length === 0) return;
        
        const completedCount = watchedVideos.size;
        const totalCount = videos.length;
        const progressPercent = Math.round((completedCount / totalCount) * 100);
        
        courseProgress.style.width = `${progressPercent}%`;
        progressPercentage.textContent = `${progressPercent}%`;
    }

    // Show toast notification
    function showToast(title, message) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toastInstance.show();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Skip forward with right arrow + ctrl
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            if (currentVideoIndex < videos.length - 1) {
                playVideo(currentVideoIndex + 1);
                showToast('Navigation', 'Skipped to next video');
            }
        }
        
        // Skip backward with left arrow + ctrl
        if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            if (currentVideoIndex > 0) {
                playVideo(currentVideoIndex - 1);
                showToast('Navigation', 'Skipped to previous video');
            }
        }
        
        // Toggle play/pause with spacebar when not in input field
        if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA' && 
            document.activeElement.tagName !== 'BUTTON') {
            e.preventDefault();
            player.togglePlay();
        }
        
        // Toggle fullscreen with F key
        if (e.key === 'f' && document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            player.fullscreen.toggle();
        }
    });

    // Load saved state on app start
    loadSavedState();

    // Handle direct course loading from URL parameter
    function loadCourseFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const coursePath = urlParams.get('course');
        
        if (coursePath) {
            // Check if we have this course saved
            try {
                const savedCourses = localStorage.getItem('lmsPlayerCourses');
                if (savedCourses) {
                    const courses = JSON.parse(savedCourses);
                    const course = courses.find(c => c.path === coursePath);
                    
                    if (course) {
                        courseTitle.textContent = course.name;
                        // We can't automatically load the folder since browsers don't allow that
                        // We'll just display the name and show a message
                        showToast('Select Course Folder', 'Please select the folder for "' + course.name + '" to continue.');
                    }
                }
            } catch (e) {
                console.error('Error loading course from URL:', e);
            }
        }
    }

    // Load course from URL parameter if available
    loadCourseFromUrl();

    // Elements for resizing
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const resizeHandle = document.getElementById('resize-handle');
    const videoContainer = document.querySelector('.video-container');
    const decreaseVideoSizeBtn = document.getElementById('decrease-video-size');
    const resetVideoSizeBtn = document.getElementById('reset-video-size');
    const increaseVideoSizeBtn = document.getElementById('increase-video-size');
    
    // Default sizes and current video size percentage
    const defaultSidebarWidth = 300; // in px
    let videoSizePercentage = 100; // current video size as percentage of container width
    
    // Load saved layout preferences if available
    function loadLayoutPreferences() {
        try {
            const layoutPrefs = localStorage.getItem('lmsPlayerLayout');
            if (layoutPrefs) {
                const prefs = JSON.parse(layoutPrefs);
                
                // Apply sidebar width
                if (prefs.sidebarWidth && window.innerWidth > 768) { // Only apply on desktop
                    sidebar.style.width = `${prefs.sidebarWidth}px`;
                    mainContent.style.width = `calc(100% - ${prefs.sidebarWidth}px)`;
                }
                
                // Apply video size
                if (prefs.videoSizePercentage) {
                    videoSizePercentage = prefs.videoSizePercentage;
                    videoContainer.style.width = `${videoSizePercentage}%`;
                }
            }
        } catch (e) {
            console.error('Error loading layout preferences:', e);
        }
    }
    
    // Save layout preferences
    function saveLayoutPreferences() {
        try {
            const prefs = {
                sidebarWidth: parseInt(sidebar.style.width),
                videoSizePercentage: videoSizePercentage
            };
            localStorage.setItem('lmsPlayerLayout', JSON.stringify(prefs));
        } catch (e) {
            console.error('Error saving layout preferences:', e);
        }
    }
    
    // Make sidebar resizable
    function initializeResizableSidebar() {
        let isResizing = false;
        let startX, startWidth;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
            document.body.style.cursor = 'col-resize';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault(); // Prevent text selection during drag
        });
        
        function handleMouseMove(e) {
            if (!isResizing) return;
            
            const width = startWidth + (e.clientX - startX);
            
            // Apply constraints
            if (width >= 200 && width <= window.innerWidth * 0.5) {
                sidebar.style.width = `${width}px`;
                mainContent.style.width = `calc(100% - ${width}px)`;
            }
        }
        
        function stopResize() {
            isResizing = false;
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopResize);
            saveLayoutPreferences();
        }
    }
    
    // Video size control functions
    function initializeVideoSizeControls() {
        // Decrease video size
        decreaseVideoSizeBtn.addEventListener('click', () => {
            if (videoSizePercentage > 60) { // Don't let it get too small
                videoSizePercentage -= 10;
                videoContainer.style.width = `${videoSizePercentage}%`;
                saveLayoutPreferences();
            }
        });
        
        // Reset video size
        resetVideoSizeBtn.addEventListener('click', () => {
            videoSizePercentage = 100;
            videoContainer.style.width = '100%';
            saveLayoutPreferences();
        });
        
        // Increase video size
        increaseVideoSizeBtn.addEventListener('click', () => {
            if (videoSizePercentage < 150) { // Don't let it get too large
                videoSizePercentage += 10;
                videoContainer.style.width = `${videoSizePercentage}%`;
                saveLayoutPreferences();
            }
        });
    }
    
    // Initialize resizable interface
    loadLayoutPreferences();
    initializeResizableSidebar();
    initializeVideoSizeControls();

    // Load courses data when navigating through pages
    function updateCourseProgress() {
        if (currentVideoIndex === -1 || videos.length === 0) return;
        
        try {
            // Get the current course name from path
            const pathParts = videos[0].webkitRelativePath.split('/');
            const folderName = pathParts[0];
            
            // Load courses
            const savedCoursesStr = localStorage.getItem('lmsPlayerCourses');
            if (!savedCoursesStr) return;
            
            const savedCourses = JSON.parse(savedCoursesStr);
            const courseIndex = savedCourses.findIndex(c => c.name === folderName);
            
            if (courseIndex !== -1) {
                // Update the completed videos
                savedCourses[courseIndex].completedVideos = Array.from(watchedVideos);
                savedCourses[courseIndex].videoCount = videos.length;
                
                // Save back to localStorage
                localStorage.setItem('lmsPlayerCourses', JSON.stringify(savedCourses));
            } else {
                // Create new course entry
                savedCourses.push({
                    name: folderName,
                    path: folderName,
                    videoCount: videos.length,
                    completedVideos: Array.from(watchedVideos),
                    dateAdded: new Date().toISOString()
                });
                
                localStorage.setItem('lmsPlayerCourses', JSON.stringify(savedCourses));
            }
        } catch (e) {
            console.error('Error updating course progress:', e);
        }
    }
});
