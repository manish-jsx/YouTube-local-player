/**
 * Calendly Integration for Local LMS Player
 * Initializes Calendly popup and badge widget for meeting scheduling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all Calendly links
    const calendlyLinks = document.querySelectorAll('.calendly-link, .schedule-call-btn');
    
    // Add click event handler to each link
    calendlyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Open Calendly in a popup
            Calendly.initPopupWidget({
                url: 'https://calendly.com/manish-octavertexmedia/30min',
                prefill: {},
                utm: {}
            });
            
            // Track analytics event if analytics is available
            try {
                if (typeof gtag === 'function') {
                    gtag('event', 'open_calendly', {
                        'event_category': 'Engagement',
                        'event_label': 'Schedule Demo via Calendly'
                    });
                }
                console.log('Calendly popup opened');
            } catch (e) {
                console.error('Analytics error:', e);
            }
            
            return false;
        });
    });
    
    // Initialize the Calendly Badge Widget
    window.addEventListener('load', function() {
        if (typeof Calendly !== 'undefined') {
            try {
                Calendly.initBadgeWidget({ 
                    url: 'https://calendly.com/manish-octavertexmedia/30min', 
                    text: 'Schedule time with me', 
                    color: '#0069ff', 
                    textColor: '#ffffff' 
                });
                console.log('Calendly badge widget initialized');
            } catch (e) {
                console.error('Error initializing Calendly badge widget:', e);
            }
        } else {
            console.warn('Calendly library not loaded');
        }
    });
    
    // Add Calendly event listeners for analytics
    window.addEventListener('message', function(e) {
        if (e.data.event && e.data.event.indexOf('calendly') === 0) {
            // Handle different Calendly events
            if (e.data.event === 'calendly.event_scheduled') {
                // Meeting was scheduled
                try {
                    if (typeof gtag === 'function') {
                        gtag('event', 'meeting_scheduled', {
                            'event_category': 'Conversion',
                            'event_label': 'Demo Meeting Scheduled'
                        });
                    }
                    console.log('Meeting scheduled via Calendly');
                    
                    // Show the confirmation modal after scheduling
                    const confirmationModal = document.getElementById('confirmationModal');
                    if (confirmationModal) {
                        const bsConfirmationModal = new bootstrap.Modal(confirmationModal);
                        bsConfirmationModal.show();
                    }
                } catch (err) {
                    console.error('Analytics error:', err);
                }
            }
        }
    });
});
