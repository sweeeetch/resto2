// Restaurant App JavaScript
class RestaurantApp {
    constructor() {
        this.currentSection = 'home';
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMenuCategories();
        this.setupReviewAnimations();
        this.setupScrollAnimations();
        
        // Show initial section
        this.showSection('home');
    }

    setupEventListeners() {
        // Desktop navigation
        const desktopNavLinks = document.querySelectorAll('.nav-link');
        desktopNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Mobile navigation
        const mobileNavItems = document.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Smooth scrolling for internal links
        // document.addEventListener('click', (e) => {
        //     if (e.target.matches('a[href^="#"]')) {
        //         e.preventDefault();
        //         const target = e.target.getAttribute('href').substring(1);
        //         this.navigateToSection(target);
        //     }
        // });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleKeyboardNavigation(e);
            }
        });
    }

    setupMenuCategories() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const menuCategories = document.querySelectorAll('.menu-category');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Remove active class from all buttons and categories
                categoryBtns.forEach(b => b.classList.remove('active'));
                menuCategories.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding category
                btn.classList.add('active');
                document.getElementById(category).classList.add('active');
                
                // Animate menu items
                this.animateMenuItems(category);
            });
        });
    }

    setupReviewAnimations() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        // Animate reviews when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, parseInt(entry.target.getAttribute('data-review-index')) * 200);
                }
            });
        }, {
            threshold: 0.1
        });

        reviewCards.forEach(card => {
            observer.observe(card);
        });
    }

    setupScrollAnimations() {
        // Add scroll-based animations for various elements
        const animatedElements = document.querySelectorAll('.menu-item, .special-card, .info-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    navigateToSection(sectionId) {
        if (this.isAnimating || this.currentSection === sectionId) return;
        
        this.isAnimating = true;
        
        // Update navigation active states
        this.updateNavigation(sectionId);
        
        // Hide current section
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) {
            currentSection.style.opacity = '0';
            currentSection.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                currentSection.classList.remove('active');
                this.showSection(sectionId);
            }, 300);
        } else {
            this.showSection(sectionId);
        }
    }

    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Show new section
        section.classList.add('active');
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        // Force reflow
        section.offsetHeight;
        
        // Animate in
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            
            // Special animations for specific sections
            this.handleSectionSpecificAnimations(sectionId);
            
            this.currentSection = sectionId;
            this.isAnimating = false;
        }, 50);
    }

    handleSectionSpecificAnimations(sectionId) {
        switch(sectionId) {
            case 'home':
                this.animateHeroSection();
                break;
            case 'menu':
                this.animateMenuSection();
                break;
            // case 'reviews':
            //     this.resetReviewAnimations();
            //     break;
        }
    }

    animateHeroSection() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        const specialCard = document.querySelector('.special-card');
        
        if (heroContent) {
            setTimeout(() => heroContent.classList.add('slide-in'), 100);
        }
        if (heroImage) {
            setTimeout(() => heroImage.classList.add('fade-in'), 300);
        }
        if (specialCard) {
            setTimeout(() => specialCard.classList.add('fade-in'), 500);
        }
    }

    animateMenuSection() {
        const activeCategory = document.querySelector('.menu-category.active');
        if (activeCategory) {
            this.animateMenuItems(activeCategory.id);
        }
    }

    animateMenuItems(categoryId) {
        const menuItems = document.querySelectorAll(`#${categoryId} .menu-item`);
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.4s ease-out';
            }, index * 100);
        });
    }

    // resetReviewAnimations() {
    //     const reviewCards = document.querySelectorAll('.review-card');
    //     reviewCards.forEach(card => {
    //         card.classList.remove('animate');
    //     });
    // }

    updateNavigation(sectionId) {
        // Update desktop navigation
        const desktopNavLinks = document.querySelectorAll('.nav-link');
        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update mobile navigation
        const mobileNavItems = document.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }

    handleKeyboardNavigation(e) {
        const sections = ['home', 'menu', 'map', 'reviews'];
        const currentIndex = sections.indexOf(this.currentSection);
        let newIndex;

        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        } else if (e.key === 'ArrowRight') {
            newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
        }

        if (newIndex !== undefined) {
            this.navigateToSection(sections[newIndex]);
        }
    }
}

// Utility Functions
function navigateToSection(sectionId) {
    if (window.restaurantApp) {
        window.restaurantApp.navigateToSection(sectionId);
    }
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Image lazy loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization
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

// Resize handler
const handleResize = debounce(() => {
    // Handle responsive behavior changes
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
}, 250);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantApp = new RestaurantApp();
    setupLazyLoading();
    
    // Setup resize handler
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.classList.add('paused');
    } else {
        // Resume animations when page is visible
        document.body.classList.remove('paused');
    }
});

// Service Worker registration (for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
  const stars = document.querySelectorAll('.dynamic-stars .star');
  const starInput = document.getElementById('stars-input');

  let currentRating = 0;

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = +star.dataset.value;
      highlightStars(val);
    });

    star.addEventListener('mouseout', () => {
      highlightStars(currentRating);
    });

    star.addEventListener('click', () => {
      currentRating = +star.dataset.value;
      starInput.value = currentRating;
    });
  });

  function highlightStars(rating) {
    stars.forEach(star => {
      const val = +star.dataset.value;
      star.classList.toggle('selected', val <= rating);
    });
  }
