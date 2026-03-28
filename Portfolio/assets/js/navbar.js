const links = document.querySelectorAll('nav a');
const bubble = document.createElement('div');
bubble.classList.add('nav-bubble');
document.querySelector('nav').appendChild(bubble);

function moveBubbleTo(link) {
    const nav = document.querySelector('nav');
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    bubble.style.opacity = '0.7';
    bubble.style.width = linkRect.width + 50 + 'px';
    bubble.style.left = (linkRect.left - navRect.left - 25) + 'px';
}

function setActive(id) {
    const match = document.querySelector(`nav a[href="#${id}"]`);
    if (match) moveBubbleTo(match);
}

// Prevent URL change, manually scroll instead
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        setActive(id);
    });
});

// Use querySelectorAll('[id]') scoped to your main content, or list IDs manually
const sectionIds = Array.from(document.querySelectorAll('section')).map(el => el.id);
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: '-80px 0px -40% 0px', // offsets for sticky navbar height
        threshold: 0
    });

sections.forEach(s => observer.observe(s));

// Init
moveBubbleTo(links[0]);