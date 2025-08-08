/*
===========================================
LEMALU - HERO SECTION JAVASCRIPT
===========================================
Funcionalidades para tarjetas expansivas del hero
*/

// DOM Elements
const serviceCards = document.querySelectorAll('.service-card');
const cardsContainer = document.querySelector('.cards-container');

// State - simplified for static cards
let isAnimating = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initHeroCards();
    initHeroAnimations();
});

// Hero Cards Initialization - Static Cards Only
function initHeroCards() {
    // Cards are now static - no click functionality needed
    console.log('Hero cards initialized as static elements');
    
    // Optional: Add subtle animation on card info
    serviceCards.forEach(card => {
        animateCardInfo(card);
    });
}

// Removed expansion functions - cards are now static

// Hero Animations
function initHeroAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-text, .service-card');
    heroElements.forEach(el => observer.observe(el));

    // Stagger animation for service cards
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Parallax effect for background decorations
    initParallax();
}

// Parallax Effect
function initParallax() {
    const decorations = document.querySelectorAll('.hero-bg-decoration');
    
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        decorations.forEach((decoration, index) => {
            const speed = (index + 1) * 0.3;
            decoration.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 10));
}

// Card Information Animation (replaced statistics)
function animateCardInfo(card) {
    const infoItems = card.querySelectorAll('.info-item');
    
    infoItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
        }, index * 100);
    });
}

// Mobile Optimizations
function initMobileOptimizations() {
    if (window.innerWidth <= 768) {
        // Touch events for better mobile interaction
        serviceCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Disable hover effects on mobile
        serviceCards.forEach(card => {
            card.classList.add('mobile-card');
        });
    }
}

// Resize Handler
function handleResize() {
    if (expandedCard && window.innerWidth <= 768) {
        // Keep mobile expanded state
        return;
    } else if (expandedCard && window.innerWidth > 768) {
        // Reset on desktop
        contractCard(expandedCard);
    }
}

// Event Listeners
window.addEventListener('resize', debounce(handleResize, 250));
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
});

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', initMobileOptimizations);

// Analytics Tracking
function trackCardExpansion(serviceType) {
    // Track which service card was expanded
    if (typeof gtag !== 'undefined') {
        gtag('event', 'card_expansion', {
            event_category: 'Hero Interaction',
            event_label: serviceType,
            value: 1
        });
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

// Add CSS for animations
const animationStyles = `
    .service-card {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    .service-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero-text {
        animation: fadeInLeft 0.8s ease-out forwards;
        opacity: 0;
        transform: translateX(-30px);
    }
    
    .hero-text.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .mobile-card:hover {
        transform: none !important;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Export functions for external use
window.LemaluHero = {
    expandCard,
    contractCard,
    trackCardExpansion
};
