/**
 * SOBRE PAGE - ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Animate expertise bars when in viewport
    const expertiseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
                expertiseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const expertiseFills = document.querySelectorAll('.expertise-fill');
    expertiseFills.forEach(fill => {
        expertiseObserver.observe(fill);
    });
});



