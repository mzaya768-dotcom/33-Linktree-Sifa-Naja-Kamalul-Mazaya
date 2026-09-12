// =============================================
//   LINKTREE ESTETIK — NAJA
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Tahun otomatis di footer ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Animasi staggered untuk tiap card ---
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, i) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 400 + i * 90);
    });

    // --- Peringatan link placeholder ---
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                showToast(`Ganti href pada tombol "${this.dataset.label}" dengan URL kamu 🌸`);
            }
        });
    });

});

// --- Toast notification ---
function showToast(message) {
    // Hapus toast yang ada sebelumnya
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Style inline supaya toast jalan tanpa tambahan CSS
    Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '32px',
        left:         '50%',
        transform:    'translateX(-50%) translateY(20px)',
        background:   'rgba(74, 55, 40, 0.9)',
        color:        '#f5ede8',
        padding:      '12px 22px',
        borderRadius: '50px',
        fontSize:     '0.85rem',
        fontFamily:   "'DM Sans', sans-serif",
        letterSpacing:'0.02em',
        boxShadow:    '0 8px 24px rgba(0,0,0,0.15)',
        zIndex:       '9999',
        opacity:      '0',
        transition:   'all 0.3s ease',
        maxWidth:     '90vw',
        textAlign:    'center',
        backdropFilter: 'blur(10px)',
    });

    document.body.appendChild(toast);

    // Masuk
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Keluar setelah 3 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
