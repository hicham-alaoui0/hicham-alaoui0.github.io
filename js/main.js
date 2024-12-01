document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initParticles();
    initAnimations();
    initInteractions();
});

// Navigation and scroll handling
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('show'), 50);
            } else {
                card.classList.remove('show');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// Skill tooltips
const skillIcons = document.querySelectorAll('.skill-icon');
skillIcons.forEach(icon => {
    const tooltip = icon.querySelector('.skill-tooltip');
    
    icon.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    });
    
    icon.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
    });
});