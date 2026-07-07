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

    // 4. Video Lightbox & Carousel Lógica
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxVideo = document.getElementById('lightboxVideo');
    
    const playButtons = document.querySelectorAll('.video-play-btn');
    const storyBubbles = document.querySelectorAll('.story-bubble');

    const openVideo = (videoSrc, videoTitle) => {
        if (!videoLightbox || !lightboxVideo || !lightboxTitle) return;
        
        lightboxVideo.src = videoSrc;
        lightboxTitle.textContent = videoTitle;
        videoLightbox.classList.add('active');
        videoLightbox.setAttribute('aria-hidden', 'false');
        
        // Reset dynamic visual states
        lightboxVideo.load();
        
        // Play after load
        lightboxVideo.play().catch(err => {
            console.log("Autoplay blocked or playback error:", err);
        });
    };

    const closeVideo = () => {
        if (!videoLightbox || !lightboxVideo) return;
        
        lightboxVideo.pause();
        // Clear src to stop downloading binary stream
        lightboxVideo.src = '';
        videoLightbox.classList.remove('active');
        videoLightbox.setAttribute('aria-hidden', 'true');
    };

    // Bind triggers for Carousel cards
    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoSrc = btn.getAttribute('data-video');
            const videoTitle = btn.getAttribute('data-title') || 'Video de Tratamiento';
            openVideo(videoSrc, videoTitle);
        });
    });

    // Bind triggers for Floating Stories
    storyBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            const videoSrc = bubble.getAttribute('data-video');
            const videoTitle = bubble.getAttribute('data-title') || 'Video de Tratamiento';
            openVideo(videoSrc, videoTitle);
        });
    });

    // Close handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeVideo);
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeVideo);
    }

    // Keyboard ESC to close lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoLightbox && videoLightbox.classList.contains('active')) {
            closeVideo();
        }
    });

    // Carousel Slider scroll logic
    const videoCarouselTrack = document.getElementById('videoCarouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');

    if (videoCarouselTrack && carouselPrev && carouselNext) {
        carouselPrev.addEventListener('click', () => {
            const cardWidth = videoCarouselTrack.querySelector('.video-card')?.offsetWidth || videoCarouselTrack.offsetWidth;
            videoCarouselTrack.scrollBy({
                left: -cardWidth - 24, // width + gap
                behavior: 'smooth'
            });
        });

        carouselNext.addEventListener('click', () => {
            const cardWidth = videoCarouselTrack.querySelector('.video-card')?.offsetWidth || videoCarouselTrack.offsetWidth;
            videoCarouselTrack.scrollBy({
                left: cardWidth + 24, // width + gap
                behavior: 'smooth'
            });
        });
        
        // Dynamic disable/enable scroll buttons depending on positions
        const updateCarouselArrows = () => {
            const scrollLeft = videoCarouselTrack.scrollLeft;
            const maxScroll = videoCarouselTrack.scrollWidth - videoCarouselTrack.clientWidth;
            
            // Allow small buffer (2px)
            if (scrollLeft <= 5) {
                carouselPrev.style.opacity = '0.5';
                carouselPrev.style.pointerEvents = 'none';
            } else {
                carouselPrev.style.opacity = '1';
                carouselPrev.style.pointerEvents = 'auto';
            }
            
            if (scrollLeft >= maxScroll - 5) {
                carouselNext.style.opacity = '0.5';
                carouselNext.style.pointerEvents = 'none';
            } else {
                carouselNext.style.opacity = '1';
                carouselNext.style.pointerEvents = 'auto';
            }
        };
        
        videoCarouselTrack.addEventListener('scroll', updateCarouselArrows);
        // Initial call
        setTimeout(updateCarouselArrows, 100);
        window.addEventListener('resize', updateCarouselArrows);
    }

    // 5. Header Scroll styling
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
