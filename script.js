document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
        // Navbar morph logic
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: '.navbar' }
        });

        // Hero initial stagger reveal
        const tlHero = gsap.timeline();
        tlHero.to(".title-sans", { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 })
            .to(".title-serif", { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.6")
            .to(".hero-subtitle", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
            .to(".hero-ctas", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");

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

        setInterval(() => {
            let last = order.pop();
            order.unshift(last);
            updateShuffler();
        }, 3000); // cycle every 3s
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
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // start position artificially outside card
            tl.set(cursor, { x: 250, y: 300 })
                // Move cursor into target day
                .to(cursor, {
                    x: () => targetDay.offsetLeft + targetDay.offsetWidth / 2,
                    y: () => targetDay.offsetTop + targetDay.offsetHeight / 2,
                    duration: 1.5, ease: "power2.inOut"
                })
                // Click push down
                .to(cursor, { scale: 0.85, duration: 0.1 })
                // Click up and mark active
                .to(cursor, { scale: 1, duration: 0.1, onComplete: () => targetDay.classList.add('active') })
                // Move cursor to Save button
                .to(cursor, {
                    x: () => saveBtn.offsetLeft + saveBtn.offsetWidth / 2,
                    y: () => saveBtn.offsetTop + saveBtn.offsetHeight / 2,
                    duration: 1.2, ease: "power2.inOut", delay: 0.4
                })
                // Click Save button
                .to(cursor, { scale: 0.85, duration: 0.1, onStart: () => saveBtn.classList.add('hovered') })
                .to(cursor, { scale: 1, duration: 0.1, onComplete: () => saveBtn.classList.remove('hovered') })
                // Fade out cursor
                .to(cursor, { opacity: 0, duration: 0.5, delay: 0.6 })
                // Reset
                .set(targetDay, { className: 'day active-target' })
                .set(cursor, { opacity: 1, x: 250, y: 300 });
        });
    }

});
