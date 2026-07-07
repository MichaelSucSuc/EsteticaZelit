document.addEventListener('DOMContentLoaded', () => {
    // Menu DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const siteHeader = document.getElementById('siteHeader');

    // Links & Animations
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const animatedItems = document.querySelectorAll('.reveal');

    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Map Selector Elements
    const mapButtons = document.querySelectorAll('.map-btn');
    const interactiveMap = document.getElementById('interactive-map');
    const contactItemGroups = document.querySelectorAll('.contact-item-group');

    const mapUrls = {
        arequipa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1894437559595!2d-71.51397899999999!3d-16.4152023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424b5de8156659%3A0xf7bce050dfdbd67c!2sZelit%20-%20Centro%20Est%C3%A9tico!5e0!3m2!1sen!2spe!4v1783188857802!5m2!1sen!2spe",
        juliaca: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.7260304084652!2d-70.133009!3d-15.499162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9167f32710c85fcb%3A0x44b00f018ed1be5!2sZelit%20-%20Centro%20Est%C3%A9tico!5e0!3m2!1ses-419!2spe!4v1783388059871!5m2!1ses-419!2spe",
        pedregal: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.2509253664493!2d-72.1912479!3d-16.361175199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91419b941d741c63%3A0x8570be2232d5ab8!2sZelit%20-%20Centro%20Est%C3%A9tico!5e0!3m2!1ses-419!2spe!4v1783388094938!5m2!1ses-419!2spe"
    };

    if (mapButtons.length > 0 && interactiveMap) {
        mapButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSede = btn.getAttribute('data-sede');
                
                // Toggle active button
                mapButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle map iframe src
                if (mapUrls[targetSede]) {
                    interactiveMap.src = mapUrls[targetSede];
                }

                // Toggle contact details group
                contactItemGroups.forEach(group => {
                    if (group.id === `info-${targetSede}`) {
                        group.style.display = 'flex';
                        group.classList.add('active');
                    } else {
                        group.style.display = 'none';
                        group.classList.remove('active');
                    }
                });
            });
        });
    }

    // 1. Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Close menu on navigation link click (especially on mobile)
    internalLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            // Smooth scroll to target
            const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 10;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('is-open')) {
                navLinks.classList.remove('is-open');
                menuToggle?.setAttribute('aria-expanded', 'false');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            }
        });
    });

    // 2. Interactive Service Tabs
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Toggle active button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active pane with a subtle reveal animation
                tabPanes.forEach(pane => {
                    if (pane.id === targetTab) {
                        pane.classList.add('active');

                        // Instantly reveal elements in the tab pane with stagger
                        const revealElements = pane.querySelectorAll('.reveal');
                        revealElements.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('is-visible');
                            }, index * 100);
                        });
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    }

    // 3. Scroll Reveal (Intersection Observer)
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once visible, stop observing to prevent repeated animations
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
    });

    animatedItems.forEach(item => {
        revealOnScroll.observe(item);
    });

    // 4. Header Scroll styling
    const handleScroll = () => {
        if (!siteHeader) return;
        if (window.scrollY > 40) {
            siteHeader.classList.add('is-scrolled');
        } else {
            siteHeader.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on load
    handleScroll();
});
