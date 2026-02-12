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

    // Pindahkan ke body agar tidak terpengaruh overflow hidden dari card
    // atau relative context dari slide yang punya transform
    document.body.appendChild(noBtn);

    noBtn.style.position = "fixed";
    noBtn.style.left = `${rect.left}px`;
    noBtn.style.top = `${rect.top}px`;
    noBtn.style.width = "auto"; // Reset width jika terpengaruh flex parent sebelumnya
    noBtn.classList.add("moving");
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 20;

  // Posisi saat ini
  let currentX = parseFloat(noBtn.style.left);
  let currentY = parseFloat(noBtn.style.top);

  // Jika error parsing, fallback ke rect client
  if (isNaN(currentX) || isNaN(currentY)) {
    currentX = btnRect.left;
    currentY = btnRect.top;
  }

  // Jarak lari dibatasi agar tidak kejauhan
  const maxDist = 250;
  const minDist = 50;

  // Hitung posisi baru secara random dalam radius tertentu
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * (maxDist - minDist) + minDist;

  let newX = currentX + Math.cos(angle) * distance;
  let newY = currentY + Math.sin(angle) * distance;

  // Pastikan tombol tidak keluar layar (Boundary check)
  // const padding = 20; // padding sudah dideklarasikan di atas

  // Batas Kiri & Kanan
  if (newX < padding) newX = padding;
  if (newX > viewportWidth - btnRect.width - padding) {
    newX = viewportWidth - btnRect.width - padding;
  }

  // Batas Atas & Bawah
  if (newY < padding) newY = padding;
  if (newY > viewportHeight - btnRect.height - padding) {
    newY = viewportHeight - btnRect.height - padding;
  }

  // Terapkan posisi baru
  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;

  // Samakan dengan durasi transisi CSS (300ms) agar tidak glitch
  setTimeout(() => {
    isMoving = false;
  }, 150);
}

// Logic Proximity
document.addEventListener("mousemove", (e) => {
  // Cek apakah slide 4 aktif.
  // Jika tombol sudah di body (artinya sudah pernah lari), kita tidak perlu cek slide lagi.
  const slide4 = document.getElementById("slide4");
  if (
    !slide4.classList.contains("active") &&
    !noBtn.classList.contains("moving")
  )
    return;

  if (isMoving) return;

  const btnRect = noBtn.getBoundingClientRect();
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  // Hitung jarak cursor dari pusat tombol
  const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  // Radius diperkecil agar bisa lebih dekat baru lari
  if (distance < 80) {
    moveButton();
  }
});

// Fallback events yang lebih agresif
noBtn.addEventListener("mouseenter", moveButton);
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
  noBtn.style.display = "none"; // Hide No button explicitly in case it was moved to body

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
