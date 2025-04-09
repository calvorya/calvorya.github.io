// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const loading = document.querySelector('.loading');
    const progressBar = document.querySelector('.progress-bar');
    const loadingContent = document.querySelector('.loading-content');
    
    if (loading && progressBar && loadingContent) {
        // Create particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'loading-particles';
        loadingContent.appendChild(particlesContainer);

        // Create particles with DocumentFragment
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 1.5}s`;
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);

        // Loading progress animation
        const duration = 1200;
        const startTime = performance.now();

        const updateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            progressBar.style.width = `${progress}%`;

            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                // Success animation
                loadingContent.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    loadingContent.style.transform = 'scale(1)';
                    setTimeout(() => {
                        loading.classList.add('hidden');
                        setTimeout(() => {
                            loading.style.display = 'none';
                        }, 300);
                    }, 300);
                }, 150);
            }
        };

        requestAnimationFrame(updateProgress);
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.createElement('div');
scrollProgressBar.className = 'scroll-progress';
document.body.appendChild(scrollProgressBar);

// Optimized scroll handlers
const handleScroll = debounce(() => {
    // Navbar effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgressBar.style.transform = `scaleX(${scrolled / 100})`;
}, 10);

window.addEventListener('scroll', handleScroll);

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add staggered animation to children
            entry.target.querySelectorAll('.card').forEach((child, index) => {
                child.style.transitionDelay = `${index * 0.1}s`;
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections with a delay to improve initial load
setTimeout(() => {
    document.querySelectorAll('.section-transition').forEach(section => {
        observer.observe(section);
    });
}, 100);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing Animation for Hero Text
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();
}

// Optimized Card Hover Effect
const handleCardHover = debounce((e) => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        
        // Only apply effect if card is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        }
    });
}, 32);

// Optimized Mouse Move Effect
document.addEventListener('mousemove', handleCardHover);

// Reset card transform on mouse leave
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Mobile Menu Toggle
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
        }
    });
}

// Contact Form Handling
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            const response = await fetch('https://formspree.io/f/systemdown@duck.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced Floating Animation
document.querySelectorAll('.card').forEach(card => {
    card.classList.add('floating');
    card.style.animationDelay = `${Math.random() * 2}s`;
});

// Service Cards Mouse Effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
