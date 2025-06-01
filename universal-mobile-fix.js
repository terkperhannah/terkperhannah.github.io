/**
 * Universal Mobile Navigation Fix and Welcome Message
 * Applies mobile-specific improvements to all pages
 */

function initUniversalMobileFix() {
    // Mobile detection function
    function isMobileDevice() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Add mobile welcome message and notice to pages
    function addMobileWelcomeMessage() {
        const isMobile = isMobileDevice();
        if (!isMobile) return;

        // Find the main content area or first content box
        const contentBox = document.querySelector('.content-box, main, .container');
        if (!contentBox) return;

        // Check if mobile notice already exists
        if (document.querySelector('.mobile-notice')) return;

        // Create mobile notice
        const mobileNotice = document.createElement('div');
        mobileNotice.className = 'mobile-notice';
        mobileNotice.style.cssText = `
            background: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            font-size: 0.95em;
            color: #1565c0;
            text-align: center;
            line-height: 1.4;
        `;
        mobileNotice.innerHTML = '📱 You\'re viewing the mobile version. For full access to all interactive features and content, please visit on a desktop or laptop computer.';

        // Insert at the beginning of content
        contentBox.insertBefore(mobileNotice, contentBox.firstChild);

        // Update page titles for mobile
        const pageTitle = document.querySelector('h1, h2');
        if (pageTitle && !pageTitle.textContent.includes('Mobile')) {
            const originalText = pageTitle.textContent;
            if (originalText.includes('Welcome')) {
                pageTitle.textContent = originalText.replace('Welcome', 'Welcome to Ms. Terkper\'s Mobile Digital Classroom -');
            } else {
                // Add mobile indicator to other page titles
                pageTitle.innerHTML = `<span style="font-size: 0.9em; color: #2196f3;">Mobile:</span> ${originalText}`;
            }
        }
    }

    // Fix mobile navigation issues
    function fixMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileToggle || !navLinks) return;

        // Enhanced mobile menu toggle
        function toggleMobileMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = navLinks.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            navLinks.classList.add('mobile-open');
            mobileToggle.classList.add('active');
            document.body.classList.add('mobile-menu-active');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            navLinks.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
            document.body.style.overflow = '';
            
            // Close all dropdowns
            document.querySelectorAll('.nav-links > li').forEach(item => {
                item.classList.remove('dropdown-open');
            });
        }

        // Remove existing listeners and add new ones
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        newToggle.addEventListener('click', toggleMobileMenu);
        newToggle.addEventListener('touchstart', toggleMobileMenu, { passive: false });

        // Handle dropdown clicks on mobile
        document.querySelectorAll('.nav-links > li').forEach(item => {
            const mainLink = item.querySelector('a');
            const dropdown = item.querySelector('.dropdown');
            
            if (mainLink && dropdown) {
                mainLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        item.classList.toggle('dropdown-open');
                    }
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                navLinks.classList.contains('mobile-open') &&
                !navLinks.contains(e.target) && 
                !newToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }

    // Initialize mobile fixes
    function init() {
        addMobileWelcomeMessage();
        fixMobileNavigation();
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-run on resize to handle orientation changes
    window.addEventListener('resize', () => {
        setTimeout(() => {
            if (isMobileDevice()) {
                addMobileWelcomeMessage();
            }
        }, 100);
    });
}

// Initialize the universal mobile fix
initUniversalMobileFix();