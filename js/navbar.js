/*
===========================================
LEMALU - NAVBAR JAVASCRIPT
===========================================
Funcionalidades para el navbar moderno
*/

// DOM Elements
const navbar = document.querySelector('.navbar-modern');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// State
let isMenuOpen = false;
let lastScrollTop = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initScrollEffects();
});

// Navbar Initialization
function initNavbar() {
    // Smooth scroll for all navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href')?.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    console.log(`Navegando a: ${targetId}`);
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (isMenuOpen) {
                        closeMobileMenu();
                    }
                } else {
                    console.warn(`Sección no encontrada: ${targetId}`);
                }
            });
        }
    });

    // Active link highlighting
    updateActiveLink();
    window.addEventListener('scroll', debounce(updateActiveLink, 100));
}

// Mobile Menu
function initMobileMenu() {
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on mobile nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    closeMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (isMenuOpen && !navbar.contains(event.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    if (isMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    isMenuOpen = true;
    mobileMenu.classList.add('active');
    mobileMenuBtn.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add animation delay to menu items
    const menuItems = mobileMenu.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');
    menuItems.forEach((item, index) => {
        item.style.transform = 'translateY(20px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            item.style.transform = 'translateY(0)';
            item.style.opacity = '1';
            item.style.transition = 'all 0.3s ease';
        }, index * 50);
    });
}

function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset menu items animation
    const menuItems = mobileMenu.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');
    menuItems.forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
        item.style.transition = '';
    });
}

// Active Link Management
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('nav-link-active');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('nav-link-active');
        }
    });
    
    // If no section is active, activate "Inicio"
    if (!current) {
        const homeLink = document.querySelector('.nav-link[href="#inicio"]');
        if (homeLink) {
            homeLink.classList.add('nav-link-active');
        }
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dropdown Interactions (for desktop)
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        let timeoutId;
        
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateX(-50%) translateY(-8px)';
            }, 150);
        });
    });
}

// Portal Dropdown Functionality
function initPortalDropdown() {
    const portalDropdown = document.querySelector('.portal-dropdown');
    const portalButton = document.querySelector('.btn-portal-access');
    const portalMenu = document.querySelector('.portal-dropdown-menu');
    
    if (!portalDropdown || !portalButton || !portalMenu) return;
    
    let isPortalOpen = false;
    let timeoutId;
    
    // Mouse events for desktop
    portalDropdown.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        // Delay de 100ms para evitar apertura accidental
        timeoutId = setTimeout(() => {
            openPortalDropdown();
        }, 100);
    });
    
    portalDropdown.addEventListener('mouseleave', () => {
        clearTimeout(timeoutId);
        // Delay más largo para permitir navegar al dropdown
        timeoutId = setTimeout(() => {
            closePortalDropdown();
        }, 300);
    });
    
    // Mantener abierto cuando el mouse está sobre el dropdown
    portalMenu.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
    
    portalMenu.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            closePortalDropdown();
        }, 300);
    });
    
    // Click events for mobile/tablet
    portalButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.innerWidth <= 1024) {
            togglePortalDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (isPortalOpen && !portalDropdown.contains(e.target)) {
            closePortalDropdown();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isPortalOpen) {
            closePortalDropdown();
        }
    });
    
    // Portal option analytics/tracking y hover mejorado
    const portalOptions = document.querySelectorAll('.portal-option');
    portalOptions.forEach(option => {
        // Mantener dropdown abierto al hacer hover en las opciones
        option.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });
        
        option.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                closePortalDropdown();
            }, 300);
        });
        
        option.addEventListener('click', (e) => {
            const portalType = option.classList.contains('client-portal') ? 'client' : 'admin';
            console.log(`Navegando a portal: ${portalType}`);
            
            // Cerrar dropdown después del click
            setTimeout(() => {
                closePortalDropdown();
            }, 100);
            
            // Here you can add analytics tracking
            // trackPortalAccess(portalType);
        });
    });
    
    function openPortalDropdown() {
        isPortalOpen = true;
        portalDropdown.classList.remove('closed');
        portalDropdown.classList.add('open');
    }
    
    function closePortalDropdown() {
        isPortalOpen = false;
        portalDropdown.classList.remove('open');
        portalDropdown.classList.add('closed');
    }
    
    // Asegurar que el dropdown empiece cerrado
    portalDropdown.classList.add('closed');
    closePortalDropdown();
    
    function togglePortalDropdown() {
        if (isPortalOpen) {
            closePortalDropdown();
        } else {
            openPortalDropdown();
        }
    }
}

// Initialize dropdowns
document.addEventListener('DOMContentLoaded', function() {
    initDropdowns();
    initPortalDropdown();
});

// Export functions for external use
window.LemaluNavbar = {
    toggleMobileMenu,
    closeMobileMenu,
    updateActiveLink
};
