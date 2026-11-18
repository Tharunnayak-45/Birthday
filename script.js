/**
 * =========================================================================
 * 1. STATE & INITIALIZATION (PRE-LOADED WITH ALL 5 UPLOADED PHOTOS)
 * =========================================================================
 */
const initialGalleryFrames = [
    {
        id: 'bday-photo-1',
        type: 'image',
        src: 'profile4.jpg',
        fallback: 'https://placehold.co/600x750/fdeaea/9e3f52?text=Pure+Good-Hearted+Smile',
        objectPos: 'object-top',
        caption: 'That Pure, Good-Hearted Smile 💖',
        rotation: '-rotate-2'
    },
    {
        id: 'bday-photo-2',
        type: 'image',
        src: 'profile2.jpg',
        fallback: 'https://placehold.co/600x750/fdeaea/9e3f52?text=Glowing+Inside+%26+Out',
        objectPos: 'object-top',
        caption: 'Glowing in the Golden Light ✨',
        rotation: 'rotate-1'
    },
    {
        id: 'bday-photo-3',
        type: 'image',
        src: 'profile1.jpg',
        fallback: 'https://placehold.co/600x750/fdeaea/9e3f52?text=Effortlessly+Pretty+%26+Sweet',
        objectPos: 'object-top',
        caption: 'Effortlessly Pretty & Sweet 🌸',
        rotation: '-rotate-1'
    },
    {
        id: 'bday-photo-4',
        type: 'image',
        src: 'profile5.jpg',
        fallback: 'https://placehold.co/600x750/fdeaea/9e3f52?text=Grace+%26+Warmth',
        objectPos: 'object-top',
        caption: 'Grace & Warmth in Every Frame 👑',
        rotation: 'rotate-2'
    },
    {
        id: 'bday-photo-5',
        type: 'image',
        src: 'profile3.jpg',
        fallback: 'https://placehold.co/600x750/fdeaea/9e3f52?text=Elegance+That+Shines',
        objectPos: 'object-top',
        caption: 'Traditional Elegance That Shines ✨',
        rotation: '-rotate-1'
    }
];

let galleryItems = [...initialGalleryFrames];
let candlesBlown = false;
let wishesSentCount = 1;

window.addEventListener('DOMContentLoaded', () => {
    renderGalleryGrid();
    setupGalleryDropzone();
    initAmbientBackgroundCanvas();
    initCelebrationCanvas();
});

/**
 * =========================================================================
 * 2. MAGICAL 3D ENVELOPE REVEAL + STAGGERED PARAGRAPH ANIMATION
 * =========================================================================
 */
function openBirthdayEnvelope() {
    const wrapper = document.getElementById('envelope-wrapper');
    const landingStage = document.getElementById('landing-envelope-stage');
    const contentStage = document.getElementById('birthday-content-stage');
    const heroFrame = document.getElementById('hero-portrait-frame');

    if (wrapper.classList.contains('envelope-opened')) return;

    wrapper.classList.add('envelope-opened');

    // Launch celebratory confetti & fireworks at center
    launchFireworksAndConfetti({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });

    setTimeout(() => {
        landingStage.style.opacity = '0';
        landingStage.style.transform = 'translateY(-30px) scale(0.95)';

        setTimeout(() => {
            landingStage.classList.add('hidden');
            contentStage.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Spotlight reveal animation on her featured portrait right as the seal opens
            if (heroFrame) {
                heroFrame.classList.remove('hero-spotlight-active');
                void heroFrame.offsetWidth;
                heroFrame.classList.add('hero-spotlight-active');
            }

            // Staggered reveal of each letter paragraph
            const paragraphs = document.querySelectorAll('.letter-paragraph');
            paragraphs.forEach((p, index) => {
                setTimeout(() => {
                    p.classList.add('revealed');
                }, 220 * (index + 1));
            });
        }, 520);
    }, 820);
}

/**
 * =========================================================================
 * 3. HERO PORTRAIT & BIRTHDAY GALLERY PHOTO UPLOADERS
 * =========================================================================
 */
function handleHeroPhotoUpload(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', '⚠️');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imgEl = document.getElementById('hero-photo-img');
        imgEl.src = e.target.result;

        launchFireworksAndConfetti({ clientX: window.innerWidth / 2, clientY: window.innerHeight * 0.35 });
        showToast('Honey’s featured birthday portrait updated! 👑', '✨');
    };
    reader.readAsDataURL(file);
}

function openPhotoLightbox(src, caption) {
    const modal = document.getElementById('photo-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (!modal || !img || !cap) return;

    img.src = src;
    cap.textContent = caption || 'Happy Birthday, Dear Honey ✨';
    modal.classList.remove('hidden');
}

function closePhotoLightbox(event) {
    const modal = document.getElementById('photo-lightbox-modal');
    if (!modal) return;
    if (!event || event.target === modal) {
        modal.classList.add('hidden');
    }
}

function renderGalleryGrid() {
    const grid = document.getElementById('birthday-polaroid-grid');
    if (!grid) return;
    grid.innerHTML = '';

    galleryItems.forEach((item) => {
        const card = document.createElement('div');
        card.className = `polaroid-item bg-white p-3.5 pb-5 rounded-2xl shadow-[0_12px_30px_rgba(44,34,36,0.12)] border border-amber-200/80 flex flex-col justify-between relative group ${item.rotation || ''}`;

        const deleteButton = `
            <button onclick="deleteGalleryFrame('${item.id}')" title="Remove frame"
                class="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-inkCharcoal/60 hover:text-deepRose hover:bg-rose-50 border border-amber-200 shadow-sm flex items-center justify-center text-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                ✕
            </button>
        `;

        let mediaContent = '';
        if (item.type === 'image') {
            const fallbackUrl = item.fallback || 'https://placehold.co/600x750/fdeaea/9e3f52?text=Dear+Honey';
            const safeCaption = escapeHtml(item.caption).replace(/'/g, "\\'");
            mediaContent = `
                <div onclick="openPhotoLightbox('${item.src}', '${safeCaption}')"
                     class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rose-50 border border-amber-100 cursor-pointer">
                    <img src="${item.src}" 
                         onerror="this.onerror=null; this.src='${fallbackUrl}';"
                         alt="${escapeHtml(item.caption)}" 
                         class="w-full h-full object-cover ${item.objectPos || 'object-top'} transition-transform duration-500 group-hover:scale-105">
                    <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        🔍 Zoom
                    </div>
                </div>
            `;
        } else {
            mediaContent = `
                <div onclick="uploadIntoSpecificFrame('${item.id}')"
                    class="relative w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-[#fff6f6] via-[#fdeaea] to-[#fdf4e7] border border-amber-200/80 flex flex-col items-center justify-center p-5 text-center cursor-pointer hover:brightness-98 transition-all">
                    <span class="text-4xl mb-2.5 group-hover:scale-110 transition-transform">${item.icon}</span>
                    <h4 class="font-display text-lg font-bold text-deepRose">${item.title}</h4>
                    <p class="font-serif italic text-sm text-inkCharcoal/70 mt-1">${item.subtitle}</p>
                    <span class="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-white/95 text-deepRose border border-amber-200 shadow-xs">
                        + Add Photo
                    </span>
                </div>
            `;
        }

        const captionBlock = `
            <div class="mt-3.5 px-1 text-center">
                <p contenteditable="true"
                   onblur="saveGalleryCaption('${item.id}', this.innerText)"
                   class="font-script text-xl sm:text-2xl text-inkCharcoal/90 cursor-text">
                    ${escapeHtml(item.caption)}
                </p>
                <span class="block text-[10px] text-inkCharcoal/40 mt-0.5">Tap photo to zoom • Tap caption to edit</span>
            </div>
        `;

        card.innerHTML = deleteButton + mediaContent + captionBlock;
        grid.appendChild(card);
    });
}

function handleGalleryUpload(fileList, targetFrameId = null) {
    if (!fileList || fileList.length === 0) return;

    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
        showToast('Please select valid image files (JPG, PNG, WebP).', '⚠️');
        return;
    }

    const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
    const sweetBirthdayCaptions = [
        'Prettiest birthday girl inside and out ✨',
        'Your good heart makes the world brighter 💛',
        'Celebrating your kindness and radiant smile 🎂',
        'So lucky to know someone as caring as you 🌸',
        'Happy Birthday to a truly golden soul 🥂'
    ];

    imageFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;

            if (targetFrameId && idx === 0) {
                const foundIdx = galleryItems.findIndex(item => item.id === targetFrameId);
                if (foundIdx !== -1) {
                    galleryItems[foundIdx] = {
                        ...galleryItems[foundIdx],
                        type: 'image',
                        src: dataUrl
                    };
                }
            } else {
                const placeholderIdx = galleryItems.findIndex(item => item.type === 'placeholder');
                if (placeholderIdx !== -1) {
                    galleryItems[placeholderIdx] = {
                        id: 'img-' + Date.now() + '-' + idx,
                        type: 'image',
                        src: dataUrl,
                        caption: galleryItems[placeholderIdx].caption,
                        rotation: galleryItems[placeholderIdx].rotation
                    };
                } else {
                    galleryItems.push({
                        id: 'img-' + Date.now() + '-' + idx,
                        type: 'image',
                        src: dataUrl,
                        caption: sweetBirthdayCaptions[(galleryItems.length + idx) % sweetBirthdayCaptions.length],
                        rotation: rotations[(galleryItems.length + idx) % rotations.length]
                    });
                }
            }

            renderGalleryGrid();
        };
        reader.readAsDataURL(file);
    });

    showToast(`Added ${imageFiles.length} birthday photo${imageFiles.length > 1 ? 's' : ''}!`, '📸');
}

function uploadIntoSpecificFrame(frameId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleGalleryUpload(e.target.files, frameId);
    input.click();
}

function saveGalleryCaption(id, text) {
    const item = galleryItems.find(i => i.id === id);
    if (item && text.trim()) {
        item.caption = text.trim();
    }
}

function deleteGalleryFrame(id) {
    galleryItems = galleryItems.filter(i => i.id !== id);
    if (galleryItems.length === 0) {
        galleryItems = [initialGalleryFrames[0]];
    }
    renderGalleryGrid();
}

function setupGalleryDropzone() {
    const dropzone = document.getElementById('gallery-dropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(evt => {
        dropzone.addEventListener(evt, () => {
            dropzone.classList.add('border-deepRose', 'bg-blushSoft');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, () => {
            dropzone.classList.remove('border-deepRose', 'bg-blushSoft');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files) {
            handleGalleryUpload(e.dataTransfer.files);
        }
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * =========================================================================
 * 4. INTERACTIVE BIRTHDAY CAKE: BLOW OUT CANDLES & RE-LIGHT
 * =========================================================================
 */
function blowOutCandles(event) {
    const flames = document.querySelectorAll('.candle-flame');
    const smokeGroup = document.getElementById('cake-smoke');
    const btnLabel = document.getElementById('candle-btn-label');
    const instruction = document.getElementById('wish-instruction');

    if (!candlesBlown) {
        candlesBlown = true;
        flames.forEach(f => f.classList.add('extinguished'));
        if (smokeGroup) smokeGroup.classList.remove('hidden');

        btnLabel.textContent = 'Relight Candles & Make Another Wish';
        instruction.innerHTML = '<span class="text-deepRose font-semibold">🎉 Yay! May all your sweetest birthday wishes come true, Dear Honey!</span>';

        launchFireworksAndConfetti(event);
        showToast('Happy Birthday, Honey! Your wish is on its way to the stars! 🌟', '🎂');
    } else {
        candlesBlown = false;
        flames.forEach(f => f.classList.remove('extinguished'));
        if (smokeGroup) smokeGroup.classList.add('hidden');

        btnLabel.textContent = 'Make a Wish & Blow Out Candles';
        instruction.textContent = 'Close your eyes, make a sweet birthday wish, and tap the button (or candles) to blow them out!';
    }
}

/**
 * =========================================================================
 * 5. CONFETTI, FIREWORKS & HEART BURST ENGINE
 * =========================================================================
 */
let particles = [];

function sendBirthdayHugBurst(event) {
    wishesSentCount++;
    const counterEl = document.getElementById('wishes-counter');
    if (counterEl) counterEl.textContent = wishesSentCount;

    launchFireworksAndConfetti(event);
    showToast('Warmest birthday hug & endless love sent to Honey! 🤗💖', '🎁');
}

function launchFireworksAndConfetti(event) {
    const cx = event && event.clientX ? event.clientX : window.innerWidth / 2;
    const cy = event && event.clientY ? event.clientY : window.innerHeight / 2;

    const colors = ['#f43f5e', '#fbbf24', '#ec4899', '#f59e0b', '#fb7185', '#fde047', '#ffffff'];
    const emojis = ['🎂', '💖', '✨', '🎈', '🌸', '🥂'];

    for (let i = 0; i < 65; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 8;
        particles.push({
            type: i % 5 === 0 ? 'emoji' : 'confetti',
            x: cx,
            y: cy,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 3.5,
            size: i % 5 === 0 ? (16 + Math.random() * 10) : (6 + Math.random() * 6),
            color: colors[Math.floor(Math.random() * colors.length)],
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            gravity: 0.16,
            drag: 0.98,
            alpha: 1
        });
    }
}

function initCelebrationCanvas() {
    const canvas = document.getElementById('celebration-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.alpha -= 0.012;

            if (p.alpha <= 0 || p.y > height + 40) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (p.type === 'emoji') {
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.emoji, 0, 0);
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            }
            ctx.restore();
        }

        requestAnimationFrame(loop);
    }

    loop();
}

/**
 * =========================================================================
 * 6. AMBIENT FLOATING BALLOONS, ROSE PETALS & GOLDEN SPARKLES
 * =========================================================================
 */
function initAmbientBackgroundCanvas() {
    const canvas = document.getElementById('ambient-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = Array.from({ length: 22 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 7,
        speedY: 0.35 + Math.random() * 0.65,
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        isGold: Math.random() > 0.65,
        opacity: 0.25 + Math.random() * 0.35
    }));

    const balloonColors = [
        'rgba(244, 143, 163, 0.22)',
        'rgba(235, 190, 115, 0.22)',
        'rgba(251, 182, 193, 0.24)'
    ];
    const balloons = Array.from({ length: 7 }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height,
        radiusX: 18 + Math.random() * 12,
        radiusY: 23 + Math.random() * 14,
        speedY: 0.45 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
    }));

    function animateBg() {
        ctx.clearRect(0, 0, width, height);

        balloons.forEach(b => {
            b.y -= b.speedY;
            b.wobble += 0.015;
            const drawX = b.x + Math.sin(b.wobble) * 14;

            if (b.y < -80) {
                b.y = height + 60;
                b.x = Math.random() * width;
            }

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(drawX, b.y + b.radiusY);
            ctx.quadraticCurveTo(drawX + 6, b.y + b.radiusY + 18, drawX - 3, b.y + b.radiusY + 36);
            ctx.strokeStyle = 'rgba(201, 155, 94, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.ellipse(drawX, b.y, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.angle) * 0.35;
            p.angle += p.spin;

            if (p.y > height + 20) {
                p.y = -20;
                p.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            if (p.isGold) {
                ctx.fillStyle = `rgba(229, 185, 111, ${p.opacity + 0.15})`;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = `rgba(226, 132, 150, ${p.opacity})`;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        requestAnimationFrame(animateBg);
    }

    animateBg();
}

/**
 * =========================================================================
 * 7. WEB AUDIO API "HAPPY BIRTHDAY" SOFT MUSIC BOX MELODY
 * =========================================================================
 */
let audioCtx = null;
let isMusicPlaying = false;
let melodyTimer = null;
let melodyIndex = 0;

const happyBirthdaySequence = [
    { freq: 261.63, dur: 0.45 }, // Hap-
    { freq: 261.63, dur: 0.35 }, // py
    { freq: 293.66, dur: 0.80 }, // Birth-
    { freq: 261.63, dur: 0.80 }, // day
    { freq: 349.23, dur: 0.80 }, // to
    { freq: 329.63, dur: 1.40 }, // you

    { freq: 261.63, dur: 0.45 }, // Hap-
    { freq: 261.63, dur: 0.35 }, // py
    { freq: 293.66, dur: 0.80 }, // Birth-
    { freq: 261.63, dur: 0.80 }, // day
    { freq: 392.00, dur: 0.80 }, // to
    { freq: 349.23, dur: 1.40 }, // you

    { freq: 261.63, dur: 0.45 }, // Hap-
    { freq: 261.63, dur: 0.35 }, // py
    { freq: 523.25, dur: 0.80 }, // Birth-
    { freq: 440.00, dur: 0.80 }, // day
    { freq: 349.23, dur: 0.80 }, // Dear
    { freq: 329.63, dur: 0.80 }, // Ho-
    { freq: 293.66, dur: 1.40 }, // ney

    { freq: 466.16, dur: 0.45 }, // Hap-
    { freq: 466.16, dur: 0.35 }, // py
    { freq: 440.00, dur: 0.80 }, // Birth-
    { freq: 349.23, dur: 0.80 }, // day
    { freq: 392.00, dur: 0.80 }, // to
    { freq: 349.23, dur: 1.80 }  // you!
];

function triggerMusicBoxBell(freq, duration) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const harmonic = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, now);

    const harmonicGain = audioCtx.createGain();
    harmonicGain.gain.setValueAtTime(0.15, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
}