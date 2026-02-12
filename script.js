const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const celebration = document.getElementById("celebration");

// Fungsi untuk navigasi slide
function nextSlide(slideNumber) {
  const currentSlide = document.querySelector(".slide.active");
  const nextSlide = document.getElementById(`slide${slideNumber}`);

  // Tambahkan class untuk animasi keluar
  if (currentSlide) {
    currentSlide.classList.remove("active");
    currentSlide.classList.add("hidden");
  }

  // Tampilkan slide berikutnya
  if (nextSlide) {
    nextSlide.classList.remove("hidden");
    // Timeout kecil untuk memastikan CSS transition yang memerlukan render baru
    setTimeout(() => {
      nextSlide.classList.add("active");
    }, 10);
  }
}

// === LOGIKA BUTTON LARI (TIDAK) ===
let isMoving = false;

function moveButton() {
  if (isMoving) return;
  isMoving = true;

  // Pastikan tombol jadi 'fixed' positioning saat mulai bergerak
  if (!noBtn.classList.contains("moving")) {
    const rect = noBtn.getBoundingClientRect();
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.classList.add("moving");
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 20;

  const newX =
    Math.random() * (viewportWidth - btnRect.width - padding * 2) + padding;
  const newY =
    Math.random() * (viewportHeight - btnRect.height - padding * 2) + padding;

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;

  setTimeout(() => {
    isMoving = false;
  }, 200);
}

// Logic Proximity
document.addEventListener("mousemove", (e) => {
  // Hanya aktifkan proximity check jika slide terakhir sedang aktif
  const slide4 = document.getElementById("slide4");
  if (!slide4.classList.contains("active")) return;

  if (isMoving) return;

  const btnRect = noBtn.getBoundingClientRect();
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  if (distance < 150) {
    moveButton();
  }
});

// Fallback events
noBtn.addEventListener("mouseover", moveButton);
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveButton();
});
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveButton();
});

// === LOGIKA CELEBRATION (YA) ===
yesBtn.addEventListener("click", () => {
  // Sembunyikan container card utama
  document.querySelector(".card").style.display = "none";

  celebration.classList.remove("hidden");
  setTimeout(() => {
    celebration.classList.add("visible");
  }, 10);

  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
});

// Expose fungsi nextSlide ke global scope agar bisa dipanggil dari HTML onclick
window.nextSlide = nextSlide;
