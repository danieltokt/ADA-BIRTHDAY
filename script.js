const dateForm = document.querySelector('#dateForm');
const dateInput = document.querySelector('#dateInput');
const errorMessage = document.querySelector('#errorMessage');
const lockScreen = document.querySelector('#lockScreen');
const birthdayScreen = document.querySelector('#birthdayScreen');
const blowButton = document.querySelector('#blowButton');
const cake = document.querySelector('#cake');
const wishMessage = document.querySelector('#wishMessage');
const musicButton = document.querySelector('#musicButton');
const music = document.querySelector('#birthdayMusic');

let audioContext;

function playBirthdayMelody() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = audioContext || new AudioContext();
  audioContext.resume();

  const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63];
  let time = audioContext.currentTime;

  notes.forEach((frequency) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.2, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.45);
    time += 0.5;
  });
}


function normalizeDate(value) {
  return value.replace(/\D/g, '');
}

dateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredDate = normalizeDate(dateInput.value);
if (enteredDate === '190926' || enteredDate === '19092026') {
    lockScreen.classList.add('hidden');
    birthdayScreen.classList.remove('hidden');
    music.play().catch(() => {
      musicButton.textContent = '♫ Включить мелодию';
    });
  } else {
    errorMessage.textContent = 'Кажется, дата неверная. Попробуй ещё раз';
    dateInput.focus();
  }
});

dateInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});

blowButton.addEventListener('click', () => {
  cake.classList.add('blown');
  blowButton.disabled = true;
  blowButton.textContent = 'Свечи задули!';
  wishMessage.textContent = 'Пусть желание обязательно сбудется! ✨';
});

var audioCtx = null;

  function getCtx(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === 'suspended'){ audioCtx.resume(); }
    return audioCtx;
  }
function playNote(ctx, freq, startTime, duration){
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
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

  function playHappyBirthday(){
    var ctx = getCtx();
    var t = ctx.currentTime + 0.1;
    var beat = 0.38; // длительность одной "доли"

    // [частота, доли]  (0 = пауза)
    var N = {G4:392.00, A4:440.00, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99};
    var seq = [
      [N.G4,0.5],[N.G4,0.5],[N.A4,1],[N.G4,1],[N.C5,1],[N.B4,2],
      [N.G4,0.5],[N.G4,0.5],[N.A4,1],[N.G4,1],[N.D5,1],[N.C5,2],
      [N.G4,0.5],[N.G4,0.5],[N.G5,1],[N.E5,1],[N.C5,1],[N.B4,1],[N.A4,2],
      [N.F5,0.5],[N.F5,0.5],[N.E5,1],[N.C5,1],[N.D5,1],[N.C5,2]
    ];

    seq.forEach(function(note){
      var freq = note[0], beats = note[1];
      var dur = beats * beat;
      playNote(ctx, freq, t, dur * 0.92);
      t += dur;
    });
  }

// Дополнительно: на телефоне можно задуть свечи лёгкой тряской.
let lastShake = 0;
window.addEventListener('devicemotion', (event) => {
  const acceleration = event.accelerationIncludingGravity;
  if (!acceleration) return;
  const force = Math.abs(acceleration.x || 0) + Math.abs(acceleration.y || 0) + Math.abs(acceleration.z || 0);
  const now = Date.now();
  if (force > 42 && now - lastShake > 1000 && !blowButton.disabled) {
    lastShake = now;
    blowButton.click();
  }
});

document.getElementById("blow").onclick = () => {
  document.getElementById("cake").classList.add("blown");
  document.getElementById("blow").remove();
  createConfetti();
};

function createConfetti() {
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = ["#e598a5", "#f6c453", "#9ac7c1", "#b59ad9"][Math.floor(Math.random() * 4)];
    piece.style.animationDelay = `${Math.random() * 0.7}s`;
    piece.style.transform = rotate(`${Math.random() * 360}deg`);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}