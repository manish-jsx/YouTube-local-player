/**
 * Emergency Display Fix
 * This script ensures that all content is properly visible regardless of CSS issues
 */

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Applying emergency display fix');
        setTimeout(fixVisibility, 300);
        // Run again after a delay to catch any dynamically loaded content
        setTimeout(fixVisibility, 1500);
    });

    function fixVisibility() {
        // Key sections that might have display issues
        const criticalSections = [
            '.features-slider',
            '.feature-slide',
            '.testimonial-scroll-container',
            '.testimonial-track',
            '.testimonial-card',
            '.slider-controls',
            '.slider-nav',
            '.slider-dot',
            '.slider-arrow'
        ];
        
        // Fix each critical section
        criticalSections.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                console.log(`Fixing visibility for ${elements.length} ${selector} elements`);
                
                elements.forEach(element => {
                    // Ensure element is visible
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                    
                    // Fix display property based on element type
                    if (selector === '.features-slider' || selector === '.testimonial-track') {
                        element.style.display = 'flex';
                        element.style.flexWrap = 'nowrap';
                    } else if (selector === '.slider-controls' || selector === '.slider-nav') {
                        element.style.display = 'flex';
                    } else if (selector === '.testimonial-card' || selector === '.feature-slide') {
                        element.style.display = 'block';
                    }
                    
                    // Recursively ensure all children are visible too
                    const children = element.querySelectorAll('*');
                    children.forEach(child => {
                        child.style.visibility = 'visible';
                        child.style.opacity = '1';
                    });
                });
            }
        });
        
        // Special fix for the app-features-carousel
        const carousel = document.querySelector('.app-features-carousel');
        if (carousel) {
            carousel.style.overflow = 'hidden';
        }
    }
})();
