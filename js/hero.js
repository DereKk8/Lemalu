/*
===========================================
LEMALU - HERO SECTION JAVASCRIPT
===========================================
Funcionalidades para tarjetas expansivas del hero
*/

// DOM Elements
const serviceCards = document.querySelectorAll('.service-card');
const cardsContainer = document.querySelector('.cards-container');

// State
let expandedCard = null;
let isAnimating = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initHeroCards();
    initHeroAnimations();
});

// Hero Cards Initialization
function initHeroCards() {
    serviceCards.forEach(card => {
        // Click event for expansion - ONLY WAY TO EXPAND
        card.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Card clicked:', this.dataset.service); // Debug
            
            if (isAnimating) {
                console.log('Animation in progress, ignoring click');
                return;
            }
            
            if (expandedCard === this) {
                console.log('Contracting same card');
                contractCard(this);
            } else {
                console.log('Expanding card');
                if (expandedCard) {
                    console.log('Contracting previous card first');
                    contractCard(expandedCard);
                    setTimeout(() => expandCard(this), 300);
                } else {
                    expandCard(this);
                }
            }
        });

        // Close button functionality
        const closeButton = card.querySelector('.close-expanded');
        if (closeButton) {
            closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                contractCard(card);
            });
        }

        // Prevent clicks on expanded content from triggering card events
        const expandedContent = card.querySelector('.card-expanded');
        if (expandedContent) {
            expandedContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Click outside to close expanded card
    document.addEventListener('click', function(e) {
        if (expandedCard && !expandedCard.contains(e.target)) {
            console.log('Click outside detected, closing expanded card');
            contractCard(expandedCard);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && expandedCard) {
            contractCard(expandedCard);
        }
    });
}

// Expand Card Function
function expandCard(card) {
    console.log('expandCard called for:', card.dataset.service);
    
    if (expandedCard === card || isAnimating) {
        console.log('Already expanded or animating, returning');
        return;
    }
    
    isAnimating = true;
    console.log('Starting expansion animation');

    // Set as expanded FIRST
    expandedCard = card;
    card.classList.add('expanded');
    
    // Get the expanded content element
    const expandedContent = card.querySelector('.card-expanded');
    if (!expandedContent) {
        console.error('No expanded content found!');
        isAnimating = false;
        return;
    }
    
    console.log('Found expanded content, proceeding with animation');

    // Hide other elements immediately
    serviceCards.forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.add('hero-hidden');
        }
    });

    // Hide hero text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.classList.add('hero-hidden');
    }

    // Disable body scroll
    document.body.style.overflow = 'hidden';

    // Force show expanded content with direct styles
    setTimeout(() => {
        expandedContent.style.opacity = '1';
        expandedContent.style.visibility = 'visible';
        expandedContent.style.transform = 'scale(1)';
        expandedContent.style.display = 'flex';
        
        console.log('Expanded content should now be visible');
        
        // Animate features with stagger
        const features = card.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            feature.style.transform = 'translateY(30px)';
            feature.style.opacity = '0';
            feature.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
                feature.style.transform = 'translateY(0)';
                feature.style.opacity = '1';
            }, index * 150);
        });

        isAnimating = false;
        console.log('Expansion complete');
    }, 50);

    // Track analytics
    trackCardExpansion(card.dataset.service);
}

// Contract Card Function
function contractCard(card, resetExpanded = true) {
    console.log('contractCard called for:', card ? card.dataset.service : 'null');
    
    if (!card || isAnimating) {
        console.log('No card or animating, returning');
        return;
    }
    
    isAnimating = true;
    console.log('Starting contraction animation');

    // Remove expanded class
    card.classList.remove('expanded');

    // Reset expanded content with force
    const expandedContent = card.querySelector('.card-expanded');
    if (expandedContent) {
        expandedContent.style.opacity = '0';
        expandedContent.style.visibility = 'hidden';
        expandedContent.style.transform = 'scale(0.95)';
        expandedContent.style.display = 'none';
    }

    // Show all cards again
    serviceCards.forEach(serviceCard => {
        serviceCard.classList.remove('hero-hidden');
    });

    // Show hero text again
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.classList.remove('hero-hidden');
    }

    // Re-enable body scroll
    document.body.style.overflow = '';

    if (resetExpanded) {
        expandedCard = null;
    }

    setTimeout(() => {
        isAnimating = false;
        console.log('Contraction complete');
    }, 300);
}

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
