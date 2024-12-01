// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Skills animation
    const animateSkills = () => {
        document.querySelectorAll('.skill').forEach(skill => {
            const progress = skill.querySelector('.progress');
            const width = progress.style.width;
            progress.style.width = '0';
            setTimeout(() => {
                progress.style.transition = 'width 1s ease-in-out';
                progress.style.width = width;
            }, 100);
        });
    };

    // Intersection Observer for skills
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillsObserver.observe(skillsContainer);
    }

    // Header background change on scroll
    const header = document.querySelector('.sticky-header');
    const heroSection = document.querySelector('.hero');

    const updateHeader = () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader);

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        animateObserver.observe(element);
    });

    // Experience timeline animation
    const experienceItems = document.querySelectorAll('.experience-item');
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    experienceItems.forEach(item => {
        experienceObserver.observe(item);
    });

    // Certification hover effects
    const certificationItems = document.querySelectorAll('.certification-item');
    certificationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover');
        });
    });

    // Image loading animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });

    // Typing effect for hero heading
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});
