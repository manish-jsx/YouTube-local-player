document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const addCourseBtn = document.getElementById('add-course-btn');
    const noCourseAddBtn = document.getElementById('no-courses-add-btn');
    const folderInput = document.getElementById('folder-input');
    const coursesGrid = document.getElementById('courses-grid');
    const noCoursesMessage = document.getElementById('no-courses-message');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    // Initialize Bootstrap toast
    const toastInstance = new bootstrap.Toast(toast);

    // Load courses data
    let courses = [];
    
    // Load courses from localStorage
    function loadCourses() {
        try {
            const savedCourses = localStorage.getItem('lmsPlayerCourses');
            if (savedCourses) {
                courses = JSON.parse(savedCourses);
                updateCoursesUI();
            }
        } catch (e) {
            console.error('Error loading courses:', e);
        }
    }
    
    // Save courses to localStorage
    function saveCourses() {
        try {
            localStorage.setItem('lmsPlayerCourses', JSON.stringify(courses));
        } catch (e) {
            console.error('Error saving courses:', e);
        }
    }
    
    // Update the courses UI
    function updateCoursesUI() {
        if (courses.length === 0) {
            noCoursesMessage.style.display = 'block';
            coursesGrid.style.display = 'none';
            return;
        }
        
        noCoursesMessage.style.display = 'none';
        coursesGrid.style.display = 'flex';
        
        // Clear existing courses
        coursesGrid.innerHTML = '';
        
        // Add each course
        courses.forEach((course, index) => {
            const courseCard = createCourseCard(course, index);
            coursesGrid.appendChild(courseCard);
        });
    }
    
    // Create a course card element
    function createCourseCard(course, index) {
        const courseCol = document.createElement('div');
        courseCol.className = 'col-lg-4 col-md-6';
        
        const completedCount = course.completedVideos.length;
        const totalCount = course.videoCount;
        const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;
        
        courseCol.innerHTML = `
            <div class="card course-card h-100">
                <div class="card-img-top course-card-img-container">
                    <div class="course-img-placeholder">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="course-card-actions">
                        <button class="btn btn-danger btn-sm remove-course" data-index="${index}" title="Remove course">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text text-muted small">${course.videoCount} lectures</p>
                    <div class="progress mb-2">
                        <div class="progress-bar" role="progressbar" style="width: ${progressPercent}%" 
                             aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="small text-end mb-0">${progressPercent}% complete</p>
                </div>
                <div class="card-footer">
                    <a href="index.html?course=${encodeURIComponent(course.path)}" class="btn btn-outline-primary w-100">
                        Continue Learning
                    </a>
                </div>
            </div>
        `;
        
        // Add event listener for remove button
        courseCol.querySelector('.remove-course').addEventListener('click', (e) => {
            e.stopPropagation();
            removeCourse(index);
        });
        
        return courseCol;
    }
    
    // Add a new course
    function addCourse(folderPath, folderName, videoCount) {
        // Check if course already exists
        const existingCourseIndex = courses.findIndex(course => course.path === folderPath);
        
        if (existingCourseIndex !== -1) {
            // Update existing course
            courses[existingCourseIndex].videoCount = videoCount;
            showToast('Course Updated', `"${folderName}" has been updated with ${videoCount} videos.`);
        } else {
            // Add new course
            courses.push({
                name: folderName,
                path: folderPath,
                videoCount: videoCount,
                completedVideos: [],
                dateAdded: new Date().toISOString()
            });
            showToast('Course Added', `"${folderName}" has been added to your courses.`);
        }
        
        saveCourses();
        updateCoursesUI();
    }
    
    // Remove a course
    function removeCourse(index) {
        if (confirm(`Are you sure you want to remove "${courses[index].name}" from your courses? Your progress will be lost.`)) {
            const courseName = courses[index].name;
            courses.splice(index, 1);
            saveCourses();
            updateCoursesUI();
            showToast('Course Removed', `"${courseName}" has been removed from your courses.`);
        }
    }
    
    // Handle folder selection
    function handleFolderSelection(e) {
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
        
        // Get folder information
        const pathParts = videoFiles[0].webkitRelativePath.split('/');
        const folderName = pathParts[0];
        const folderPath = folderName;
        
        // Add the course
        addCourse(folderPath, folderName, videoFiles.length);
    }
    
    // Show toast notification
    function showToast(title, message) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toastInstance.show();
    }
    
    // Event listeners
    addCourseBtn.addEventListener('click', () => {
        folderInput.click();
    });
    
    noCourseAddBtn.addEventListener('click', () => {
        folderInput.click();
    });
    
    folderInput.addEventListener('change', handleFolderSelection);
    
    // Initialize
    loadCourses();
    updateCoursesUI();
    
    // Track course progress from other pages
    window.addEventListener('storage', (e) => {
        if (e.key === 'lmsPlayerState' || e.key === 'lmsPlayerCourses') {
            loadCourses();
        }
    });
});
