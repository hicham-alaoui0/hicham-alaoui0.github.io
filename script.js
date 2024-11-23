// Custom Cursor Script
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    const trail = document.querySelector('.cursor-trail');

    cursor.style.left = `${e.pageX}px`;
    cursor.style.top = `${e.pageY}px`;

    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header Animation on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Portfolio Item Hover Animation (Optional for extra interaction)
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
