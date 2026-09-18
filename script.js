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

musicButton.addEventListener('click', async () => {
  if (music.paused) {
    await music.play();
    musicButton.textContent = '♫ Музыка играет';
  } else {
    music.pause();
    musicButton.textContent = '♫ Включить мелодию';
  }
});

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