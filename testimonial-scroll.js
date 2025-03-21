/**
 * Infinite Scrolling Testimonials
 * Creates smooth, continuous scrolling effect for testimonials
 */

(function() {
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        setupInfiniteScrollingTestimonials();
        // Run again after a delay to catch any dynamically loaded content
        setTimeout(setupInfiniteScrollingTestimonials, 1000);
    });

    function setupInfiniteScrollingTestimonials() {
        console.log('Initializing testimonial scrolling');
        
        const track1 = document.getElementById('testimonial-track-1');
        const track2 = document.getElementById('testimonial-track-2');
        
        if (!track1 || !track2) {
            console.warn('Testimonial tracks not found');
            return;
        }
        
        // Make sure testimonial containers are visible
        const containers = document.querySelectorAll('.testimonial-scroll-container');
        containers.forEach(container => {
            container.style.overflow = 'hidden';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
        });
        
        // Make sure tracks are visible and properly styled
        [track1, track2].forEach(track => {
            track.style.display = 'flex';
            track.style.flexWrap = 'nowrap';
            track.style.visibility = 'visible';
            track.style.opacity = '1';
        });
        
        // Make sure all testimonial cards are visible
        const allCards = document.querySelectorAll('.testimonial-card');
        allCards.forEach(card => {
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.style.minWidth = '350px';
            card.style.maxWidth = '350px';
            
            // Ensure all child elements are visible
            const children = card.querySelectorAll('*');
            children.forEach(child => {
                child.style.visibility = 'visible';
                child.style.opacity = '1';
            });
        });
        
        // Clone testimonial cards for infinite scroll effect
        const track1Cards = track1.innerHTML;
        const track2Cards = track2.innerHTML;
        
        // Double the cards for seamless loop
        track1.innerHTML = track1Cards + track1Cards;
        track2.innerHTML = track2Cards + track2Cards;
        
        // Set initial positions
        track1.style.transform = 'translateX(0)';
        track2.style.transform = 'translateX(0)';
        
        // Calculate total width for each track
        const track1Width = track1.scrollWidth / 2;
        const track2Width = track2.scrollWidth / 2;

        console.log(`Track widths: Track1=${track1Width}px, Track2=${track2Width}px`);
        
        // Use requestAnimationFrame for smoother animation as backup
        if (typeof gsap === 'undefined') {
            console.log('GSAP not available, using fallback animation');
            animateTrackFallback(track1, -track1Width, 100000);
            animateTrackFallback(track2, track2Width, 80000);
        } else {
            // Animation function for track 1 (left to right)
            gsap.to(track1, {
                x: -track1Width,
                duration: 100,
                ease: 'none',
                repeat: -1,
                repeatDelay: 0,
                onRepeat: function() {
                    // Jump back to start without animation for seamless loop
                    gsap.set(track1, { x: 0 });
                }
            });
            
            // Animation function for track 2 (right to left - opposite direction)
            gsap.fromTo(track2, 
                { x: -track2Width }, 
                {
                    x: 0,
                    duration: 80,
                    ease: 'none',
                    repeat: -1,
                    repeatDelay: 0,
                    onRepeat: function() {
                        // Jump back to start without animation
                        gsap.set(track2, { x: -track2Width });
                    }
                }
            );
            
            // Handle pause on hover
            containers.forEach(container => {
                container.addEventListener('mouseenter', function() {
                    gsap.to([track1, track2], { timeScale: 0, overwrite: true });
                });
                
                container.addEventListener('mouseleave', function() {
                    gsap.to([track1, track2], { timeScale: 1, overwrite: true });
                });
            });
        }
    }
    
    // Fallback animation using requestAnimationFrame for older browsers
    function animateTrackFallback(track, targetX, duration) {
        const startTime = performance.now();
        const startX = 0;
        let animationId;
        let isPaused = false;
        
        // Add pause/resume on hover
        const container = track.closest('.testimonial-scroll-container');
        if (container) {
            container.addEventListener('mouseenter', () => { isPaused = true; });
            container.addEventListener('mouseleave', () => { isPaused = false; });
        }
        
        function step(currentTime) {
            if (isPaused) {
                animationId = requestAnimationFrame(step);
                return;
            }
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentX = startX + (targetX - startX) * progress;
            
            track.style.transform = `translateX(${currentX}px)`;
            
            if (progress < 1) {
                animationId = requestAnimationFrame(step);
            } else {
                // Reset to start for infinite loop
                track.style.transition = 'none';
                track.style.transform = 'translateX(0px)';
                setTimeout(() => {
                    track.style.transition = '';
                    animateTrackFallback(track, targetX, duration);
                }, 50);
            }
        }
        
        animationId = requestAnimationFrame(step);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationId);
        }, { once: true });
    }
})();
