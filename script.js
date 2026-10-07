// =============================================
//   LINKTREE ESTETIK - NAJA
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Tahun otomatis di footer ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Animasi staggered untuk tiap card ---
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), 400 + i * 90);
    });

    // --- Peringatan link placeholder ---
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showToast(`Ganti href pada tombol "${this.dataset.label}" dengan URL kamu`);
            }
        });
    });

    // ============================================
    //   SPACE CANVAS
    // ============================================
    const canvas = document.getElementById('spaceCanvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initStars(); });

    // ============================================
    //   BINTANG BACKGROUND
    // ============================================
    const STAR_COUNT = 280;
    let stars = [];

    function initStars() {
        stars = Array.from({ length: STAR_COUNT }, () => ({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            r:       Math.random() * 1.3 + 0.15,
            opacity: Math.random() * 0.7 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            twSpd:   Math.random() * 0.0008 + 0.0002,
            hue:     [0, 200, 240, 260][Math.floor(Math.random() * 4)],
            sat:     Math.random() > 0.55 ? 50 : 0,
        }));
    }
    initStars();

    function drawStars(time) {
        stars.forEach(s => {
            const tw = s.opacity * (0.65 + 0.35 * Math.sin(time * s.twSpd + s.twinkle));
            const col = s.sat > 0
                ? `hsla(${s.hue}, ${s.sat}%, 88%, ${tw})`
                : `rgba(255,255,255,${tw})`;
            if (s.r > 1.0) {
                ctx.shadowColor = col;
                ctx.shadowBlur  = s.r * 2.5;
            }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    // ============================================
    //   SOLAR SYSTEM
    //   Posisi: pojok kanan bawah, agak di luar panel
    // ============================================
    const getSolarX = () => canvas.width  * 0.62;
    const getSolarY = () => canvas.height * 0.60;

    // Skala orbit relatif — akan di-scale berdasarkan layar
    const getScale = () => Math.min(canvas.width, canvas.height) * 0.0032;

    // Definisi planet mengorbit matahari
    const orbiters = [
        {
            name:    'Merkurius',
            orbit:   52,
            r:       3.5,
            speed:   0.018,
            angle:   0.0,
            color:   '#b5b5b5',
            glow:    'rgba(180,180,180,0.5)',
            hasMoon: false,
        },
        {
            name:    'Venus',
            orbit:   85,
            r:       5.5,
            speed:   0.013,
            angle:   1.2,
            color:   '#e8c97e',
            glow:    'rgba(232,201,126,0.5)',
            hasMoon: false,
        },
        {
            name:    'Bumi',
            orbit:   125,
            r:       6,
            speed:   0.009,
            angle:   2.5,
            color:   '#4fa3e0',
            glow:    'rgba(79,163,224,0.5)',
            hasMoon: true,
            moon: { orbit: 14, r: 2, speed: 0.035, angle: 0, color: '#cccccc' },
        },
        {
            name:    'Mars',
            orbit:   172,
            r:       5,
            speed:   0.006,
            angle:   0.8,
            color:   '#c1440e',
            glow:    'rgba(193,68,14,0.5)',
            hasMoon: false,
        },
        {
            name:    'Jupiter',
            orbit:   240,
            r:       13,
            speed:   0.0038,
            angle:   3.8,
            color:   '#c88b3a',
            glow:    'rgba(200,139,58,0.45)',
            hasMoon: false,
            bands:   ['#c88b3a','#e4c08a','#a0622a','#d4a96a'],
        },
        {
            name:     'Saturnus',
            orbit:    320,
            r:        11,
            speed:    0.0025,
            angle:    5.1,
            color:    '#e4d191',
            glow:     'rgba(228,209,145,0.4)',
            hasMoon:  false,
            hasRing:  true,
            ringColor:'rgba(228,209,145,0.35)',
        },
        {
            name:    'Uranus',
            orbit:   395,
            r:       8,
            speed:   0.0016,
            angle:   1.9,
            color:   '#7de8e8',
            glow:    'rgba(125,232,232,0.4)',
            hasMoon: false,
        },
        {
            name:    'Neptunus',
            orbit:   460,
            r:       7.5,
            speed:   0.0011,
            angle:   4.2,
            color:   '#3f54ba',
            glow:    'rgba(63,84,186,0.4)',
            hasMoon: false,
        },
    ];

    function drawSolarSystem(time) {
        const cx = getSolarX();
        const cy = getSolarY();
        const sc = getScale();

        // Kemiringan perspektif solar system (0=flat, 0.35=agak 3D)
        const TILT = 0.38;

        // --- Matahari ---
        const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 * sc * 4);
        corona.addColorStop(0,    'rgba(255, 220, 80,  0.40)');
        corona.addColorStop(0.15, 'rgba(255, 160, 20,  0.20)');
        corona.addColorStop(0.4,  'rgba(255, 100, 10,  0.07)');
        corona.addColorStop(1,    'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, 80 * sc * 4, 0, Math.PI * 2);
        ctx.fillStyle = corona;
        ctx.fill();

        // Sun body
        const sunR = 20 * sc;
        const sunPulse = sunR * (1 + 0.018 * Math.sin(time * 0.003));
        const sunGrad = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.3, 0, cx, cy, sunPulse);
        sunGrad.addColorStop(0,   '#fff9d0');
        sunGrad.addColorStop(0.3, '#ffdd44');
        sunGrad.addColorStop(0.7, '#ff9900');
        sunGrad.addColorStop(1,   '#cc4400');
        ctx.beginPath();
        ctx.arc(cx, cy, sunPulse, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.shadowColor = 'rgba(255, 210, 60, 0.95)';
        ctx.shadowBlur  = sunR * 3;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Sun ray spikes (sinar tajam berputar)
        const rayCount = 8;
        for (let ri = 0; ri < rayCount; ri++) {
            const ra = (ri / rayCount) * Math.PI * 2 + time * 0.0004;
            const r1 = sunPulse * 1.15;
            const r2 = sunPulse * (1.5 + 0.2 * Math.sin(time * 0.002 + ri));
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ra) * r1, cy + Math.sin(ra) * r1);
            ctx.lineTo(cx + Math.cos(ra) * r2, cy + Math.sin(ra) * r2);
            ctx.strokeStyle = `rgba(255, 220, 80, ${0.10 + 0.08 * Math.sin(time * 0.0015 + ri)})`;
            ctx.lineWidth   = 1.5;
            ctx.stroke();
        }

        // --- Gambar orbit elips + planet ---
        // Urutkan planet berdasarkan sin(angle) biar yang "di belakang" digambar dulu (z-order)
        const sorted = [...orbiters].sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle));

        sorted.forEach(p => {
            const orbitR = p.orbit * sc;

            // Elips orbit (perspektif miring)
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(1, TILT);
            ctx.beginPath();
            ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.lineWidth   = 0.8;
            ctx.stroke();
            ctx.restore();

            // Update sudut orbit
            p.angle += p.speed * 0.016;

            // Posisi planet di elips perspektif
            const px = cx + Math.cos(p.angle) * orbitR;
            const py = cy + Math.sin(p.angle) * orbitR * TILT;
            const pr = p.r * sc;

            // Depth scale: planet yang "lebih jauh" (sin > 0) sedikit lebih kecil
            const depthScale = 0.85 + 0.15 * (1 - (Math.sin(p.angle) + 1) / 2);

            // Planet glow
            const pg = ctx.createRadialGradient(px, py, 0, px, py, pr * depthScale * 3.2);
            pg.addColorStop(0,   p.glow);
            pg.addColorStop(0.5, p.glow.replace(/[\d.]+\)$/, '0.10)'));
            pg.addColorStop(1,   'transparent');
            ctx.beginPath();
            ctx.arc(px, py, pr * depthScale * 3.2, 0, Math.PI * 2);
            ctx.fillStyle = pg;
            ctx.fill();

            // Planet body + rotasi di poros
            p.spinAngle = (p.spinAngle || 0) + (p.spinSpeed || 0.008);
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(p.spinAngle);

            const bodyGrad = ctx.createRadialGradient(
                -pr * depthScale * 0.3, -pr * depthScale * 0.3, 0,
                0, 0, pr * depthScale
            );
            bodyGrad.addColorStop(0,   lighten(p.color, 50));
            bodyGrad.addColorStop(0.45, p.color);
            bodyGrad.addColorStop(1,   darken(p.color, 50));
            ctx.beginPath();
            ctx.arc(0, 0, pr * depthScale, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.shadowColor = p.glow;
            ctx.shadowBlur  = pr * depthScale * 2;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Jupiter bands
            if (p.bands) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, pr * depthScale, 0, Math.PI * 2);
                ctx.clip();
                const bh = (pr * depthScale * 2) / p.bands.length;
                p.bands.forEach((bc, bi) => {
                    ctx.fillStyle = bc + '66';
                    ctx.fillRect(-pr * depthScale, -pr * depthScale + bi * bh, pr * depthScale * 2, bh);
                });
                ctx.restore();
            }

            ctx.restore(); // end spin

            // Ring Saturnus (tidak ikut spin, tetap miring)
            if (p.hasRing) {
                ctx.save();
                ctx.translate(px, py);
                ctx.rotate(-0.3);
                ctx.scale(1, 0.28);
                // Ring outer
                const ringGrad = ctx.createRadialGradient(0, 0, pr * depthScale * 1.3, 0, 0, pr * depthScale * 2.2);
                ringGrad.addColorStop(0,   'rgba(228,209,145,0.0)');
                ringGrad.addColorStop(0.3, 'rgba(228,209,145,0.40)');
                ringGrad.addColorStop(0.7, 'rgba(255,240,180,0.30)');
                ringGrad.addColorStop(1,   'rgba(228,209,145,0.0)');
                ctx.beginPath();
                ctx.arc(0, 0, pr * depthScale * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = ringGrad;
                ctx.fill();
                ctx.restore();
            }

            // Bulan Bumi
            if (p.hasMoon && p.moon) {
                const m  = p.moon;
                m.angle += m.speed * 0.016;
                const mr  = m.r * sc * depthScale;
                const mox = px + Math.cos(m.angle) * m.orbit * sc;
                const moy = py + Math.sin(m.angle) * m.orbit * sc * TILT;
                ctx.save();
                ctx.translate(px, py);
                ctx.scale(1, TILT);
                ctx.beginPath();
                ctx.arc(0, 0, m.orbit * sc, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255,255,255,0.06)';
                ctx.lineWidth   = 0.5;
                ctx.stroke();
                ctx.restore();
                ctx.beginPath();
                ctx.arc(mox, moy, mr, 0, Math.PI * 2);
                ctx.fillStyle = m.color;
                ctx.shadowColor = 'rgba(220,220,220,0.6)';
                ctx.shadowBlur  = mr * 2.5;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }

    // Helper warna
    function lighten(hex, amt) { return shiftColor(hex,  amt); }
    function darken(hex,  amt) { return shiftColor(hex, -amt); }
    function shiftColor(hex, amt) {
        const n = parseInt(hex.replace('#',''), 16);
        const r = Math.min(255, Math.max(0, (n >> 16)        + amt));
        const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
        const b = Math.min(255, Math.max(0, (n & 0xff)        + amt));
        return `rgb(${r},${g},${b})`;
    }

    // --- Shooting stars ---
    const shooters = [];
    function spawnShooter() {
        if (shooters.length >= 3) return;
        const x = Math.random() * canvas.width;
        const angle = (Math.PI / 180) * (25 + Math.random() * 30);
        shooters.push({
            x, y: 0,
            vx: Math.cos(angle) * (7 + Math.random() * 7),
            vy: Math.sin(angle) * (7 + Math.random() * 7),
            len: 90 + Math.random() * 100,
            life: 1.0,
            decay: 0.016 + Math.random() * 0.01,
            hue: [200, 220, 260, 280][Math.floor(Math.random() * 4)],
        });
    }
    setInterval(spawnShooter, 3000 + Math.random() * 3000);
    setTimeout(spawnShooter, 800);

    function drawShooters() {
        for (let i = shooters.length - 1; i >= 0; i--) {
            const s = shooters[i];
            s.x += s.vx; s.y += s.vy; s.life -= s.decay;
            if (s.life <= 0 || s.x > canvas.width + 50 || s.y > canvas.height + 50) {
                shooters.splice(i, 1); continue;
            }
            const speed = Math.hypot(s.vx, s.vy);
            const tx = s.x - (s.vx / speed) * s.len * s.life;
            const ty = s.y - (s.vy / speed) * s.len * s.life;
            const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
            grad.addColorStop(0,   `hsla(${s.hue},80%,80%,0)`);
            grad.addColorStop(0.7, `hsla(${s.hue},90%,85%,${s.life * 0.5})`);
            grad.addColorStop(1,   `hsla(${s.hue},100%,95%,${s.life * 0.9})`);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = s.life * 2;
            ctx.lineCap     = 'round';
            ctx.shadowColor = `hsla(${s.hue},100%,85%,${s.life * 0.7})`;
            ctx.shadowBlur  = 7;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.life * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue},100%,95%,${s.life})`;
            ctx.fill();
            ctx.restore();
        }
        ctx.shadowBlur = 0;
    }

    // ============================================
    //   AURORA CURSOR TRAIL
    // ============================================
    const TRAIL_LENGTH = 28;
    const TRAIL_DECAY  = 0.07;
    const trail = [];
    let mouseX  = window.innerWidth  / 2;
    let mouseY  = window.innerHeight / 2;
    let smoothX = mouseX, smoothY = mouseY;
    let isOnScreen = false;

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; isOnScreen = true; });
    document.addEventListener('mouseleave', () => { isOnScreen = false; });
    document.addEventListener('mouseenter', () => { isOnScreen = true; });

    function lerp(a, b, t) { return a + (b - a) * t; }
    const AURORA_HUES = [280, 260, 220, 190, 170, 150];

    function updateAurora(time) {
        for (let i = trail.length - 1; i >= 0; i--) {
            trail[i].life -= TRAIL_DECAY;
            if (trail[i].life <= 0) trail.splice(i, 1);
        }
        if (!isOnScreen) return;
        smoothX = lerp(smoothX, mouseX, 0.22);
        smoothY = lerp(smoothY, mouseY, 0.22);
        const idx = Math.floor((time * 0.0008) % AURORA_HUES.length);
        trail.unshift({ x: smoothX, y: smoothY, hue: AURORA_HUES[idx], hue2: AURORA_HUES[(idx+1) % AURORA_HUES.length], life: 1.0 });
        if (trail.length > TRAIL_LENGTH) trail.length = TRAIL_LENGTH;
    }

    function drawAurora() {
        if (trail.length < 2) return;
        for (let i = trail.length - 1; i >= 1; i--) {
            const p = trail[i], next = trail[i-1], t = p.life;
            if (t <= 0) continue;
            const w = t * 11 + 1.5;
            const grad = ctx.createLinearGradient(p.x, p.y, next.x, next.y);
            grad.addColorStop(0, `hsla(${p.hue},90%,70%,0)`);
            grad.addColorStop(1, `hsla(${next.hue},90%,72%,${t*0.55})`);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `hsla(${p.hue},85%,65%,${t*0.09})`;
            ctx.lineWidth = w * 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.shadowColor = `hsla(${p.hue},100%,70%,${t*0.35})`; ctx.shadowBlur = w * 1.2;
            ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = grad; ctx.lineWidth = w * 0.4;
            ctx.shadowColor = `hsla(${p.hue},100%,85%,${t*0.85})`; ctx.shadowBlur = w * 0.7;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        if (trail[0] && trail[0].life > 0) {
            const h = trail[0];
            const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 10);
            g.addColorStop(0,   `hsla(${h.hue},100%,88%,${h.life*0.7})`);
            g.addColorStop(0.5, `hsla(${h.hue},90%,72%,${h.life*0.2})`);
            g.addColorStop(1,   'transparent');
            ctx.beginPath(); ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
        }
    }

    // --- Main render loop ---
    function render(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStars(time);
        drawSolarSystem(time);
        drawShooters();
        updateAurora(time);
        drawAurora();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

});

// ============================================
//   TOAST NOTIFICATION
// ============================================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '32px', left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: 'rgba(30,20,50,0.92)', color: '#e8e0ff',
        padding: '12px 22px', borderRadius: '50px', fontSize: '0.85rem',
        fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        border: '1px solid rgba(167,139,250,0.3)',
        zIndex: '9999', opacity: '0', transition: 'all 0.3s ease',
        maxWidth: '90vw', textAlign: 'center', backdropFilter: 'blur(12px)',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
