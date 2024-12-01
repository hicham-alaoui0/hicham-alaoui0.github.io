document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initProjectFiltering();
    initSmoothScroll();
});

// Typing effect for hero section
function initTypingEffect() {
    const typingText = "Hicham Alaoui";
    const typingElement = document.querySelector('.typing-text');
    let i = 0;

    function typeWriter() {
        if (i < typingText.length) {
            typingElement.innerHTML += typingText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
}

// Project filtering functionality
function initProjectFiltering() {
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
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Initialize tooltips for skill icons
document.querySelectorAll('.skill-icon').forEach(icon => {
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