/* ==========================================================================
   RADHIKA'S BIRTHDAY WEBSITE INTERACTIVE JAVASCRIPT
   Love Story Counter, Floating Hearts Canvas, Sound Synthesizer & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. RELATIONSHIP LIVE COUNTER
  const startDate = new Date('2020-10-10T00:00:00');
  
  function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) return;
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Approximate years calculation
    const years = Math.floor(totalDays / 365.25);
    const days = Math.floor(totalDays % 365.25);
    
    document.getElementById('count-years').textContent = String(years).padStart(2, '0');
    document.getElementById('count-days').textContent = String(days).padStart(3, '0');
    document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('count-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('count-seconds').textContent = String(seconds).padStart(2, '0');
  }
  
  setInterval(updateCounter, 1000);
  updateCounter();

  // 2. FLOATING HEARTS & SPARKLES CANVAS
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particles = [];
  const maxParticles = 40;
  
  class HeartParticle {
    constructor(x, y, isBurst = false) {
      this.x = x || Math.random() * width;
      this.y = y || height + Math.random() * 20;
      this.size = Math.random() * 12 + 8;
      this.speedY = isBurst ? (Math.random() * -4 - 2) : (Math.random() * -1.2 - 0.4);
      this.speedX = isBurst ? (Math.random() * 6 - 3) : (Math.random() * 0.8 - 0.4);
      this.opacity = isBurst ? 1 : Math.random() * 0.6 + 0.2;
      this.fade = isBurst ? 0.02 : 0.002;
      this.color = ['#ff4b72', '#ff758c', '#ffd700', '#f7a8b8', '#ff1744'][Math.floor(Math.random() * 5)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = Math.random() * 0.04 - 0.02;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      this.rotation += this.rotSpeed;
      if (this.opacity <= 0 || this.y < -30) {
        this.reset();
      }
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = height + 20;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * -1.2 - 0.4;
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      
      // Draw Heart Path
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new HeartParticle());
  }
  
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
  
  // Tap/Click Heart Explosion
  window.addEventListener('click', (e) => {
    // Spawn 8 mini burst hearts at tap location
    for (let i = 0; i < 8; i++) {
      particles.push(new HeartParticle(e.clientX, e.clientY, true));
    }
  });

  // 3. WEB AUDIO ROMANTIC SOUND SYNTHESIZER
  let audioCtx = null;
  let isPlaying = false;
  let synthTimer = null;
  const musicWidget = document.getElementById('music-widget');
  const musicText = document.getElementById('music-text');
  
  // Chords in C Major / A Minor romantic progression
  const chords = [
    [261.63, 329.63, 392.00, 523.25], // C Major
    [220.00, 261.63, 329.63, 440.00], // A Minor
    [174.61, 220.00, 261.63, 349.23], // F Major
    [196.00, 246.94, 293.66, 392.00]  // G Major
  ];

  function playRomanticTone() {
    if (!isPlaying) return;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chordIndex = Math.floor(Date.now() / 4000) % chords.length;
    const currentChord = chords[chordIndex];
    const freq = currentChord[Math.floor(Math.random() * currentChord.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 3.6);
  }

  function toggleAudio() {
    if (!isPlaying) {
      isPlaying = true;
      musicWidget.classList.remove('paused');
      musicText.textContent = 'Playing Music ❤️';
      playRomanticTone();
      synthTimer = setInterval(playRomanticTone, 800);
    } else {
      isPlaying = false;
      musicWidget.classList.add('paused');
      musicText.textContent = 'Play Music 🎵';
      if (synthTimer) clearInterval(synthTimer);
    }
  }

  musicWidget.addEventListener('click', toggleAudio);

  // 4. LOVE LETTER ENVELOPE INTERACTION
  const envelope = document.getElementById('envelope-card');
  const letterPaper = document.getElementById('letter-paper');

  envelope.addEventListener('click', () => {
    envelope.style.display = 'none';
    letterPaper.classList.add('open');
    // Burst hearts on letter reveal
    for (let i = 0; i < 20; i++) {
      particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2, true));
    }
  });

  // 5. SECRET GIFT INTERACTION
  const giftContainer = document.getElementById('gift-box-container');
  const giftModal = document.getElementById('gift-modal');
  const giftClose = document.getElementById('gift-close');

  giftContainer.addEventListener('click', () => {
    giftModal.classList.add('active');
    // Massive heart & confetti explosion
    for (let i = 0; i < 50; i++) {
      particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2, true));
    }
  });

  giftClose.addEventListener('click', () => {
    giftModal.classList.remove('active');
  });

  // Candle blowing out interaction
  const cakeContainer = document.getElementById('interactive-cake');
  const cakeStatus = document.getElementById('cake-status');
  const wishBanner = document.getElementById('wish-banner');

  if (cakeContainer) {
    cakeContainer.addEventListener('click', () => {
      const flames = cakeContainer.querySelectorAll('.flame');
      flames.forEach(f => f.classList.add('extinguished'));
      if (cakeStatus) cakeStatus.innerHTML = '✨ Blow Out Complete! Your wish is on its way to heaven ❤️';
      if (wishBanner) wishBanner.style.display = 'block';

      // Confetti burst
      for (let i = 0; i < 30; i++) {
        particles.push(new HeartParticle(window.innerWidth / 2, window.innerHeight / 2, true));
      }
    });
  }

  // Global Coupon Claim Function
  window.claimCoupon = function(card) {
    card.classList.add('claimed');
    const badge = card.querySelector('.claim-badge');
    if (badge) {
      badge.innerHTML = 'CLAIMED BY RADHIKA ❤️';
    }
    // Mini heart burst at coupon position
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      particles.push(new HeartParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, true));
    }
  };

  // 6. PHOTO GALLERY LIGHTBOX
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img').src;
      const title = card.querySelector('.polaroid-caption').textContent;
      const desc = card.getAttribute('data-desc') || 'A precious memory with Radhika Rajput ❤️';
      
      lightboxImg.src = img;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // 7. SCROLL INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.timeline-item, .polaroid-card, .glass-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
