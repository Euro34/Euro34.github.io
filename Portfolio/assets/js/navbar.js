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

        observerLocked = true;
        setTimeout(() => { observerLocked = false; }, 1300);
    });
});


const sections = Array.from(document.querySelectorAll('section')).filter(el => el.id);

let lastScrollY = window.scrollY;

function isAtBottom() {return window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;}
function isAtTop() {return window.scrollY <= 50;}

const NavBarObserver = new IntersectionObserver((entries) => {
    if (observerLocked) return;

    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    if (isAtBottom()) {
        moveBubbleTo(sections[sections.length - 1].id);
        return;
    }

    if (isAtTop()) {
        moveBubbleTo(sections[0].id);
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

observerLocked = false;
sections.forEach(s => NavBarObserver.observe(s));

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('nav');

function openMenu() {
    nav.classList.add('open');
    hamburger.classList.add('open');
    navLinks.classList.add('open');
}

function closeMenu() {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navLinks.classList.add('closing');

    setTimeout(() => {navLinks.classList.remove('closing');}, 500);
}

hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
});