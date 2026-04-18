// ===== Custom Cursor =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
const userAgent = navigator.userAgent;
const isChromiumBrowser = /Chrome|CriOS|Edg\//.test(userAgent) && !/OPR\//.test(userAgent);
const performanceMode = {
    reducedMotion: prefersReducedMotion.matches,
    coarsePointer: coarsePointerQuery.matches,
    compact: window.innerWidth <= 768
};

function syncPerformanceClasses() {
    performanceMode.reducedMotion = prefersReducedMotion.matches;
    performanceMode.coarsePointer = coarsePointerQuery.matches;
    performanceMode.compact = window.innerWidth <= 768;

    document.body.classList.toggle('reduced-motion', performanceMode.reducedMotion);
    document.body.classList.toggle('touch-device', performanceMode.coarsePointer);
    document.body.classList.toggle('compact-effects', performanceMode.compact || performanceMode.coarsePointer);
    document.body.classList.toggle('chromium-browser', isChromiumBrowser);
}

syncPerformanceClasses();

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let cursorVisible = !performanceMode.coarsePointer;
let followerAnimationFrame = null;
let scrollTicking = false;
let latestScrollY = window.pageYOffset;
const gradientOrbs = Array.from(document.querySelectorAll('.gradient-orb'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const navItems = document.querySelectorAll('.nav-link');

function setCursorPosition(element, x, y) {
    if (!element) return;
    element.style.setProperty('--cursor-x', `${x}px`);
    element.style.setProperty('--cursor-y', `${y}px`);
}

document.addEventListener('mousemove', (e) => {
    if (!cursorVisible) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    setCursorPosition(cursor, mouseX, mouseY);
});

function animateFollower() {
    if (!cursorVisible || performanceMode.reducedMotion) {
        followerAnimationFrame = null;
        return;
    }
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    setCursorPosition(cursorFollower, followerX, followerY);
    followerAnimationFrame = requestAnimationFrame(animateFollower);
}

if (cursorVisible && !performanceMode.reducedMotion && !followerAnimationFrame) {
    animateFollower();
}

window.addEventListener('resize', () => {
    syncPerformanceClasses();
    cursorVisible = !performanceMode.coarsePointer;
    if (cursorVisible && !performanceMode.reducedMotion && !followerAnimationFrame) {
        animateFollower();
    }
});

if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', () => {
        syncPerformanceClasses();
        cursorVisible = !performanceMode.coarsePointer;
        if (cursorVisible && !performanceMode.reducedMotion && !followerAnimationFrame) {
            animateFollower();
        }
    });
}

// Cursor hover effects
function bindCursorHoverEffects() {
    const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item');
    hoverElements.forEach(el => {
        if (el.dataset.cursorBound === 'true') return;

        el.addEventListener('mouseenter', () => {
            if (!cursorVisible) return;
            cursor.style.setProperty('--cursor-scale', '2');
            cursorFollower.style.setProperty('--cursor-scale', '1.5');
            cursorFollower.style.borderColor = '#f093fb';
        });
        el.addEventListener('mouseleave', () => {
            if (!cursorVisible) return;
            cursor.style.setProperty('--cursor-scale', '1');
            cursorFollower.style.setProperty('--cursor-scale', '1');
            cursorFollower.style.borderColor = '#667eea';
        });

        el.dataset.cursorBound = 'true';
    });
}

bindCursorHoverEffects();

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

// ===== Mobile Menu =====
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');
const mobileNavPanel = document.getElementById('mobileNavPanel');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (mobileNavPanel) {
        mobileNavPanel.classList.toggle('open');
    }
});

// Close mobile nav when a link inside it is tapped
if (mobileNavPanel) {
    mobileNavPanel.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileNavPanel.classList.remove('open');
        });
    });
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Portfolio Projects =====
const portfolioProjects = [
    {
        category: 'Web App (Security / Encryption)',
        title: 'stegocrypt',
        description: 'A Python-based web service for secure data hiding and cryptographic operations.',
        link: 'https://stegocrypt-eight.vercel.app',
        icon: '🔐',
        gradient: 'gradient-1',
        large: true
    },
    {
        category: 'Static Website (AI / Legal Tech)',
        title: 'Legal-mindsAI',
        description: 'An AI-powered legal assistance platform interface designed to simplify legal understanding.',
        link: 'https://legal-mindsai.onrender.com',
        icon: '⚖️',
        gradient: 'gradient-2',
        large: false
    },
    {
        category: 'Static Website (Utility Tool)',
        title: 'Wallpaper-generator-with-out-AI',
        description: 'A lightweight wallpaper generator that creates designs without relying on AI models.',
        link: 'https://wallpaper-generator-with-out-ai.onrender.com',
        icon: '🖼️',
        gradient: 'gradient-3',
        large: false
    },
    {
        category: 'Static Website (Communication / Chat UI)',
        title: 'fluxchat',
        description: 'A minimal chat interface concept focused on clean UI and smooth interaction design.',
        link: 'https://fluxchat-three.vercel.app',
        icon: '💬',
        gradient: 'gradient-4',
        large: true
    },
    {
        category: 'Static Website (Business / Fitness)',
        title: 'levelupfitnessstudio',
        description: 'A modern fitness studio landing page optimized for conversions and branding.',
        link: 'https://levelupfitnessstudio.netlify.app',
        icon: '🏋️',
        gradient: 'gradient-5',
        large: true
    },
    {
        category: 'Static Website (Automotive / Design)',
        title: 'Automotive Decors',
        description: 'A premium automotive-themed landing page showcasing bold UI and design aesthetics.',
        link: 'https://frabjous-torte-1bf8ad.netlify.app',
        icon: '🚗',
        gradient: 'gradient-1',
        large: false
    },
    {
        category: 'Static Website (Healthcare / Psychology)',
        title: 'sparkpsychologicalcenter',
        description: 'A calming and professional website for a psychological center focused on trust and clarity.',
        link: 'https://sparkpsychologicalcenter.netlify.app',
        icon: '🧠',
        gradient: 'gradient-2',
        large: false
    },
    {
        category: 'FMCG Brand Website (Food / Beverage)',
        title: 'Vyvora',
        description: 'A vibrant and engaging website for a fictional food and beverage brand, showcasing products and brand story.',
        link: 'https://aquaflow-landing-page.vercel.app',
        icon: '💧',
        gradient: 'gradient-3',
        large: true
    }
];

function renderPortfolioProjects() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = portfolioProjects.map(project => `
        <div class="portfolio-item${project.large ? ' large' : ''}">
            <div class="portfolio-image">
                <div class="portfolio-placeholder ${project.gradient}">
                    <span class="project-icon">${project.icon}</span>
                </div>
                <div class="portfolio-overlay">
                    <div class="overlay-content">
                        <span class="project-category">${project.category}</span>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <a href="${project.link}" class="project-link"${project.link !== '#' ? ' target="_blank" rel="noopener noreferrer"' : ''}>View Project</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    bindCursorHoverEffects();
}

renderPortfolioProjects();

// ===== Active Nav Link =====
function updateActiveSection(scrollY) {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
}

// ===== Animated Counter =====
const stats = document.querySelectorAll('.stat-number');
let counted = false;

function countUp() {
    if (counted) return;

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        counted = true;
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let count = 0;
            const increment = target / 50;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            updateCount();
        });
    }
}

countUp();

// ===== Floating Particles =====
const particlesContainer = document.getElementById('particles');
const particleCount = performanceMode.coarsePointer ? 12 : performanceMode.compact ? 24 : 36;

if (particlesContainer) {
    const particleFragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;

        const colors = ['#667eea', '#764ba2', '#f093fb', '#00d4ff', '#a855f7'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.style.background}`;

        particleFragment.appendChild(particle);
    }
    particlesContainer.appendChild(particleFragment);
}

// ===== Scroll Reveal Animation =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-item, .process-step, .testimonial-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add revealed styles
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Tilt Effect for Cards =====
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    let tiltFrame = null;
    let nextTiltX = 0;
    let nextTiltY = 0;

    card.addEventListener('mousemove', (e) => {
        if (performanceMode.coarsePointer || performanceMode.reducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        nextTiltX = (y - centerY) / 24;
        nextTiltY = (centerX - x) / 24;

        if (tiltFrame) return;
        tiltFrame = requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${nextTiltX}deg) rotateY(${nextTiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            tiltFrame = null;
        });
    });

    card.addEventListener('mouseleave', () => {
        if (tiltFrame) {
            cancelAnimationFrame(tiltFrame);
            tiltFrame = null;
        }
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== Testimonial Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
let currentSlide = 0;

function showSlide(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        testimonialDots[i].classList.remove('active');
    });

    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-slide testimonials
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(currentSlide);
}, 5000);

// ===== Form Handling =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Create success animation
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `
        <span>Sending...</span>
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
    `;
    btn.style.pointerEvents = 'none';

    // Add spinner animation
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyle);

    setTimeout(() => {
        btn.innerHTML = `
            <span>Message Sent!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        btn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.pointerEvents = '';
            contactForm.reset();
        }, 3000);
    }, 2000);
});

// ===== Magnetic Button Effect =====
const magneticBtns = document.querySelectorAll('.primary-btn, .cta-btn');

magneticBtns.forEach(btn => {
    let magneticFrame = null;
    let nextX = 0;
    let nextY = 0;

    btn.addEventListener('mousemove', (e) => {
        if (performanceMode.coarsePointer || performanceMode.reducedMotion) return;
        const rect = btn.getBoundingClientRect();
        nextX = e.clientX - rect.left - rect.width / 2;
        nextY = e.clientY - rect.top - rect.height / 2;

        if (magneticFrame) return;
        magneticFrame = requestAnimationFrame(() => {
            btn.style.transform = `translate3d(${nextX * 0.16}px, ${nextY * 0.16}px, 0)`;
            magneticFrame = null;
        });
    });

    btn.addEventListener('mouseleave', () => {
        if (magneticFrame) {
            cancelAnimationFrame(magneticFrame);
            magneticFrame = null;
        }
        btn.style.transform = '';
    });
});

// ===== Text Scramble Effect =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Add scramble char styles
const scrambleStyle = document.createElement('style');
scrambleStyle.textContent = `
    .scramble-char {
        color: var(--accent-cyan);
    }
`;
document.head.appendChild(scrambleStyle);

// ===== Light Effect on Mouse Move =====
const lightTrailPoolSize = performanceMode.coarsePointer || isChromiumBrowser ? 0 : performanceMode.compact ? 4 : 6;
const lightTrailPool = [];
let nextLightTrailIndex = 0;
let lastTrailTime = 0;
const lightTrailInterval = performanceMode.compact ? 110 : 70;

function createLightTrailPool() {
    if (!lightTrailPoolSize) return;
    for (let i = 0; i < lightTrailPoolSize; i++) {
        const light = document.createElement('div');
        light.className = 'mouse-light-trail';
        light.setAttribute('aria-hidden', 'true');
        document.body.appendChild(light);
        lightTrailPool.push(light);
    }
}

createLightTrailPool();

document.addEventListener('mousemove', (e) => {
    if (!lightTrailPool.length || performanceMode.reducedMotion) return;
    const now = performance.now();
    if (now - lastTrailTime < lightTrailInterval) return;
    lastTrailTime = now;

    const light = lightTrailPool[nextLightTrailIndex];
    nextLightTrailIndex = (nextLightTrailIndex + 1) % lightTrailPool.length;

    light.classList.remove('active');
    void light.offsetWidth;
    light.style.setProperty('--trail-x', `${e.clientX}px`);
    light.style.setProperty('--trail-y', `${e.clientY}px`);
    light.classList.add('active');
});



// ===== Page Load Animation & Preloader =====

// IMPORTANT: Add 'loaded' class immediately on DOMContentLoaded as a fallback
// so text animations ALWAYS work in all browsers (Chrome, Edge, Safari, Firefox)
// Even if Spline never fires its load event, the page content will animate in.
document.addEventListener('DOMContentLoaded', () => {
    // Animate hero elements immediately so they're never stuck
    const heroElements = document.querySelectorAll('.hero .animate-in');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const splineViewer = preloader ? preloader.querySelector('spline-viewer') : null;
    let preloaderHidden = false;

    function hidePreloader() {
        if (preloaderHidden) return;
        preloaderHidden = true;

        if (preloader) {
            preloader.classList.add('fade-out');

            setTimeout(() => {
                if (splineViewer) {
                    splineViewer.removeAttribute('url');
                }
                preloader.remove();
                document.body.classList.add('loaded');

                // Animate hero content
                const heroElements = document.querySelectorAll('.hero .animate-in');
                heroElements.forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.15}s`;
                });
            }, 800);
        } else {
            document.body.classList.add('loaded');
            const heroElements = document.querySelectorAll('.hero .animate-in');
            heroElements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.15}s`;
            });
        }
    }

    if (splineViewer) {
        // Listen for Spline load event
        splineViewer.addEventListener('load', () => {
            // Spline is ready — wait 3 seconds then transition
            setTimeout(hidePreloader, 3000);
        });

        // Universal fallback: always hide preloader after 4 seconds
        // This ensures Chrome, Edge, Safari all work even if Spline
        // doesn't fire the load event (common with file:// protocol)
        setTimeout(hidePreloader, 4000);
    } else if (preloader) {
        // No spline viewer, fade after 2 seconds
        setTimeout(hidePreloader, 2000);
    } else {
        // No preloader at all
        document.body.classList.add('loaded');
        const heroElements = document.querySelectorAll('.hero .animate-in');
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.15}s`;
        });
    }
});

// ===== Digital Dreams Wiggle Effect =====
const digitalDreamsText = document.querySelector('.gradient-text[data-text="Digital Dreams"]');
if (digitalDreamsText) {
    const text = digitalDreamsText.innerText;
    digitalDreamsText.innerHTML = '';
    digitalDreamsText.setAttribute('aria-label', text); // Accessibility

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'wiggle-char';

        if (char === ' ') {
            span.style.width = '0.3em';
            span.style.display = 'inline-block';
        }

        // Random fast delay for chaotic wiggle
        span.style.animationDelay = `-${Math.random() * 0.5}s`;

        digitalDreamsText.appendChild(span);
    });

    // Add class so CSS can hide the ::before pseudo-element
    // (needed for Chrome/Edge/Safari cross-browser fix)
    digitalDreamsText.classList.add('wiggle-active');
}

// Add loaded styles
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded) .hero-content,
    body:not(.loaded) .hero-visual {
        opacity: 0;
    }
    
    body.loaded .hero-content,
    body.loaded .hero-visual {
        animation: fadeInUp 1s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(loadedStyle);

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            activateRainbowMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateRainbowMode() {
    document.body.classList.add('rainbow-mode');

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        .rainbow-mode .gradient-text {
            animation: rainbow-text 2s linear infinite !important;
        }
        
        @keyframes rainbow-text {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .rainbow-mode .gradient-orb {
            animation: rainbow-orb 5s linear infinite !important;
        }
        
        @keyframes rainbow-orb {
            0% { filter: hue-rotate(0deg) blur(80px); }
            100% { filter: hue-rotate(360deg) blur(80px); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
        document.body.classList.remove('rainbow-mode');
    }, 10000);
}

function updateParallax(scrollY) {
    if (performanceMode.reducedMotion) return;
    const parallaxFactor = performanceMode.compact ? 0.6 : 1;
    gradientOrbs.forEach((orb, index) => {
        const speed = 0.05 * (index + 1) * parallaxFactor;
        orb.style.setProperty('--parallax-y', `${scrollY * speed}px`);
    });
}

function updateOnScroll() {
    scrollTicking = false;
    const scrollY = latestScrollY;

    if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 50);
    }

    updateActiveSection(scrollY);
    updateParallax(scrollY);
    countUp();
    lastScroll = scrollY;
}

window.addEventListener('scroll', () => {
    latestScrollY = window.pageYOffset;
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateOnScroll);
    }
}, { passive: true });

updateOnScroll();

// ===== Liquid Glass Contact Modal =====
const contactModal = document.getElementById('contactModal');
const modalCloseBtn = document.getElementById('modalClose');
const getStartedBtns = document.querySelectorAll('.cta-btn, .nav-cta');
const modalSplineViewer = contactModal ? contactModal.querySelector('.modal-spline-bg spline-viewer') : null;
let modalSplineLoaded = false;

// Open modal on "Get Started" button click
getStartedBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });
});

function openContactModal() {
    if (modalSplineViewer && !modalSplineLoaded) {
        const splineUrl = modalSplineViewer.dataset.url;
        if (splineUrl) {
            modalSplineViewer.setAttribute('url', splineUrl);
            modalSplineLoaded = true;
        }
    }

    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add haptic-like bounce effect to the cards after modal opens
    setTimeout(() => {
        const cards = contactModal.querySelectorAll('.contact-card');
        cards.forEach((card, index) => {
            card.style.animation = `card-bounce-in 0.5s ${index * 0.1}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
        });
    }, 300);
}

function closeContactModal() {
    contactModal.classList.remove('active');
    contactModal.classList.add('closing');

    setTimeout(() => {
        contactModal.classList.remove('closing');
        document.body.style.overflow = '';
    }, 400);
}

// Close on close button click
modalCloseBtn.addEventListener('click', closeContactModal);

// Close on overlay click (outside modal)
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeContactModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeContactModal();
    }
});

// Add card bounce animation style
const cardBounceStyle = document.createElement('style');
cardBounceStyle.textContent = `
    @keyframes card-bounce-in {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        60% {
            transform: translateY(-5px) scale(1.02);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .liquid-modal-overlay .contact-card {
        opacity: 0;
    }
    
    .liquid-modal-overlay.active .contact-card {
        animation: card-bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    .liquid-modal-overlay.active .contact-card:nth-child(1) {
        animation-delay: 0.2s;
    }
    
    .liquid-modal-overlay.active .contact-card:nth-child(2) {
        animation-delay: 0.35s;
    }
`;
document.head.appendChild(cardBounceStyle);

console.log('%c.dotPixel', 'font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #667eea, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cBuilding Digital Dreams Into Reality', 'font-size: 16px; color: #667eea;');
