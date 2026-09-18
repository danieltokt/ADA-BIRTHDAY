const dateForm = document.querySelector('#dateForm');
const dateInput = document.querySelector('#dateInput');
const errorMessage = document.querySelector('#errorMessage');
const lockScreen = document.querySelector('#lockScreen');
const birthdayScreen = document.querySelector('#birthdayScreen');
const blowButton = document.querySelector('#blowButton');
const cake = document.querySelector('#cake');
const wishMessage = document.querySelector('#wishMessage');

/* ================= МЕЛОДИЯ "С ДНЁМ РОЖДЕНИЯ" — играет по кругу ================= */
var audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }
  return audioCtx;
}

function playNote(ctx, freq, startTime, duration) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function playHappyBirthday() {
  const ctx = getCtx();
  let t = ctx.currentTime + 0.1;
  const beat = 0.38;

  const N = { G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const seq = [
    [N.G4, 0.5], [N.G4, 0.5], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
    [N.G4, 0.5], [N.G4, 0.5], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
    [N.G4, 0.5], [N.G4, 0.5], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 2],
    [N.F5, 0.5], [N.F5, 0.5], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2]
  ];

  let totalBeats = 0;
  seq.forEach(([freq, beats]) => {
    const dur = beats * beat;
    playNote(ctx, freq, t, dur * 0.92);
    t += dur;
    totalBeats += beats;
  });

  // через паузу после окончания мотива запускаем мелодию заново — бесконечный цикл
  const totalDurationMs = totalBeats * beat * 1000 + 900;
  setTimeout(playHappyBirthday, totalDurationMs);
}

/* ================= ПРОВЕРКА ДАТЫ ================= */
function normalizeDate(value) {
  return value.replace(/\D/g, '');
}

dateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredDate = normalizeDate(dateInput.value);

  if (enteredDate === '190907' || enteredDate === '19092007') {
    lockScreen.classList.add('hidden');
    birthdayScreen.classList.remove('hidden');
    document.body.classList.remove('locked');
    playHappyBirthday();
  } else {
    errorMessage.textContent = 'Кажется, дата неверная. Попробуй ещё раз';
    dateInput.focus();
  }
});

dateInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});

/* ================= ТОРТ И СВЕЧИ ================= */
function blowOutCandles() {
  if (cake.classList.contains('blown')) return;
  cake.classList.add('blown');
  blowButton.disabled = true;
  blowButton.textContent = 'Свечи задули!';
  wishMessage.textContent = 'Пусть желание обязательно сбудется! ✨';
  createFireworks();
}

blowButton.addEventListener('click', blowOutCandles);

/* ================= ФЕЙЕРВЕРКИ (canvas) ================= */
function createFireworks() {
  let canvas = document.getElementById('fireworksCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '30';
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx2d = canvas.getContext('2d');

  const colors = ['#e598a5', '#f6c453', '#9ac7c1', '#b59ad9', '#ffffff', '#ffd36e'];
  let particles = [];
  function spawnBurst(x, y) {
    const count = 45;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2
      });
    }
  }

  const launches = 5;
  for (let i = 0; i < launches; i++) {
    setTimeout(() => {
      const x = canvas.width * (0.2 + Math.random() * 0.6);
      const y = canvas.height * (0.2 + Math.random() * 0.4);
      spawnBurst(x, y);
    }, i * 350);
  }

  let frame = 0;
  const maxFrames = 260;

  function animate() {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // гравитация
      p.alpha -= 0.012;
      ctx2d.globalAlpha = Math.max(p.alpha, 0);
      ctx2d.fillStyle = p.color;
      ctx2d.beginPath();
      ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx2d.fill();
    });
    particles = particles.filter((p) => p.alpha > 0);
    frame++;

    if (frame < maxFrames || particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      canvas.remove();
    }
  }
  animate();
}

/* ================= ТРЯСКА ТЕЛЕФОНА ================= */
let lastShake = 0;

function handleShake(event) {
  const acceleration = event.accelerationIncludingGravity;
  if (!acceleration) return;
  const force = Math.abs(acceleration.x || 0) + Math.abs(acceleration.y || 0) + Math.abs(acceleration.z || 0);
  const now = Date.now();
  if (force > 42 && now - lastShake > 1000 && !blowButton.disabled) {
    lastShake = now;
    blowOutCandles();
  }
}

dateForm.addEventListener('submit', () => {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then((state) => {
      if (state === 'granted') window.addEventListener('devicemotion', handleShake);
    }).catch(() => {});
  } else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleShake);
  }
});