const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const siteHeader = document.getElementById('siteHeader');
const internalLinks = document.querySelectorAll('a[href^="#"]');
const animatedItems = document.querySelectorAll('.reveal');
const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');

const fallbackImage = 'assets/images/placeholder.svg';

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
}

internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (navLinks && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            menuToggle?.setAttribute('aria-expanded', 'false');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        }
    });
});

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

animatedItems.forEach((item) => sectionObserver.observe(item));

images.forEach((image) => {
    image.addEventListener('error', () => {
        if (image.src.endsWith(fallbackImage)) {
            return;
        }

        image.src = fallbackImage;
    });
});

window.addEventListener('scroll', () => {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
});

window.addEventListener('load', () => {
    if (siteHeader) {
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
    }
});
