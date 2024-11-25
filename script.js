// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animated Skill Bars
function animateSkillBars() {
    const bars = document.querySelectorAll('.bar span');
    bars.forEach(bar => {
        const width = bar.getAttribute('style').match(/\d+/)[0]; // Extract width percentage
        bar.style.width = '0'; // Start at 0%
        bar.style.transition = 'width 1s ease-in-out';
        setTimeout(() => {
            bar.style.width = `${width}%`; // Animate to the defined width
        }, 200); // Add slight delay
    });
}

// Trigger Animation When Skills Section Is Visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
}

function checkSkillsInView() {
    const skillsSection = document.querySelector('#resume');
    if (isElementInViewport(skillsSection)) {
        animateSkillBars();
        window.removeEventListener('scroll', checkSkillsInView); // Remove event listener after animation
    }
}

window.addEventListener('scroll', checkSkillsInView);

// Sticky Header on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Portfolio Item Hover Effect (Optional)
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.5)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
    });
});

// Delayed Reveal Animation on Scroll (Optional)
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
