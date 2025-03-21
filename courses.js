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

    // Check if this is the first visit from landing page
    let userJourney;
    try {
        userJourney = JSON.parse(localStorage.getItem('user_journey'));
    } catch (err) {
        console.log('No user journey data found');
    }
    
    // If coming from landing page CTA, show an onboarding tip
    if (userJourney && userJourney.cta_clicked) {
        // Clear the flag to avoid showing again
        try {
            userJourney.cta_clicked = false;
            localStorage.setItem('user_journey', JSON.stringify(userJourney));
        } catch (err) {
            console.log('Storage not available');
        }
        
        // Show onboarding tooltip after a short delay
        setTimeout(() => {
            // Create and show onboarding tooltip
            const addCourseBtn = document.getElementById('add-course-btn');
            if (addCourseBtn) {
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'onboarding-tooltip';
                tooltip.innerHTML = `
                    <p>Start by adding your first course folder!</p>
                    <div class="onboarding-arrow"></div>
                    <button class="onboarding-close"><i class="fas fa-times"></i></button>
                `;

                // Position the tooltip relative to the add course button
                const rect = addCourseBtn.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + 10}px`;
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.transform = 'translateX(-50%)';

                document.body.appendChild(tooltip);

                // Add event listener to close button
                const closeBtn = tooltip.querySelector('.onboarding-close');
                closeBtn.addEventListener('click', () => {
                    tooltip.remove();
                });

                // Auto-hide after 8 seconds
                setTimeout(() => {
                    if (document.body.contains(tooltip)) {
                        gsap.to(tooltip, {
                            opacity: 0,
                            y: -10,
                            duration: 0.3,
                            onComplete: () => tooltip.remove()
                        });
                    }
                }, 8000);
            }
        }, 1000);
    }

    // Add sort functionality for courses
    function addSortingFunctionality() {
        // Create sort dropdown in header
        const sortDropdown = document.createElement('div');
        sortDropdown.className = 'dropdown';
        sortDropdown.innerHTML = `
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-sort me-1"></i> Sort By
            </button>
            <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                <li><a class="dropdown-item" href="#" data-sort="name">Name</a></li>
                <li><a class="dropdown-item" href="#" data-sort="progress">Progress</a></li>
                <li><a class="dropdown-item" href="#" data-sort="date">Date Added</a></li>
            </ul>
        `;
        
        // Insert before Add Course button
        const headerDiv = document.querySelector('.courses-header');
        headerDiv.insertBefore(sortDropdown, addCourseBtn);
        
        // Add event listeners to sort options
        const sortOptions = sortDropdown.querySelectorAll('.dropdown-item');
        sortOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const sortBy = e.target.dataset.sort;
                sortCourses(sortBy);
                // Update button text
                document.getElementById('sortDropdown').innerHTML = `
                    <i class="fas fa-sort me-1"></i> Sort: ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                `;
            });
        });
    }

    // Sort courses function
    function sortCourses(sortBy) {
        switch(sortBy) {
            case 'name':
                courses.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'progress':
                courses.sort((a, b) => {
                    const progressA = Math.round((a.completedVideos.length / a.videoCount) * 100) || 0;
                    const progressB = Math.round((b.completedVideos.length / b.videoCount) * 100) || 0;
                    return progressB - progressA; // Higher progress first
                });
                break;
            case 'date':
                courses.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Newest first
                break;
        }
        updateCoursesUI();
    }

    // Initialize sort functionality when courses are loaded
    if (courses.length > 0) {
        addSortingFunctionality();
    }

    // Add page transition effect
    document.addEventListener('DOMContentLoaded', function() {
        // Add page transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
        
        // Fade out overlay
        setTimeout(() => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    overlay.style.display = 'none';
                }
            });
        }, 500);
        
        // Add transition effect to page links
        document.querySelectorAll('a[href^="app.html"], a[href^="index.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                // Show transition
                overlay.style.display = 'flex';
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3,
                    onComplete: () => {
                        // Navigate to target page
                        window.location.href = target;
                    }
                });
            });
        });
    });
});
