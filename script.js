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
