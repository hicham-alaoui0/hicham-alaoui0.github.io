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

    // Portfolio cards hover effect
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Animate timeline items
    const observeTimeline = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observeTimeline.observe(item);
    });

    // Typing effect for hero heading
    const typingText = document.querySelector('.typing-wrapper');
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

    // Back to Top button functionality
    const backToTopButton = document.querySelector('.back-to-top');

    const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleBackToTopButton);

    // Skills click event
    document.querySelectorAll('.skill').forEach(skill => {
        skill.addEventListener('click', () => {
            const skillName = skill.querySelector('span').textContent;
            alert(`You clicked on ${skillName}!`); // Replace with your desired action
        });
    });

    // Add intersection observer for better scroll animations
    const observeElements = (elements, className) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    // Add theme toggle functionality
    const addThemeToggle = () => {
        const header = document.querySelector('.sticky-header .container');
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.onclick = () => document.body.classList.toggle('dark-mode');
        header.appendChild(themeToggle);
    };

    // Add search functionality
    const addSearch = () => {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Search projects...';
        searchInput.className = 'portfolio-search';
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            portfolioItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });

        document.querySelector('#portfolio .container').insertBefore(
            searchInput, 
            document.querySelector('.portfolio-grid')
        );
    };

    // Initialize new features
    addThemeToggle();
    addSearch();
    observeElements(document.querySelectorAll('.portfolio-item'), 'visible');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    function selectService(serviceName) {
        const form = document.getElementById('serviceForm');
        form.style.display = 'block';
        document.getElementById('selectedService').value = serviceName;
        
        // Add smooth animation
        setTimeout(() => {
            form.classList.add('visible');
            form.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }

    // Update the service card click handlers
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            // Get the service name from the card's h3 element
            const serviceName = this.querySelector('h3').textContent;
            
            // Show the form
            const form = document.getElementById('serviceForm');
            form.style.display = 'block';
            
            // Set the selected service
            document.getElementById('selectedService').value = serviceName;
            
            // Smooth scroll to form
            form.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Add visible class for animation
            setTimeout(() => {
                form.classList.add('visible');
            }, 100);
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});