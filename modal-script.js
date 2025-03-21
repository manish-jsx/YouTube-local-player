/**
 * Enhanced Modal Functionality
 * Adds improved form validation and interaction to the schedule call modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const scheduleCallBtn = document.querySelector('.schedule-call-btn');
    const scheduleCallForm = document.getElementById('scheduleCallForm');
    const submitScheduleBtn = document.getElementById('submitScheduleForm');
    const scheduleCallModal = document.getElementById('scheduleCallModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const dateInput = document.getElementById('dateInput');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        dateInput.setAttribute('min', formattedDate);
    }
    
    // Handle form submission with validation
    if (submitScheduleBtn && scheduleCallForm) {
        submitScheduleBtn.addEventListener('click', function() {
            // Add validation styling
            validateForm();
            
            if (scheduleCallForm.checkValidity()) {
                // Hide schedule modal
                const bsScheduleModal = bootstrap.Modal.getInstance(scheduleCallModal);
                bsScheduleModal.hide();
                
                // Show confirmation modal with slight delay for better UX
                setTimeout(() => {
                    const bsConfirmationModal = new bootstrap.Modal(confirmationModal);
                    bsConfirmationModal.show();
                }, 300);
                
                // Reset form and validation styles
                scheduleCallForm.reset();
                const inputs = scheduleCallForm.querySelectorAll('.form-control, .form-select');
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }
        });
    }
    
    // Live validation as user types
    if (scheduleCallForm) {
        const inputs = scheduleCallForm.querySelectorAll('.form-control, .form-select');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            // Validate on input for fields that already have values
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    validateInput(this);
                }
            });
        });
    }
    
    // Validate a specific input
    function validateInput(input) {
        if (input.required && input.value.trim() === '') {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        } else if (input.type === 'email' && input.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(input.value.trim())) {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
                return true;
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                return false;
            }
        } else if (input.value.trim() !== '') {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            return true;
        }
        
        return true;
    }
    
    // Validate entire form
    function validateForm() {
        const inputs = scheduleCallForm.querySelectorAll('.form-control, .form-select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Analytics tracking for modal interactions
    if (scheduleCallBtn) {
        scheduleCallBtn.addEventListener('click', function() {
            try {
                // Track modal open event (would connect to your analytics system)
                console.log('Modal opened: Schedule Demo Call');
                
                // Hypothetical analytics call
                if (typeof gtag === 'function') {
                    gtag('event', 'open_modal', {
                        'event_category': 'Engagement',
                        'event_label': 'Schedule Demo Call'
                    });
                }
            } catch (e) {
                console.error('Analytics error:', e);
            }
        });
    }
    
    // Handle confirmation modal events
    if (confirmationModal) {
        confirmationModal.addEventListener('hidden.bs.modal', function() {
            try {
                // Track successful form submission
                console.log('Demo call scheduled');
                
                // Hypothetical analytics call
                if (typeof gtag === 'function') {
                    gtag('event', 'schedule_demo', {
                        'event_category': 'Conversion',
                        'event_label': 'Demo Call Scheduled'
                    });
                }
            } catch (e) {
                console.error('Analytics error:', e);
            }
        });
    }
});

/**
 * Modal handling for Schedule Demo functionality
 * Provides smooth interactions for the demo scheduling process
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find schedule call buttons
    const scheduleButtons = document.querySelectorAll('.schedule-call-btn');
    const scheduleForm = document.getElementById('scheduleCallForm');
    const submitButton = document.getElementById('submitScheduleForm');
    
    if (scheduleButtons.length) {
        console.log('Initializing schedule demo functionality');
        
        // Add click handler to all schedule buttons
        scheduleButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // If Calendly is available, use it instead of our form
                if (typeof Calendly !== 'undefined') {
                    e.preventDefault();
                    openCalendlyScheduler();
                    return;
                }
                
                // Otherwise, the default behavior will open our modal
                console.log('Opening schedule demo modal');
            });
        });
    }
    
    // Handle form submission
    if (scheduleForm && submitButton) {
        submitButton.addEventListener('click', function() {
            if (!validateForm()) {
                console.log('Form validation failed');
                return;
            }
            
            // Hide the schedule modal
            const scheduleModal = bootstrap.Modal.getInstance(document.getElementById('scheduleCallModal'));
            if (scheduleModal) {
                scheduleModal.hide();
            }
            
            // Show the confirmation modal
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
            
            // Reset the form
            scheduleForm.reset();
            
            // Track the event
            if (typeof gtag === 'function') {
                gtag('event', 'schedule_demo', {
                    'event_category': 'Engagement',
                    'event_label': 'Demo Scheduled'
                });
            }
            
            console.log('Demo scheduled successfully');
        });
    }
    
    function validateForm() {
        if (!scheduleForm) return false;
        
        // Remove existing validation classes
        const inputs = scheduleForm.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
        });
        
        let isValid = true;
        
        // Check required fields
        scheduleForm.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });
        
        // Check email format
        const emailInput = scheduleForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function openCalendlyScheduler() {
        console.log('Opening Calendly scheduler');
        Calendly.initPopupWidget({
            url: 'https://calendly.com/manish-octavertexmedia/30min',
            prefill: {},
            utm: {}
        });
        
        // Track the event
        if (typeof gtag === 'function') {
            gtag('event', 'open_calendly', {
                'event_category': 'Engagement',
                'event_label': 'Calendly Scheduler Opened'
            });
        }
    }
});
