/**
 * PORTFOLIO WEBSITE — script.js
 * Pure vanilla JavaScript (ES6+) — No frameworks or libraries.
 *
 * Features:
 *  1. Dark/Light theme toggle with localStorage persistence
 *  2. Mobile hamburger menu toggle
 *  3. Real-time contact form validation
 *  4. Smooth scroll for anchor links
 *  5. Navbar scroll effect (glassmorphism intensifies on scroll)
 *  6. Scroll-triggered fade-in animations (Intersection Observer)
 *  7. Active nav link highlighting based on scroll position
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. THEME TOGGLE (Feature 1 — localStorage)
    // =============================================
    const themeToggle = document.querySelector('.theme-toggle');

    // SVG icon markup for sun (shown in light mode) and moon (shown in dark mode)
    const sunIcon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    const moonIcon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;

    // Apply theme from localStorage on page load (default = dark)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.innerHTML = sunIcon;
    } else {
        if (themeToggle) themeToggle.innerHTML = moonIcon;
    }

    // Toggle between dark and light themes
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');

            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = moonIcon;
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = sunIcon;
            }
        });
    }

    // =============================================
    // 2. MOBILE HAMBURGER MENU (Feature 3)
    // =============================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a nav link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =============================================
    // 3. CONTACT FORM VALIDATION (Feature 2)
    // =============================================
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const charCountEl = document.querySelector('.char-count');
    const formStatus = document.getElementById('formStatus');

    /**
     * Show validation error on a form field.
     * @param {HTMLElement} field  — The input/textarea element
     * @param {string} errorId    — The ID of the error <span>
     * @param {string} message    — Error message to display
     */
    const showError = (field, errorId, message) => {
        field.classList.add('error');
        field.classList.remove('success');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        }
    };

    /** Clear validation error and mark field as valid. */
    const clearError = (field, errorId) => {
        field.classList.remove('error');
        field.classList.add('success');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('visible');
        }
    };

    /** Validate name: non-empty, minimum 2 characters */
    const validateName = () => {
        if (!nameInput) return true;
        const value = nameInput.value.trim();
        if (value.length < 2) {
            showError(nameInput, 'nameError', 'Name must be at least 2 characters.');
            return false;
        }
        clearError(nameInput, 'nameError');
        return true;
    };

    /** Validate email: standard regex pattern */
    const validateEmail = () => {
        if (!emailInput) return true;
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(emailInput, 'emailError', 'Please enter a valid email address.');
            return false;
        }
        clearError(emailInput, 'emailError');
        return true;
    };

    /** Validate message: 10–500 chars, update live counter */
    const validateMessage = () => {
        if (!messageInput) return true;
        const length = messageInput.value.length;

        // Update character counter
        if (charCountEl) {
            charCountEl.textContent = `${length} / 500`;
            charCountEl.style.color = length > 450 ? '#ef4444' : '';
        }

        if (length < 10 || length > 500) {
            showError(messageInput, 'messageError', 'Message must be between 10 and 500 characters.');
            return false;
        }
        clearError(messageInput, 'messageError');
        return true;
    };

    // Attach real-time validation listeners
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (messageInput) messageInput.addEventListener('input', validateMessage);

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (isNameValid && isEmailValid && isMessageValid) {
                // Success
                if (formStatus) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                }
                contactForm.reset();
                [nameInput, emailInput, messageInput].forEach(f => {
                    if (f) f.classList.remove('success', 'error');
                });
                if (charCountEl) charCountEl.textContent = '0 / 500';
            } else {
                // Validation failed
                if (formStatus) {
                    formStatus.textContent = 'Please fix the errors above.';
                    formStatus.className = 'form-status error';
                }
                // Focus first invalid field
                if (!isNameValid && nameInput) nameInput.focus();
                else if (!isEmailValid && emailInput) emailInput.focus();
                else if (!isMessageValid && messageInput) messageInput.focus();
            }

            // Auto-hide status after 5 seconds
            if (formStatus) {
                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }

    // =============================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 5. NAVBAR SCROLL EFFECT
    // =============================================
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // =============================================
    // 6. SCROLL ANIMATIONS — INTERSECTION OBSERVER
    // =============================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // =============================================
    // 7. ACTIVE NAV LINK HIGHLIGHTING
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksDesktop = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightActiveLink = () => {
        const scrollY = window.scrollY;
        const navHeight = navbar ? navbar.offsetHeight : 0;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            if (scrollY >= sectionTop && scrollY < sectionTop + section.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksDesktop.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    if (sections.length > 0 && navLinksDesktop.length > 0) {
        window.addEventListener('scroll', highlightActiveLink, { passive: true });
        highlightActiveLink(); // Set initial state
    }
});
