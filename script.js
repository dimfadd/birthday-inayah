/* Kejutan ulang tahun ke-26 Inayah — 24 Oktober 2026
 * Tes sebelum hari-H: buka dengan ?preview di akhir link (contoh: .../birthday-inayah/?preview)
 * Mau pakai lagu sendiri? Taruh file mp3 di assets/lagu.mp3 — kalau tidak ada, dipakai melodi bawaan.
 */
(() => {
  const BIRTH = new Date('2000-10-24T00:00:00+07:00');
  const PARTY = new Date('2026-10-24T00:00:00+07:00'); // tengah malam WIB
  const preview = new URLSearchParams(location.search).has('preview');

  const $ = (s) => document.querySelector(s);
  const fire = (opts) => { if (window.confetti) window.confetti(opts); };

  /* ---------- pindah adegan ---------- */
  let current = null;
  function show(id) {
    if (current) current.classList.remove('active');
    current = document.getElementById(id);
    current.classList.add('active');
    if (current.classList.contains('scroll')) current.scrollTop = 0;
  }

  /* ---------- latar: bintang & balon ---------- */
  const sky = $('.sky');
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 60 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    sky.appendChild(s);
  }
  const balloonColors = ['#ff6b86', '#ffd36e', '#1bbc9b', '#9b7bff', '#ff9eb5', '#5ec8ff', '#f08a5d'];
  function startBalloons(count) {
    const box = $('.balloons');
    box.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const b = document.createElement('i');
      b.className = 'balloon';
      b.style.left = Math.random() * 95 + '%';
      b.style.background = balloonColors[i % balloonColors.length];
      const scale = 0.7 + Math.random() * 0.6;
      b.style.width = 46 * scale + 'px';
      b.style.height = 58 * scale + 'px';
      b.style.animationDuration = 9 + Math.random() * 8 + 's';
      b.style.animationDelay = -Math.random() * 15 + 's';
      box.appendChild(b);
    }
  }
  startBalloons(6);

  /* ---------- musik ---------- */
  let ctx = null;
  let songEl = null;
  let synthTimer = null;
  let muted = false;
  const musicBtn = $('#musicBtn');

  function audioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Melodi "Happy Birthday" (catatan, ketukan)
  const G4 = 392, A4 = 440, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
  const MELODY = [
    [G4, .75], [G4, .25], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
    [G4, .75], [G4, .25], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
    [G4, .75], [G4, .25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2],
    [F5, .75], [F5, .25], [E5, 1], [C5, 1], [D5, 1], [C5, 3],
  ];
  function playSynth() {
    const ac = audioCtx();
    const beat = 0.42;
    let t = ac.currentTime + 0.1;
    const master = ac.createGain();
    master.gain.value = 0.18;
    master.connect(ac.destination);
    playSynth.master = master;
    for (const [f, d] of MELODY) {
      const dur = d * beat;
      for (const [mult, type, vol] of [[1, 'triangle', 1], [2, 'sine', 0.25]]) {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = f * mult;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + dur);
      }
      t += dur;
    }
    const total = (t - ac.currentTime + 1.2) * 1000;
    synthTimer = setTimeout(() => { if (!muted) playSynth(); }, total);
  }

  function startMusic() {
    musicBtn.classList.remove('hidden');
    songEl = new Audio('assets/lagu.mp3');
    songEl.loop = true;
    songEl.volume = 0.7;
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      songEl = null;
      if (!muted) playSynth();
    };
    songEl.addEventListener('error', fallback, { once: true });
    songEl.play().catch(fallback);
  }

  musicBtn.addEventListener('click', () => {
    muted = !muted;
    musicBtn.textContent = muted ? '🔇' : '🔊';
    if (songEl) { muted ? songEl.pause() : songEl.play(); return; }
    if (muted) {
      clearTimeout(synthTimer);
      if (playSynth.master) playSynth.master.gain.value = 0;
    } else {
      playSynth();
    }
  });

  /* ---------- efek ---------- */
  function burst() {
    fire({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
    setTimeout(() => fire({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 } }), 250);
    setTimeout(() => fire({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 } }), 400);
  }
  function fireworks(ms) {
    const end = Date.now() + ms;
    (function tick() {
      fire({
        particleCount: 60, startVelocity: 32, spread: 360, ticks: 70, gravity: 0.9,
        origin: { x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.35 },
        colors: [balloonColors[(Math.random() * balloonColors.length) | 0], '#ffffff'],
      });
      if (Date.now() < end) setTimeout(tick, 380);
    })();
  }
  function hearts() {
    if (!window.confetti || !confetti.shapeFromText) return burst();
    const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });
    fire({ shapes: [heart], scalar: 2, particleCount: 40, spread: 120, origin: { y: 0.55 } });
  }

  /* ---------- 0. hitung mundur ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  function tickCountdown() {
    const left = PARTY - Date.now();
    if (left <= 0) {
      fire({ particleCount: 200, spread: 160, origin: { y: 0.5 } });
      show('s-gift');
      return;
    }
    const h = Math.floor(left / 3.6e6);
    const m = Math.floor((left % 3.6e6) / 6e4);
    const s = Math.floor((left % 6e4) / 1000);
    $('#cd-h').textContent = pad(h);
    $('#cd-m').textContent = pad(m);
    $('#cd-s').textContent = pad(s);
    setTimeout(tickCountdown, 250);
  }

  /* ---------- 1. kado ---------- */
  $('#gift').addEventListener('click', function () {
    if (this.classList.contains('open')) return;
    this.classList.add('open');
    audioCtx();
    startMusic();
    burst();
    startBalloons(18);
    setTimeout(() => show('s-cake'), 1400);
  }, { passive: true });

  /* ---------- 2. tiup lilin ---------- */
  const cake = $('#cake');
  let blown = false;
  let micStream = null;

  function blowOut() {
    if (blown) return;
    blown = true;
    cake.classList.remove('wind');
    cake.classList.add('blown');
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    $('#blowRow').classList.add('hidden');
    $('#micHint').textContent = '';
    $('#cakeText').innerHTML = 'Yeaay! Semoga doanya terkabul 🤲<br>Selamat ulang tahun yang ke-26, sayang!';
    fireworks(5000);
    setTimeout(() => $('#toCard').classList.remove('hidden'), 1500);
  }

  $('#tapBlowBtn').addEventListener('click', blowOut);
  $('.candles').addEventListener('click', blowOut);

  $('#micBtn').addEventListener('click', async () => {
    const hint = $('#micHint');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      hint.textContent = 'Mic tidak tersedia, ketuk lilinnya aja yaa';
      return;
    }
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      hint.textContent = 'Izin mic ditolak, ketuk lilinnya aja yaa 🙂';
      return;
    }
    hint.textContent = 'Tiup ke arah mic HP-nya… fuuuh 🌬️';
    const ac = audioCtx();
    const src = ac.createMediaStreamSource(micStream);
    const an = ac.createAnalyser();
    an.fftSize = 1024;
    src.connect(an);
    const buf = new Float32Array(an.fftSize);
    let strong = 0;
    (function listen() {
      if (blown) return;
      an.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      cake.classList.toggle('wind', rms > 0.08);
      strong = rms > 0.15 ? strong + 1 : Math.max(0, strong - 1);
      if (strong > 12) return blowOut();
      requestAnimationFrame(listen);
    })();
  });

  /* ---------- 3. kartu ---------- */
  $('#toCard').addEventListener('click', () => show('s-card'));
  $('#flip').addEventListener('click', function () {
    this.classList.toggle('flipped');
    if (this.classList.contains('flipped')) hearts();
  });

  /* ---------- 4. angka ---------- */
  function countUp(el, target) {
    const start = performance.now();
    const dur = 1800;
    (function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  $('#toStats').addEventListener('click', () => {
    show('s-stats');
    const ms = Date.now() - BIRTH;
    const values = {
      years: 26,
      days: Math.floor(ms / 864e5),
      hours: Math.floor(ms / 36e5),
      beats: Math.round((ms / 6e4) * 80),
    };
    document.querySelectorAll('.stat .num').forEach((el) => countUp(el, values[el.dataset.key]));
  });

  /* ---------- 5. 26 doa ---------- */
  const WISHES = [
    'Sehat selalu, jiwa & raga',
    'Panjang umur & penuh berkah',
    'Rezeki lancar dan luas',
    'Hati yang selalu tenang',
    'Senyum yang ga pernah hilang',
    'Semua doamu dikabulkan Allah',
    'Dimudahkan setiap urusan',
    'Kerjaan lancar & makin sukses',
    'Keluarga selalu sehat & rukun',
    'Dikelilingi orang-orang baik',
    'Makin sabar (sama aku juga 😆)',
    'Makin dewasa dan bijak',
    'Mimpi-mimpimu satu per satu tercapai',
    'Tidur nyenyak tiap malam',
    'Selalu percaya sama diri sendiri',
    'Dijauhkan dari hal-hal buruk',
    'Banyak jalan-jalan seru tahun ini',
    'Selalu cantik luar dalam',
    'Makin dekat sama Allah',
    'Diberi kekuatan di hari yang berat',
    'Banyak tawa, sedikit air mata',
    'Selalu dikelilingi cinta',
    'Hubungan kita makin kuat',
    'Sayang aku terus yaa 🥺',
    'Bahagia, setiap hari',
    'Umur 26 jadi tahun terbaikmu ✨',
  ];
  const wishBox = $('#wishes');
  let opened = 0;
  WISHES.forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'wish';
    b.innerHTML = `<span class="heart">💖<small>#${i + 1}</small></span><span class="text">${w}</span>`;
    b.addEventListener('click', () => {
      if (b.classList.contains('open')) return;
      b.classList.add('open');
      opened++;
      $('#wishCount').textContent = opened;
      const r = b.getBoundingClientRect();
      fire({
        particleCount: 25, spread: 60, startVelocity: 20, ticks: 60,
        origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight },
      });
      if (opened === WISHES.length) {
        burst();
        $('#toEnd').classList.remove('hidden');
        $('#toEnd').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    wishBox.appendChild(b);
  });
  $('#toWishes').addEventListener('click', () => show('s-wishes'));

  // jangan bikin dia nunggu terlalu lama: tombol lanjut muncul setelah 10 doa dibuka
  wishBox.addEventListener('click', () => {
    if (opened >= 10) $('#toEnd').classList.remove('hidden');
  });

  /* ---------- 6. penutup ---------- */
  $('#toEnd').addEventListener('click', () => {
    show('s-end');
    hearts();
    fireworks(4000);
  });
  $('#moreConfetti').addEventListener('click', () => { burst(); hearts(); });
  $('#replay').addEventListener('click', () => location.reload());

  /* ---------- mulai ---------- */
  if (!preview && Date.now() < PARTY) {
    show('s-countdown');
    tickCountdown();
  } else {
    show('s-gift');
  }
})();
