/**
 * Theme manager for Local LMS Player
 * Provides dark/light mode toggle functionality
 */

class ThemeManager {
    constructor() {
        this.darkMode = false;
        this.root = document.documentElement;
        this.themeKey = 'lmsPlayerTheme';
        this.themeToggle = null;
        
        // Theme variables
        this.lightTheme = {
            '--primary': '#a435f0',
            '--primary-dark': '#8710d8',
            '--secondary': '#6c757d',
            '--light': '#f7f9fa',
            '--dark': '#3c3b37',
            '--bg-color': '#f7f9fa',
            '--card-bg': '#ffffff',
            '--text-color': '#3c3b37',
            '--border-color': '#e8e9eb'
        };
        
        this.darkTheme = {
            '--primary': '#a435f0',
            '--primary-dark': '#8710d8',
            '--secondary': '#8d96a0',
            '--light': '#2d2d2d',
            '--dark': '#f8f9fa',
            '--bg-color': '#1c1c1c',
            '--card-bg': '#2d2d2d',
            '--text-color': '#f8f9fa',
            '--border-color': '#444444'
        };
    }
    
    // Initialize theme
    init() {
        this.loadThemePreference();
        this.createThemeToggle();
        this.applyTheme();
    }
    
    // Create theme toggle button
    createThemeToggle() {
        // Create toggle button
        this.themeToggle = document.createElement('button');
        this.themeToggle.className = 'btn btn-sm theme-toggle';
        this.themeToggle.innerHTML = this.darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        this.themeToggle.title = this.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Style the button
        this.themeToggle.style.position = 'fixed';
        this.themeToggle.style.bottom = '20px';
        this.themeToggle.style.right = '20px';
        this.themeToggle.style.zIndex = '1000';
        this.themeToggle.style.borderRadius = '50%';
        this.themeToggle.style.width = '45px';
        this.themeToggle.style.height = '45px';
        this.themeToggle.style.display = 'flex';
        this.themeToggle.style.alignItems = 'center';
        this.themeToggle.style.justifyContent = 'center';
        this.themeToggle.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        this.themeToggle.style.border = 'none';
        this.themeToggle.style.outline = 'none';
        
        // Add to document
        document.body.appendChild(this.themeToggle);
        
        // Add additional theme support for modern navbar
        this.addNavbarThemeSupport();
    }
    
    // Toggle between light and dark themes
    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.applyTheme();
        this.saveThemePreference();
        
        // Update toggle button
        this.themeToggle.innerHTML = this.darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        this.themeToggle.title = this.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        // Add transition animation
        document.body.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // Apply the selected theme
    applyTheme() {
        const theme = this.darkMode ? this.darkTheme : this.lightTheme;
        
        // Apply CSS variables
        for (const [key, value] of Object.entries(theme)) {
            this.root.style.setProperty(key, value);
        }
        
        // Update body classes
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', this.darkMode ? '#1c1c1c' : '#f7f9fa');
        }
    }
    
    // Save theme preference to localStorage
    saveThemePreference() {
        try {
            localStorage.setItem(this.themeKey, this.darkMode ? 'dark' : 'light');
        } catch (e) {
            console.error('Error saving theme preference:', e);
        }
    }
    
    // Load theme preference from localStorage
    loadThemePreference() {
        try {
            const savedTheme = localStorage.getItem(this.themeKey);
            
            // Check if user prefers dark mode
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Set darkMode based on saved preference or system preference
            if (savedTheme) {
                this.darkMode = savedTheme === 'dark';
            } else {
                this.darkMode = prefersDarkMode;
            }
        } catch (e) {
            console.error('Error loading theme preference:', e);
        }
    }
    
    // Add this new method to ThemeManager class
    addNavbarThemeSupport() {
        // Add special handling for modern navbar when theme changes
        const applyNavbarTheme = () => {
            const navbar = document.querySelector('.modern-navbar');
            if (navbar) {
                if (this.darkMode) {
                    navbar.classList.add('dark-theme');
                    if (navbar.classList.contains('scrolled')) {
                        navbar.style.backgroundColor = 'rgba(30, 30, 30, 0.95)';
                    }
                } else {
                    navbar.classList.remove('dark-theme');
                    if (navbar.classList.contains('scrolled')) {
                        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    }
                }
            }
        };
        
        // Apply theme on toggle
        this.themeToggle.addEventListener('click', applyNavbarTheme);
        
        // Apply theme immediately
        applyNavbarTheme();
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    themeManager.init();
});
