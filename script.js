/**
 * script.js — Paranthaman V Portfolio
 *
 * Credentials are loaded at runtime from config.js (gitignored).
 * See config.example.js for the expected structure.
 *
 * Features:
 *  - EmailJS contact form (v4 SDK)
 *  - Navbar: scroll-shadow + active-link highlight via IntersectionObserver
 *  - Hamburger menu toggle
 *  - Scroll-reveal animations (IntersectionObserver)
 *  - Staggered badge fade-in
 *  - prefers-reduced-motion respected throughout
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────
       1. EMAIL JS INIT
    ───────────────────────────────────────── */
    const emailConfig = {
        publicKey: "7av7b7PCjwMqfR-W7",
        serviceId: "service_e0ejijj",
        templateId: "template_51qwl25"
    };

    emailjs.init({ publicKey: emailConfig.publicKey });


    /* ─────────────────────────────────────────
       2. NAVBAR — SCROLL SHADOW
    ───────────────────────────────────────── */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
    }, { passive: true });


    /* ─────────────────────────────────────────
       3. HAMBURGER MENU
    ───────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on any nav-link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });


    /* ─────────────────────────────────────────
       4. ACTIVE NAV LINK (IntersectionObserver)
    ───────────────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => navObserver.observe(s));


    /* ─────────────────────────────────────────
       5. DETECT prefers-reduced-motion
    ───────────────────────────────────────── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ─────────────────────────────────────────
       6. SCROLL REVEAL
    ───────────────────────────────────────── */
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-card').forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Immediately show everything when motion is reduced
        document.querySelectorAll('.reveal, .reveal-card').forEach(el => {
            el.classList.add('revealed');
        });
    }


    /* ─────────────────────────────────────────
       7. STAGGERED BADGE FADE-IN
    ───────────────────────────────────────── */
    if (!prefersReducedMotion) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const badges = entry.target.querySelectorAll('.badge');
                badges.forEach((badge, i) => {
                    setTimeout(() => {
                        badge.classList.remove('badge-hidden');
                        badge.classList.add('badge-revealed');
                    }, i * 80);
                });

                badgeObserver.unobserve(entry.target);
            });
        }, { threshold: 0.25 });

        // Mark badges as hidden initially, then observe their parent rows
        const badgeRows = document.querySelectorAll(
            '.badge-row, .skills-badges, .about-badges'
        );

        badgeRows.forEach(row => {
            row.querySelectorAll('.badge').forEach(b => b.classList.add('badge-hidden'));
            badgeObserver.observe(row);
        });
    }


    /* ─────────────────────────────────────────
       8. CONTACT FORM — EmailJS
    ───────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return; // safety guard

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const config = emailConfig;
        if (!config || !config.publicKey) {
            showStatus('error', '⚠️ Configuration error. Email me directly: paranthaman2107@gmail.com');
            return;
        }

        // ── Loading state ──
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
        clearStatus();

        const formData = new FormData(form);

        try {
            await emailjs.send(
                config.serviceId,
                config.templateId,
                {
                    from_name: formData.get('name'),
                    reply_to: formData.get('email'),
                    message: formData.get('message')
                }
            );

            showStatus('success', '✅ Message sent! I\'ll get back to you soon.');
            form.reset();

        } catch (err) {
            console.error('[EmailJS]', err);
            showStatus('error', '❌ Something went wrong. Please email me directly at paranthaman2107@gmail.com');

        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
    });

    function showStatus(type, msg) {
        formStatus.textContent = msg;
        formStatus.className = `form-status-${type}`;
        formStatus.style.display = 'block';
    }

    function clearStatus() {
        formStatus.textContent = '';
        formStatus.className = '';
        formStatus.style.display = 'none';
    }

});
