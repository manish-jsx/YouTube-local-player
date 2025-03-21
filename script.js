// Modern Navbar - Industry-grade implementation
function initModernNavbar() {
    const navbar = document.querySelector('.modern-navbar');
    if (!navbar) return;
    
    console.log('Initializing modern navbar with performance optimizations');
    
    // Performance: Use event delegation instead of multiple listeners
    document.addEventListener('click', (e) => {
        // Handle navbar toggler click
        if (e.target.closest('.navbar-toggler')) {
            toggleMenu();
        } 
        // Handle backdrop click
        else if (e.target.classList.contains('menu-backdrop')) {
            closeMenu();
        }
        // Handle nav link click
        else if (e.target.closest('.nav-link')) {
            const link = e.target.closest('.nav-link');
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                handleNavLinkClick(link);
            }
        }
    }, { passive: false });
    
    // Toggle menu state with transitions
    function toggleMenu() {
        const isOpen = navbar.classList.contains('menu-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        navbar.classList.add('menu-open');
        document.body.classList.add('overflow-hidden');
        navbar.querySelector('.navbar-toggler')?.setAttribute('aria-expanded', 'true');
        
        // Animate menu items for a staggered entrance
        const menuItems = navbar.querySelectorAll('.navbar-menu .nav-item');
        menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
            item.classList.add('fade-in-right');
        });
    }
    
    function closeMenu() {
        navbar.classList.remove('menu-open');
        document.body.classList.remove('overflow-hidden');
        navbar.querySelector('.navbar-toggler')?.setAttribute('aria-expanded', 'false');
        
        // Reset animation delays
        const menuItems = navbar.querySelectorAll('.navbar-menu .nav-item');
        menuItems.forEach(item => {
            item.style.transitionDelay = '';
            item.classList.remove('fade-in-right');
        });
    }
    
    function handleNavLinkClick(link) {
        // Close menu first
        closeMenu();
        
        // Get target section
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Use native smooth scrolling with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for browsers that don't support smooth scrolling
                    window.scrollTo(0, targetPosition);
                }
            });
        }
    }
    
    // Use IntersectionObserver for scroll handling - more efficient
    const navLinks = navbar.querySelectorAll('.nav-link[href^="#"]');
    const sections = [...navLinks].map(link => {
        const id = link.getAttribute('href');
        return document.querySelector(id);
    }).filter(Boolean);
    
    // Set up the observer with appropriate options
    const observerOptions = {
        root: null,
        rootMargin: `-${navbar.offsetHeight + 20}px 0px 0px 0px`,
        threshold: 0.1
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const navLink = navbar.querySelector(`.nav-link[href="#${id}"]`);
            
            if (!navLink) return;
            
            const navItem = navLink.parentElement;
            
            if (entry.isIntersecting) {
                // Remove active class from all nav items
                navLinks.forEach(link => link.parentElement.classList.remove('active'));
                // Add active class to current nav item
                navItem.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Start observing each section
    sections.forEach(section => {
        if (section) navObserver.observe(section);
    });
    
    // Throttled scroll handler for navbar background change
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbarOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Set initial state
    updateNavbarOnScroll();
    
    // Mark as initialized
    navbar.classList.add('initialized');
}

// Industry-grade Features Slider with robust error handling and performance optimization
class FeatureSlider {
    constructor(options = {}) {
        // Default options
        this.options = {
            sliderId: 'features-slider',
            slideSelector: '.feature-slide',
            navId: 'slider-nav',
            prevBtnId: 'prev-slide',
            nextBtnId: 'next-slide',
            autoplayInterval: 6000,
            animationDuration: 500,
            ...options
        };
        
        // State management
        this.slider = null;
        this.slides = [];
        this.nav = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentSlide = 0;
        this.slideCount = 0;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isAutoplayPaused = false;
        
        // Bind methods to preserve context
        this.init = this.init.bind(this);
        this.goToSlide = this.goToSlide.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);
        this.stopAutoplay = this.stopAutoplay.bind(this);
        this.pauseAutoplay = this.pauseAutoplay.bind(this);
        this.resumeAutoplay = this.resumeAutoplay.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.createSliderNav = this.createSliderNav.bind(this);
        this.setupAccessibility = this.setupAccessibility.bind(this);
        this.cleanup = this.cleanup.bind(this);
        
        // Add debugging for slide visibility issues
        this.debug = options.debug || false;
        
        // Add emergency fix flag
        this.needsEmergencyFix = true;
    }
    
    init() {
        // Get DOM elements
        this.slider = document.getElementById(this.options.sliderId);
        if (!this.slider) {
            console.error(`[FeatureSlider] Slider element with ID "${this.options.sliderId}" not found.`);
            return false;
        }
        
        this.slides = this.slider.querySelectorAll(this.options.slideSelector);
        this.slideCount = this.slides.length;
        
        if (this.slideCount === 0) {
            console.warn('[FeatureSlider] No slides found.');
            return false;
        }
        
        if (this.debug) {
            console.log(`[FeatureSlider] Found ${this.slideCount} slides:`, this.slides);
        }
        
        this.nav = document.getElementById(this.options.navId);
        this.prevBtn = document.getElementById(this.options.prevBtnId);
        this.nextBtn = document.getElementById(this.options.nextBtnId);
        
        // *** CRITICAL FIX: Apply essential layout styles ***
        this.fixSliderLayout();
        
        // Initialize slider components
        this.createSliderNav();
        this.setupEventListeners();
        this.setupAccessibility();
        this.goToSlide(0, false);
        this.startAutoplay();
        
        console.log(`[FeatureSlider] Initialized with ${this.slideCount} slides`);
        return true;
    }
    
    // New method to fix slider layout issues
    fixSliderLayout() {
        // Fix parent container
        this.slider.style.display = 'flex';
        this.slider.style.flexWrap = 'nowrap'; 
        this.slider.style.width = '100%';
        this.slider.style.overflow = 'hidden';
        
        // Fix slides - ensure they're properly sized
        this.slides.forEach(slide => {
            slide.style.flex = '0 0 100%';
            slide.style.minWidth = '100%';
            slide.style.maxWidth = '100%';
            slide.style.overflow = 'visible';
            slide.style.transition = 'opacity 0.3s ease';
        });
        
        // Create a special inner wrapper if needed
        if (this.needsEmergencyFix) {
            // Check if we need to create a wrapper
            const parentStyles = window.getComputedStyle(this.slider.parentElement);
            if (parentStyles.overflow === 'hidden') {
                // The slider's parent already has overflow hidden, which is good
                this.slider.style.width = `${this.slideCount * 100}%`;
                
                // Style each slide to take the correct proportion of space
                this.slides.forEach(slide => {
                    slide.style.width = `${100 / this.slideCount}%`;
                });
            }
            
            console.log('[FeatureSlider] Emergency layout fix applied');
        }
    }
    
    goToSlide(index, animate = true) {
        if (this.isAnimating || index < 0 || index >= this.slideCount || index === this.currentSlide) {
            return;
        }
        
        this.isAnimating = animate;
        const prevSlide = this.currentSlide;
        this.currentSlide = index;
        
        // Update slides
        this.slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        
        // Update nav dots
        if (this.nav) {
            const dots = this.nav.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
        }
        
        // *** CRITICAL FIX: Improved transform method for better reliability ***
        const translateValue = -(index * 100 / this.slideCount);
        
        if (this.debug) {
            console.log(`[FeatureSlider] Moving to slide ${index}, translateX(${translateValue}%)`);
        }
        
        // Use standard transform approach for consistency
        this.slider.style.transition = animate ? `transform ${this.options.animationDuration}ms ease` : 'none';
        this.slider.style.transform = `translateX(${translateValue}%)`;
        
        if (animate) {
            const transitionEndHandler = () => {
                this.isAnimating = false;
                this.slider.removeEventListener('transitionend', transitionEndHandler);
            };
            this.slider.addEventListener('transitionend', transitionEndHandler);
        } else {
            this.isAnimating = false;
        }
        
        // Announce slide change for screen readers
        if (this.liveRegion) {
            this.liveRegion.textContent = `Showing slide ${index + 1} of ${this.slideCount}`;
        }
    }
    
    createSliderNav() {
        if (!this.nav) return;
        
        // Clear existing navigation
        this.nav.innerHTML = '';
        
        // Create navigation dots
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('type', 'button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${this.slideCount}`);
            dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            dot.setAttribute('data-slide-index', i);
            
            // Add tooltip for each dot
            const tooltip = document.createElement('span');
            tooltip.className = 'slider-tooltip';
            tooltip.textContent = this.slides[i].getAttribute('data-title') || `Slide ${i + 1}`;
            dot.appendChild(tooltip);
            
            this.nav.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        // Navigation dots
        if (this.nav) {
            this.nav.addEventListener('click', this.handleNavClick);
        }
        
        // Next and previous buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.handlePrevClick);
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.handleNextClick);
        }
        
        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', this.pauseAutoplay);
        this.slider.addEventListener('mouseleave', this.resumeAutoplay);
        
        // Keyboard navigation
        this.slider.addEventListener('keydown', this.handleKeydown);
        
        // Touch events for swipe support
        this.slider.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.slider.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.slider.addEventListener('touchend', this.handleTouchEnd);
        
        // Focus events for accessibility
        this.slider.addEventListener('focusin', this.pauseAutoplay);
        this.slider.addEventListener('focusout', this.resumeAutoplay);
        
        // Visibility API to pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    setupAccessibility() {
        // Set up proper ARIA attributes
        this.slider.setAttribute('role', 'region');
        this.slider.setAttribute('aria-roledescription', 'carousel');
        this.slider.setAttribute('aria-label', 'Feature slider');
        
        // Make the slider focusable for keyboard navigation
        this.slider.setAttribute('tabindex', '0');
        
        // Set up slide attributes
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.slideCount}`);
            slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        });
        
        // Announce slide changes for screen readers
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
    }
    
    handlePrevClick() {
        let newIndex = this.currentSlide - 1;
        if (newIndex < 0) newIndex = this.slideCount - 1;
        this.goToSlide(newIndex);
    }
    
    handleNextClick() {
        let newIndex = this.currentSlide + 1;
        if (newIndex >= this.slideCount) newIndex = 0;
        this.goToSlide(newIndex);
    }
    
    handleNavClick(event) {
        const dot = event.target.closest('.slider-dot');
        if (dot) {
            const index = parseInt(dot.getAttribute('data-slide-index'), 10);
            if (!isNaN(index)) {
                this.goToSlide(index);
            }
        }
    }
    
    startAutoplay() {
        if (this.options.autoplayInterval > 0) {
            this.autoplayTimer = setInterval(() => {
                if (!this.isAutoplayPaused) {
                    this.handleNextClick();
                }
            }, this.options.autoplayInterval);
        }
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    pauseAutoplay() {
        this.isAutoplayPaused = true;
    }
    
    resumeAutoplay() {
        this.isAutoplayPaused = false;
    }
    
    handleKeydown(event) {
        if (event.key === 'ArrowLeft') {
            this.handlePrevClick();
            event.preventDefault();
        } else if (event.key === 'ArrowRight') {
            this.handleNextClick();
            event.preventDefault();
        }
    }
    
    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
    }
    
    handleTouchMove(event) {
        this.touchEndX = event.touches[0].clientX;
    }
    
    handleTouchEnd() {
        const touchDiff = this.touchStartX - this.touchEndX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(touchDiff) > threshold) {
            if (touchDiff > 0) {
                // Swipe left - go to next slide
                this.handleNextClick();
            } else {
                // Swipe right - go to previous slide
                this.handlePrevClick();
            }
        }
    }
    
    cleanup() {
        // Remove all event listeners
        this.stopAutoplay();
        
        if (this.nav) {
            this.nav.removeEventListener('click', this.handleNavClick);
        }
        
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.handlePrevClick);
        }
        
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.handleNextClick);
        }
        
        this.slider.removeEventListener('mouseenter', this.pauseAutoplay);
        this.slider.removeEventListener('mouseleave', this.resumeAutoplay);
        this.slider.removeEventListener('keydown', this.handleKeydown);
        this.slider.removeEventListener('touchstart', this.handleTouchStart);
        this.slider.removeEventListener('touchmove', this.handleTouchMove);
        this.slider.removeEventListener('touchend', this.handleTouchEnd);
        this.slider.removeEventListener('focusin', this.pauseAutoplay);
        this.slider.removeEventListener('focusout', this.resumeAutoplay);
        
        // Remove live region
        if (this.liveRegion && this.liveRegion.parentNode) {
            this.liveRegion.parentNode.removeChild(this.liveRegion);
        }
    }
}

// Add emergency slider fix function to handle layout issues immediately
function fixSliderEmergency() {
    const slider = document.getElementById('features-slider');
    if (!slider) return;
    
    console.log('Applying emergency slider layout fix');
    
    // Get slides
    const slides = slider.querySelectorAll('.feature-slide');
    if (slides.length === 0) return;
    
    // Fix parent container
    slider.style.display = 'flex';
    slider.style.width = `${slides.length * 100}%`;
    slider.style.overflow = 'visible';
    slider.style.transition = 'transform 0.5s ease';
    
    // Fix slides
    slides.forEach(slide => {
        slide.style.flex = `0 0 ${100 / slides.length}%`;
        slide.style.overflow = 'visible';
    });
    
    // Make sure parent container has proper overflow
    if (slider.parentElement) {
        slider.parentElement.style.overflow = 'hidden';
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Apply immediate emergency fix for slider layout
    setTimeout(fixSliderEmergency, 100);
    
    // Initialize navbar with enhanced performance
    initModernNavbar();
    
    // Initialize feature slider with proper class-based encapsulation and debug mode
    const featureSlider = new FeatureSlider({
        sliderId: 'features-slider',
        slideSelector: '.feature-slide',
        navId: 'slider-nav',
        prevBtnId: 'prev-slide',
        nextBtnId: 'next-slide',
        autoplayInterval: 6000,
        animationDuration: 500,
        debug: true  // Enable debugging
    });
    
    // Verify slider is properly initialized
    const isInitialized = featureSlider.init();
    console.log('Feature slider initialization status:', isInitialized ? 'Success' : 'Failed');
    
    // Make it globally available for debugging and script extensibility
    window.featureSlider = featureSlider;
    
    // ... existing code ...
});

// Ensure any necessary cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.featureSlider) {
        window.featureSlider.cleanup();
    }
});
