/**
 * MAIN JAVASCRIPT - SITE FUNCTIONALITY
 */

// Animate stats counter with smooth easing
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;
        
        if (progress < 1) {
            const value = target.toString().includes('.') ? current.toFixed(1) : Math.floor(current);
            element.textContent = value;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// Initialize stats animation when in viewport
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe hero stats section
document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    
    // Smooth scroll for anchor links
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
});

// Handle page navigation highlight
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const isActive = linkHref === currentPage || 
                        (currentPage === '' && linkHref === 'index.html') ||
                        (currentPage === 'index.html' && linkHref === 'index.html');
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

