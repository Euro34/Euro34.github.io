const links = document.querySelectorAll('nav a');
const bubble = document.createElement('div');
bubble.classList.add('nav-bubble');
document.querySelector('nav').appendChild(bubble);

function moveBubbleTo(id) {
    const nav = document.querySelector('nav');
    const navRect = nav.getBoundingClientRect();
    const linkRect = document.querySelector(`nav a[href="#${id}"]`).getBoundingClientRect();
    bubble.style.opacity = '0.7';
    bubble.style.width = linkRect.width + 50 + 'px';
    bubble.style.left = (linkRect.left - navRect.left - 25) + 'px';
}

// Prevent URL change, manually scroll instead
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        moveBubbleTo(id);
    });
});


const sections = Array.from(document.querySelectorAll('section')).filter(el => el.id);

let lastScrollY = window.scrollY;

function isAtBottom() {
    return window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
}

const NavBarObserver = new IntersectionObserver((entries) => {
    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    if (isAtBottom()) {
        moveBubbleTo(sections[sections.length - 1].id);
        return;
    }
    
    // Collect all currently intersecting sections (not just from this batch of entries)
    const visibleSections = sections.filter(s => {
        const rect = s.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Check if section occupies at least x% of the screen
        const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
        return visibleHeight / viewHeight >= 0.4;
    });

    if (visibleSections.length === 0) return;

    // Pick the section the user is scrolling toward
    const target = scrollingDown
        ? visibleSections[visibleSections.length - 1]
        : visibleSections[0];

    moveBubbleTo(target.id);
}, {
    threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) // [0, 0.1, 0.2, ... 1.0]
});

sections.forEach(s => NavBarObserver.observe(s));