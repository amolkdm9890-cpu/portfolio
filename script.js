// Smooth scrolling and mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e){
            const target = this.getAttribute('href');
            if(target && target.startsWith('#')){
                const el = document.querySelector(target);
                if(el){
                    e.preventDefault();
                    el.scrollIntoView({behavior:'smooth', block:'start'});
                    document.getElementById('nav-toggle')?.setAttribute('aria-expanded','false');
                    document.getElementById('primary-nav')?.classList.remove('open');
                }
            }
        });
    });

    // Mobile nav toggle
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');
    if(toggle && nav){
        toggle.addEventListener('click', function(){
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('open');
        });
    }

    // Reveal on scroll using IntersectionObserver
    const reveals = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window && reveals.length){
        reveals.forEach((el, i) => {
            // small stagger
            el.style.transitionDelay = (i * 60) + 'ms';
        });

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {threshold: 0.12});

        reveals.forEach(r => io.observe(r));
    } else {
        // fallback: show all
        reveals.forEach(r => r.classList.add('is-visible'));
    }

        // Avatar lightbox behavior
        const avatar = document.getElementById('avatar');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');

        function openLightbox(src, alt){
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        }

        function closeLightbox(){
            lightbox.setAttribute('aria-hidden','true');
            lightboxImg.src = '';
            document.body.style.overflow = '';
            avatar.focus();
        }

        if(avatar && lightbox && lightboxImg){
            avatar.addEventListener('click', () => openLightbox(avatar.src, avatar.alt));
            avatar.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(avatar.src, avatar.alt); } });
            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
            document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox(); });
        }

        // Feedback form handler removed — feedback section deleted from HTML

        // Typing effect for hero
        (function(){
            const el = document.getElementById('typed');
            if(!el) return;
            let words;
            try{ words = JSON.parse(el.getAttribute('data-words')); } catch(e){ words = [el.textContent || '']; }
            let idx = 0, char = 0, forward = true;
            const delay = 80, hold = 1300;
            function step(){
                const w = words[idx % words.length];
                if(forward){
                    char++;
                    if(char > w.length){ forward = false; setTimeout(step, hold); return; }
                } else {
                    char--;
                    if(char < 0){ forward = true; idx++; setTimeout(step, 300); return; }
                }
                el.textContent = w.slice(0, char);
                setTimeout(step, delay + (forward ? 0 : 0));
            }
            step();
        })();

        // Scroll progress bar
        (function(){
            const prog = document.getElementById('progress');
            if(!prog) return;
            function update(){
                const h = document.documentElement;
                const percent = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100 || 0;
                prog.style.width = Math.min(100, Math.max(0, percent)) + '%';
            }
            update();
            document.addEventListener('scroll', update, {passive:true});
            window.addEventListener('resize', update);
        })();

        // Project card 3D tilt
        (function(){
            const cards = document.querySelectorAll('.project-card');
            if(!cards.length) return;
            cards.forEach(card => {
                card.classList.add('tilt');
                const inner = document.createElement('div');
                inner.className = 'tilt-inner';
                // move children into inner
                while(card.firstChild){ inner.appendChild(card.firstChild); }
                card.appendChild(inner);

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                    const px = (x / rect.width) - 0.5; const py = (y / rect.height) - 0.5;
                    const rx = (-py) * 8; const ry = (px) * 8;
                    inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
                });
                card.addEventListener('mouseleave', () => { inner.style.transform = ''; });
            });
        })();

});