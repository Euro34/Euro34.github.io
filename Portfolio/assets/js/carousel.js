const carousel = document.querySelector('.achievements .carousel');
const dotsContainer = document.getElementById('carouselDots');
const dotsBackground = document.getElementById('carouselDotsBackground');
const items = carousel.querySelectorAll('.item');

// Build dots
items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.dot');

// IntersectionObserver to sync dots while scrolling normally
const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = [...items].indexOf(entry.target);
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
        }
    });
}, {
    root: carousel,
    threshold: 0.6
});

items.forEach(item => carouselObserver.observe(item));

// --- Scrubber logic ---
let isScrubbing = false;

function getIndexFromPointer(clientX) {
    const rect = dotsContainer.getBoundingClientRect();
    // Clamp ratio between 0 and 1
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return Math.round(ratio * (items.length - 1));
}

function scrollToIndex(index) {
    items[index].scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
}

dotsContainer.addEventListener('pointerdown', (e) => {
    isScrubbing = true;
    dotsContainer.classList.add('scrubbing');
    dotsBackground.classList.add('scrubbing');
    dotsContainer.setPointerCapture(e.pointerId); // track pointer even if it leaves
    scrollToIndex(getIndexFromPointer(e.clientX));
});

dotsContainer.addEventListener('pointermove', (e) => {
    if (!isScrubbing) return;
    scrollToIndex(getIndexFromPointer(e.clientX));
});

dotsContainer.addEventListener('pointerup', () => {
    isScrubbing = false;
    dotsContainer.classList.remove('scrubbing');
    dotsBackground.classList.remove('scrubbing');
});

dotsContainer.addEventListener('pointercancel', () => {
    isScrubbing = false;
    dotsContainer.classList.remove('scrubbing');
    dotsBackground.classList.remove('scrubbing');
});

// Prevent browser from stealing the touch gesture while scrubbing
dotsContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
}, { passive: false });

dotsContainer.addEventListener('touchmove', (e) => {
    if (isScrubbing) e.preventDefault();
}, { passive: false });


// Arrow logic
const previousChevron = document.getElementById('previousChevron');
const nextChevron = document.getElementById('nextChevron');

previousChevron.addEventListener('click', () => {
    const activeIndex = [...dots].findIndex(dot => dot.classList.contains('active'));
    items[activeIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    dots.forEach(d => d.classList.remove('active'));
    dots[activeIndex - 1].classList.add('active');
});

nextChevron.addEventListener('click', () => {
    const activeIndex = [...dots].findIndex(dot => dot.classList.contains('active'));
    items[activeIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    dots.forEach(d => d.classList.remove('active'));
    dots[activeIndex + 1].classList.add('active');
});