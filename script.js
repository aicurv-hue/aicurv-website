document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ── HERO INTRO ─────────────────────────────────────────
    gsap.timeline()
        .to(".title-sans",    { y: 0, opacity: 1, duration: 1,   ease: "power4.out", delay: 0.1 })
        .to(".title-serif",   { y: 0, opacity: 1, duration: 1,   ease: "power4.out" }, "-=0.6")
        .to(".hero-subtitle", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(".hero-ctas",     { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
    // ── END HERO INTRO ─────────────────────────────────────

    let ctx = gsap.context(() => {
        // Navbar morph logic
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: '.navbar' }
        });

        // Hero Parallax
        gsap.to(".hero-bg img", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: "30%",
            ease: "none"
        });

        // Philosophy Parallax bg
        gsap.to(".philosophy-img", {
            scrollTrigger: {
                trigger: ".philosophy",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            ease: "none"
        });

        // Philosophy Text Reveal
        gsap.from(".phil-ask, .phil-question", {
            scrollTrigger: {
                trigger: ".philosophy",
                start: "top 65%"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Stats bar reveal + counter animation
        gsap.from(".stats-bar", {
            scrollTrigger: { trigger: ".stats-bar", start: "top 80%" },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });

        document.querySelectorAll(".stat-number").forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: function () {
                            el.textContent = Math.round(this.targets()[0].val);
                        }
                    });
                }
            });
        });

        // Features intro reveal
        gsap.from(".features-intro", {
            scrollTrigger: {
                trigger: ".features",
                start: "top 75%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // FAQ reveal
        gsap.from(".faq-header", {
            scrollTrigger: { trigger: ".faq", start: "top 75%" },
            y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
        });
        gsap.from(".faq-item", {
            scrollTrigger: { trigger: ".faq-list", start: "top 80%" },
            y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out"
        });

        // Contact section reveal
        gsap.from(".contact-text", {
            scrollTrigger: { trigger: ".contact", start: "top 70%" },
            x: -40, opacity: 0, duration: 0.9, ease: "power3.out"
        });
        gsap.from(".contact-form", {
            scrollTrigger: { trigger: ".contact", start: "top 70%" },
            x: 40, opacity: 0, duration: 0.9, ease: "power3.out"
        });

        // How It Works reveal
        gsap.from(".hiw-header", {
            scrollTrigger: { trigger: ".how-it-works", start: "top 70%" },
            y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
        });

        gsap.from(".hiw-step", {
            scrollTrigger: { trigger: ".hiw-steps", start: "top 75%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
            onComplete() {
                document.querySelectorAll('.hiw-step').forEach(s => s.classList.add('animated'));
            }
        });

        // Feature cards scroll reveal
        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: ".features",
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });

        // Pricing cards scroll reveal
        gsap.from(".price-card", {
            scrollTrigger: {
                trigger: ".membership",
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });

        // Protocol - Sticky Stacking Archive
        const protocolSection = document.getElementById('protocol');
        const cards = gsap.utils.toArray(".stack-card");

        // Give the container some height so we can scroll through the pinned items safely.
        protocolSection.style.height = `${cards.length * 100}vh`;

        cards.forEach((card, i) => {
            const innerNode = card.querySelector('.card-inner');

            // If it's not the last card, we make it shrink and blur when the NEXT card comes into view.
            if (i < cards.length - 1) {
                gsap.to(innerNode, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top top",      // when this card hits top
                        end: "+=100%",         // over the next 100vh of scroll
                        scrub: true,
                        pinSpacing: false
                    },
                    scale: 0.9,
                    filter: "blur(20px)",
                    opacity: 0.5,
                    transformOrigin: "center top"
                });
            }
        });
    }); // end GSAP Context

    // --- Interactive Micro-UI Dashboard Components ---

    // 1. Workflow Intelligence Shuffler Card
    const shufflerItems = document.querySelectorAll('.shuffle-item');
    if (shufflerItems.length > 0) {
        let order = [0, 1, 2];
        function updateShuffler() {
            shufflerItems.forEach((item, index) => {
                const pos = order.indexOf(index);
                item.style.zIndex = order.length - pos;
                item.style.transform = `translateY(${pos * 15}px) scale(${1 - pos * 0.05})`;
                item.style.opacity = 1 - pos * 0.2;
            });
        }
        updateShuffler();

        const shufflerInterval = setInterval(() => {
            let last = order.pop();
            order.unshift(last);
            updateShuffler();
        }, 3000); // cycle every 3s

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(shufflerInterval);
        });
    }

    // Scroll Progress Bar
    const scrollBar = document.getElementById('scroll-progress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            scrollBar.style.transform = `scaleX(${pct})`;
        }, { passive: true });
    }

    // Magnetic Buttons
    function initMagneticButtons() {
        const STRENGTH = 0.38;
        document.querySelectorAll('.btn-clay, .btn-nav').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
            });

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) * STRENGTH;
                const dy = (e.clientY - (rect.top + rect.height / 2)) * STRENGTH;
                btn.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease';
                btn.style.transform = 'translate(0px, 0px)';
                btn.addEventListener('transitionend', () => { btn.style.transition = ''; }, { once: true });
            });
        });
    }

    // Card Hover Tilt
    function initCardTilt() {
        const MAX_TILT    = 10;
        const PERSPECTIVE = 900;
        const LIFT        = 10;

        document.querySelectorAll('.feature-card, .price-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
                const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
                card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease';
                card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${-ny * MAX_TILT}deg) rotateY(${nx * MAX_TILT}deg) translateZ(${LIFT}px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease';
                card.style.transform  = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            });
        });
    }

    if (window.matchMedia('(hover: hover)').matches) {
        initMagneticButtons();
        initCardTilt();
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formSuccess = document.getElementById('formSuccess');

        const validate = () => {
            let valid = true;
            const fields = [
                { id: 'fname', msg: 'Name is required.' },
                { id: 'femail', msg: 'A valid email is required.', email: true },
                { id: 'fgoal', msg: 'Please describe what you want to build.' }
            ];
            fields.forEach(({ id, msg, email }) => {
                const el = document.getElementById(id);
                const errEl = el.closest('.form-field').querySelector('.field-error');
                const val = el.value.trim();
                const isInvalid = !val || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
                el.classList.toggle('error', isInvalid);
                errEl.textContent = isInvalid ? msg : '';
                if (isInvalid) valid = false;
            });
            return valid;
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate()) return;
            // Simulate send (replace with real endpoint later)
            const btn = contactForm.querySelector('.form-submit');
            btn.disabled = true;
            btn.querySelector('.submit-label').textContent = 'Sending…';
            setTimeout(() => {
                contactForm.reset();
                btn.disabled = false;
                btn.querySelector('.submit-label').textContent = 'Send Message';
                formSuccess.classList.add('visible');
                setTimeout(() => formSuccess.classList.remove('visible'), 5000);
            }, 1200);
        });

        // Clear errors on input
        contactForm.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('error');
                el.closest('.form-field').querySelector('.field-error').textContent = '';
            });
        });
    }

    // 0. Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (hamburger && mobileMenu) {
        const toggleMenu = (open) => {
            hamburger.classList.toggle('open', open);
            mobileMenu.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };

        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            toggleMenu(!isOpen);
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(false);
        });
    }

    // 2. AI Execution Stream Telemetry Typewriter
    const telemetryEl = document.querySelector('.telemetry-text');
    if (telemetryEl) {
        const messages = [
            "Deploying workflow automation…",
            "Processing data pipelines…",
            "Launching AI module…",
            "Optimizing operational efficiency…",
            "Scaling infrastructure nodes…"
        ];
        let msgIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentMsg = messages[msgIdx];
            if (isDeleting) {
                telemetryEl.textContent = currentMsg.substring(0, charIdx - 1);
                charIdx--;
            } else {
                telemetryEl.textContent = currentMsg.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 30 : 60;

            if (!isDeleting && charIdx === currentMsg.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                msgIdx = (msgIdx + 1) % messages.length;
                typeSpeed = 500;
            }
            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 1000);
    }

    // 3. Protocol Scheduler Mock Cursor
    const cursor = document.querySelector('.mock-cursor');
    const targetDay = document.querySelector('.active-target');
    const saveBtn = document.querySelector('.btn-mock-save');

    if (cursor && targetDay && saveBtn) {
        gsap.context(() => {
            // Cache layout reads once to avoid forced reflow on every animation repeat
            const dayX = targetDay.offsetLeft + targetDay.offsetWidth / 2;
            const dayY = targetDay.offsetTop + targetDay.offsetHeight / 2;
            const btnX = saveBtn.offsetLeft + saveBtn.offsetWidth / 2;
            const btnY = saveBtn.offsetTop + saveBtn.offsetHeight / 2;

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // start position artificially outside card
            tl.set(cursor, { x: 250, y: 300 })
                // Move cursor into target day
                .to(cursor, {
                    x: dayX,
                    y: dayY,
                    duration: 1.5, ease: "power2.inOut"
                })
                // Click push down
                .to(cursor, { scale: 0.85, duration: 0.1 })
                // Click up and mark active
                .to(cursor, { scale: 1, duration: 0.1, onComplete: () => targetDay.classList.add('active') })
                // Move cursor to Save button
                .to(cursor, {
                    x: btnX,
                    y: btnY,
                    duration: 1.2, ease: "power2.inOut", delay: 0.4
                })
                // Click Save button
                .to(cursor, { scale: 0.85, duration: 0.1, onStart: () => saveBtn.classList.add('hovered') })
                .to(cursor, { scale: 1, duration: 0.1, onComplete: () => saveBtn.classList.remove('hovered') })
                // Fade out cursor
                .to(cursor, { opacity: 0, duration: 0.5, delay: 0.6 })
                // Reset
                .call(() => {
                    targetDay.classList.remove('active');
                    targetDay.className = 'day active-target';
                })
                .set(cursor, { opacity: 1, x: 250, y: 300 });
        });
    }

});
