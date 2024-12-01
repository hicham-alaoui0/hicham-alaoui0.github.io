function initAnimations() {
    // Typing animation for hero section
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

    // Scroll animations using Intersection Observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Skill bars animation
    function animateSkillBars(skillCategory) {
        const bars = skillCategory.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
            const target = bar.dataset.level;
            bar.style.width = target + '%';
        });
    }

    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.project-card-inner').style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-card-inner').style.transform = 'rotateY(0deg)';
        });
    });

    // Smooth scroll for navigation
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

// Initialize custom cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for interactive elements
    document.querySelectorAll('a, button, .interactive').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}