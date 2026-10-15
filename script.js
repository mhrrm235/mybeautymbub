/* =========================================================
   SCRIPT.JS - SPESIAL ULANG TAHUN MBUB SAYANG
   Interactive Countdown, Web Audio Synth, Candle & Letter
========================================================= */

(function () {
  'use strict';

  // --- CONFIGURATION ---
  // Target: 19 Oktober 00:00:00 (Waktu Lokal)
  const currentYear = new Date().getFullYear();
  let targetDate = new Date(currentYear, 9, 19, 0, 0, 0); // Month is 0-indexed (9 = October)
  
  // If target date in current year has passed by more than 30 days, set for next year (fallback logic)
  const now = new Date();
  if (now.getTime() - targetDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
    targetDate = new Date(currentYear + 1, 9, 19, 0, 0, 0);
  }

  // DOM Elements
  const lockedState = document.getElementById('lockedState');
  const unlockedState = document.getElementById('unlockedState');

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const lockedGiftTrigger = document.getElementById('lockedGiftTrigger');
  const lockedAlert = document.getElementById('lockedAlert');
  const lockedAlertMsg = document.getElementById('lockedAlertMsg');
  const quoteText = document.getElementById('quoteText');

  const flame = document.getElementById('flame');
  const cakeElement = document.getElementById('cakeElement');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const blowBtnLabel = document.getElementById('blowBtnLabel');
  const wishResult = document.getElementById('wishResult');

  const envelope = document.getElementById('envelope');
  const envelopeSeal = document.getElementById('envelopeSeal');
  const toggleLetterBtn = document.getElementById('toggleLetterBtn');
  const letterBtnText = document.getElementById('letterBtnText');

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgMusic = document.getElementById('bgMusic');
  const launchConfettiAgain = document.getElementById('launchConfettiAgain');

  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  // Cute playful alert messages for clicking locked gift box
  const playfulAlerts = [
    "Eitss belum boleh dibuka ya Mbub sayang! 🙈 Sabar yaa, kado ini baru bisa dibuka pas tanggal 19 Oktober jam 00:00! ✨",
    "Penasaran yaa? 😜 Hitung mundurnya masih berjalan loh, tunggu sebentar lagi ya kesayangan! 💖",
    "Tangan siapa nih yang usil mau buka duluan? 🤭 Nanti kejutannya hilang lhoo! Sabar ya cintaku! 🎁",
    "Kado ini dijaga ketat oleh cinta dan gembok sakti! 🔒 Buka kembali tepat tanggal 19 Oktober ya Mbub sayang! 💕",
    "Tinggal sedikit lagi kok! Biar makin berkesan, kita tunggu detik-detik hari ulang tahunmu yaa! 🌟"
  ];
  let alertIndex = 0;

  // Rotating Romantic Quotes
  const quotesList = [
    "\"Setiap detik yang berdetak adalah bukti betapa berartinya kehadiranmu di dunia ini...\"",
    "\"Tak peduli berapa lama waktu berputar, rasa sayangku padamu selalu bertambah setiap harinya...\"",
    "\"Kamu adalah kado terindah yang pernah hadir dalam kehidupanku, Mbub sayang...\"",
    "\"Menjelang hari kelahiranmu, doa-doa terbaik selalu kulangitkan untuk kebahagiaanmu...\"",
    "\"Terima kasih sudah menjadi sosok yang selalu membuat dunia ini terasa jauh lebih indah...\""
  ];
  let quoteIndex = 0;

  // State flags
  let isCandleBlown = false;
  let isEnvelopeOpen = false;
  let countdownInterval = null;

  /* =========================================================
     1. COUNTDOWN TIMER LOGIC
  ========================================================= */
  function updateCountdown() {

    const currentTime = new Date().getTime();
    const difference = targetDate.getTime() - currentTime;

    if (difference <= 0) {
      // It's time! Unlock the birthday surprise automatically
      clearInterval(countdownInterval);
      unlockCelebration(false);
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  function checkInitialState() {
    const currentTime = new Date().getTime();
    if (currentTime >= targetDate.getTime()) {
      unlockCelebration(false);
    } else {
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    }
  }

  /* =========================================================
     2. SWITCHING TO CELEBRATION STATE (PADA TANGGAL 19 OKTOBER)
  ========================================================= */
  function unlockCelebration() {
    lockedState.classList.remove('active-state');
    lockedState.classList.add('hidden-state');

    unlockedState.classList.remove('hidden-state');
    unlockedState.classList.add('active-state');

    triggerCelebrationConfetti();
    playGentleChime();

    // Start background music
    musicPlayer.play();
  }

  /* =========================================================
     3. INTERACTIVE LOCKED GIFT BOX
  ========================================================= */
  function onLockedGiftClick() {
    const giftBox = lockedGiftTrigger.querySelector('.gift-box');
    giftBox.classList.remove('shake-box');
    void giftBox.offsetWidth; // trigger reflow
    giftBox.classList.add('shake-box');

    // Show alert banner with rotating messages
    alertIndex = (alertIndex + 1) % playfulAlerts.length;
    lockedAlertMsg.textContent = playfulAlerts[alertIndex];
    lockedAlert.classList.remove('hidden');

    playLockWiggleSound();

    setTimeout(() => {
      giftBox.classList.remove('shake-box');
    }, 600);
  }

  if (lockedGiftTrigger) {
    lockedGiftTrigger.addEventListener('click', onLockedGiftClick);
    lockedGiftTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onLockedGiftClick();
      }
    });
  }

  // Rotate Quotes periodically
  setInterval(() => {
    if (quoteText) {
      quoteText.style.opacity = '0';
      setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % quotesList.length;
        quoteText.textContent = quotesList[quoteIndex];
        quoteText.style.opacity = '1';
      }, 500);
    }
  }, 7000);

  /* =========================================================
     4. VIRTUAL CAKE & BLOW CANDLE
  ========================================================= */
  function blowCandle() {
    if (isCandleBlown) {
      // Re-light candle if already blown
      isCandleBlown = false;
      flame.classList.remove('extinguished');
      blowBtnLabel.textContent = 'Tiup Lilin Sekarang';
      wishResult.classList.add('hidden');
      return;
    }

    isCandleBlown = true;
    flame.classList.add('extinguished');
    blowBtnLabel.textContent = 'Nyalakan Lilin Lagi 🕯️';
    wishResult.classList.remove('hidden');

    triggerCandleBurst();
    playBlowingSound();
  }

  if (blowCandleBtn) blowCandleBtn.addEventListener('click', blowCandle);
  if (cakeElement) cakeElement.addEventListener('click', blowCandle);

  /* =========================================================
     5. INTERACTIVE LOVE LETTER ENVELOPE
  ========================================================= */
  function toggleEnvelope() {
    isEnvelopeOpen = !isEnvelopeOpen;
    if (isEnvelopeOpen) {
      envelope.classList.add('open');
      letterBtnText.textContent = 'Lipat Surat Kembali';
      playPaperSound();
      triggerHeartConfetti();
    } else {
      envelope.classList.remove('open');
      letterBtnText.textContent = 'Buka Surat Cinta';
    }
  }

  if (envelopeSeal) envelopeSeal.addEventListener('click', toggleEnvelope);
  if (toggleLetterBtn) toggleLetterBtn.addEventListener('click', toggleEnvelope);

  /* =========================================================
     6. POLAROID LIGHTBOX VIEWER
  ========================================================= */
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      if (img && photoLightbox) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : 'Mbub Sayang 💖';
        photoLightbox.classList.remove('hidden');
      }
    });
  });

  function closeLightbox() {
    if (photoLightbox) photoLightbox.classList.add('hidden');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* =========================================================
     7. CONFETTI CELEBRATIONS
  ========================================================= */
  function triggerCelebrationConfetti() {
    if (typeof confetti !== 'function') return;

    // Burst 1
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b8b', '#fcd34d', '#ff8e9e', '#ffffff', '#e91e63']
    });

    // Burst 2 (delayed)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fcd34d', '#ff6b8b', '#ffccd5']
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fcd34d', '#ff6b8b', '#ffccd5']
      });
    }, 400);
  }

  function triggerCandleBurst() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 70,
      spread: 80,
      startVelocity: 35,
      origin: { y: 0.5 },
      colors: ['#fcd34d', '#ffea79', '#ff8da1', '#ffffff']
    });
  }

  function triggerHeartConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 45,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#ff6b8b', '#ffccd5', '#fcd34d']
    });
  }

  if (launchConfettiAgain) {
    launchConfettiAgain.addEventListener('click', () => {
      triggerCelebrationConfetti();
    });
  }

  /* =========================================================
     8. PEMUTAR MUSIK UTAMA: JAMRUD - SELAMAT ULANG TAHUN
  ========================================================= */
  const musicPlayer = {
    isPlaying: false,
    play() {
      if (bgMusic) {
        bgMusic.volume = 0.85;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlaying = true;
            if (musicToggleBtn) musicToggleBtn.classList.add('playing');
          }).catch(err => {
            console.log('Autoplay menunggu interaksi sentuhan pengguna:', err);
          });
        }
      }
    },
    pause() {
      this.isPlaying = false;
      if (bgMusic) {
        bgMusic.pause();
      }
      if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
    },
    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  };

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      musicPlayer.toggle();
    });
  }

  // Gentle sound effects for tactile clicks
  const sfxCtx = {
    ctx: null,
    playTone(freq, duration = 0.2, gainLevel = 0.05) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!this.ctx) this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (_) {}
    }
  };

  function playLockWiggleSound() {
    sfxCtx.playTone(280, 0.15, 0.04);
  }

  function playBlowingSound() {
    sfxCtx.playTone(520, 0.3, 0.05);
    setTimeout(() => sfxCtx.playTone(680, 0.4, 0.05), 120);
  }

  function playPaperSound() {
    sfxCtx.playTone(440, 0.15, 0.03);
  }

  function playGentleChime() {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => sfxCtx.playTone(freq, 0.4, 0.04), i * 120);
    });
  }

  /* =========================================================
     9. BACKGROUND STARS & FLOATING HEARTS ON CANVAS
  ========================================================= */
  function generateStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      container.appendChild(star);
    }
  }

  // Canvas Floating Ambient Hearts
  function setupAmbientHearts() {
    const canvas = document.getElementById('heart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const hearts = [];
    const maxHearts = 22;

    class FloatingHeart {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + 30;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y < -30) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff758c';

        // Draw small heart shape
        const s = this.size / 15;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-5 * s, -10 * s, -15 * s, 0, 0, 15 * s);
        ctx.bezierCurveTo(15 * s, 0, 5 * s, -10 * s, 0, 0);
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < maxHearts; i++) {
      const h = new FloatingHeart();
      h.y = Math.random() * height; // distribute initially
      hearts.push(h);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      hearts.forEach(h => {
        h.update();
        h.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* =========================================================
     10. TAP / CLICK FLOATING HEART BURST
  ========================================================= */
  const tapContainer = document.getElementById('tapHeartsContainer');
  const heartSymbols = ['💖', '💕', '✨', '🌸', '🥰', '🌷'];

  document.addEventListener('pointerdown', (e) => {
    // Avoid spawning directly on buttons or inputs if it interferes
    if (!tapContainer) return;

    for (let i = 0; i < 3; i++) {
      const heartEl = document.createElement('div');
      heartEl.className = 'tap-heart';
      heartEl.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      heartEl.style.left = `${e.clientX + offsetX}px`;
      heartEl.style.top = `${e.clientY + offsetY}px`;
      
      const tx = (Math.random() - 0.5) * 60;
      const rot = (Math.random() - 0.5) * 45;
      heartEl.style.setProperty('--tx', `${tx}px`);
      heartEl.style.setProperty('--rot', `${rot}deg`);

      tapContainer.appendChild(heartEl);
      setTimeout(() => heartEl.remove(), 1200);
    }
  });

  /* =========================================================
     INIT
  ========================================================= */
  window.addEventListener('DOMContentLoaded', () => {
    generateStars();
    setupAmbientHearts();
    checkInitialState();
  });

  // Start audio on first user touch/click if in celebration mode
  document.addEventListener('pointerdown', () => {
    if (!musicPlayer.isPlaying && unlockedState && unlockedState.classList.contains('active-state')) {
      musicPlayer.play();
    }
  }, { once: true });

})();
