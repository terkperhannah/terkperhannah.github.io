// JavaScript for EDU 714 Final Project Interactive Features

// Apply interactions only to edu714.html
if (window.location.pathname.includes('edu714.html')) {
    // Collapsible sections functionality
    document.querySelectorAll('.collapsible').forEach(section => {
        const header = section.querySelector('h3');
        const content = section.querySelector('.content');

        header.addEventListener('click', () => {
            content.classList.toggle('visible');
            header.classList.toggle('expanded');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation trigger on scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}
