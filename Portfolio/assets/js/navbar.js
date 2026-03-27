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
    // Position relative to nav
    bubble.style.left = (linkRect.left - navRect.left - 25) + 'px';
}

// Click: smooth scroll is handled by CSS, just update active state
links.forEach(link => {
    link.addEventListener('click', () => {
        const id = link.getAttribute('href')
        moveBubbleTo(document.querySelector(`nav a[href="${id}"]`));
    });
});

// IntersectionObserver: watch sections and update active on scroll
const sections = document.querySelectorAll('section[id]'); // make sure your sections have IDs

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActive(entry.target.id);
        }
    });
}, {
    threshold: 0.4
});

sections.forEach(section => observer.observe(section));

// Init bubble on page load
const firstActive = document.querySelector('nav a.active') || links[0];
if (firstActive) {
    moveBubbleTo(firstActive);
}