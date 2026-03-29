const carousel = document.querySelector('.achievements .carousel');
const dotsContainer = document.getElementById('carouselDots');
const items = carousel.querySelectorAll('.item');

// Build dots
items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.dot');

// Use IntersectionObserver to detect which item is centered
const CarouselObserver = new IntersectionObserver((entries) => {
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

items.forEach(item => CarouselObserver.observe(item));