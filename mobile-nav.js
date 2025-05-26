/**
 * Mobile Navigation Handler
 * Handles mobile menu toggle and responsive navigation behavior
 */

function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const dropdownItems = document.querySelectorAll('.nav-links > li');
  
  if (!mobileToggle || !navLinks) {
    console.warn('Mobile navigation elements not found');
    return;
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
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
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('mobile-open');
    mobileToggle.classList.remove('active');
    document.body.classList.remove('mobile-menu-active');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Close all open dropdowns
    dropdownItems.forEach(item => {
      item.classList.remove('dropdown-open');
    });
  }

  // Handle dropdown toggles on mobile
  function handleDropdownClick(e) {
    // Only handle on mobile
    if (window.innerWidth > 768) return;
    
    const parentLi = e.currentTarget.parentElement;
    const dropdown = parentLi.querySelector('.dropdown');
    
    if (dropdown) {
      e.preventDefault();
      
      // Close other open dropdowns
      dropdownItems.forEach(item => {
        if (item !== parentLi) {
          item.classList.remove('dropdown-open');
        }
      });
      
      // Toggle current dropdown
      parentLi.classList.toggle('dropdown-open');
    }
  }

  // Event listeners
  mobileToggle.addEventListener('click', toggleMobileMenu);
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Add dropdown click handlers for mobile
  dropdownItems.forEach(item => {
    const mainLink = item.querySelector('a');
    if (mainLink && item.querySelector('.dropdown')) {
      mainLink.addEventListener('click', handleDropdownClick);
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        navLinks.classList.contains('mobile-open') &&
        !navLinks.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      closeMobileMenu();
    }
  });

  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  console.log('Mobile navigation initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileNav);
} else {
  initMobileNav();
}
