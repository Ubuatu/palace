// Aktif menü linkini belirle
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const current = location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('aktif');
    }
  });
});

// İletişim formu gönderim bildirimi
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.iletisim-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert("Mesajınız gönderildi! En kısa sürede size ulaşacağız.");
      form.reset();
    });
  }
});

// Hover etiket ve glow
const icon = document.querySelector('.hover-icon');
const label = document.querySelector('.hover-label');
let currentX = 0, currentY = 0;

const originX = window.innerWidth - 240;
const originY = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  if (!icon) return;

  const dx = e.clientX - originX;
  const dy = e.clientY - originY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const limitedDistance = Math.min(distance, 10);
  const angle = Math.atan2(dy, dx);

  const targetX = Math.cos(angle) * limitedDistance;
  const targetY = Math.sin(angle) * limitedDistance;

  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  icon.style.transform = `translate(${currentX}px, ${currentY}px)`;

  const glowStrength = Math.max(0, 1 - distance / 700);
  const blurSize = 20 + glowStrength * 30;
  const glowColor = `rgba(255, 140, 0, ${glowStrength * 0.35})`;

  icon.style.filter = glowStrength > 0.05
    ? `drop-shadow(0 0 ${blurSize}px ${glowColor})`
    : 'none';

  const bounds = icon.getBoundingClientRect();
  if (
    e.clientX >= bounds.left &&
    e.clientX <= bounds.right &&
    e.clientY >= bounds.top &&
    e.clientY <= bounds.bottom
  ) {
    label.style.opacity = 1;
  } else {
    label.style.opacity = 0;
  }
});

// Scroll animasyonları
const animasyonElemanlari = document.querySelectorAll('[data-animasyon="kaydir"]');
const animasyonKontrol = () => {
  animasyonElemanlari.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('aktif');
    }
  });
};
window.addEventListener('scroll', animasyonKontrol);
window.addEventListener('load', animasyonKontrol);
window.addEventListener('load', () => {
  document.querySelector('.main-header').classList.add('geldi');
});

// Parçacık animasyonu
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');
let particles = [];
let hugeParticles = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle(now) {
  const lifeSpan = 4000 + Math.random() * 6000;
  const rareHugeChance = hugeParticles < 1
    ? 1
    : (hugeParticles < 3 && Math.random() < 0.02);
  const isHuge = rareHugeChance === 1;
  if (isHuge) hugeParticles++;

  const size = isHuge
    ? 60 + Math.random() * 60
    : Math.random() < 0.05
      ? 12 + Math.random() * 4
      : 1 + Math.random() * 5;

  return {
    baseX: Math.random() * canvas.width,
    baseY: Math.random() * canvas.height,
    orbitRadius: 50 + Math.random() * 50,
    angle: Math.random() * Math.PI * 2,
    speed: 0.001 + Math.random() * 0.0002,
    radius: size,
    alpha: 0,
    lifeSpan,
    bornTime: now,
    color: ['#ffa726', '#ffcc80', '#ffb74d'][Math.floor(Math.random() * 3)],
    huge: isHuge
  };
}

function initializeParticles(count = 40) {
  const now = performance.now();
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(now));
  }
}
initializeParticles();

function animate() {
  const now = performance.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const elapsed = now - p.bornTime;
    const fadeIn = 1000;
    const fadeOut = 1000;

    if (elapsed < fadeIn) {
      p.alpha = elapsed / fadeIn;
    } else if (elapsed > p.lifeSpan - fadeOut) {
      p.alpha = Math.max(0, 1 - (elapsed - (p.lifeSpan - fadeOut)) / fadeOut);
    } else {
      p.alpha = 1;
    }

    if (elapsed > p.lifeSpan) {
      if (p.huge) hugeParticles--;
      particles[i] = createParticle(now);
      continue;
    }

    p.angle += p.speed;
    const x = p.baseX + Math.cos(p.angle) * p.orbitRadius;
    const y = p.baseY + Math.sin(p.angle) * p.orbitRadius;

    ctx.beginPath();
    ctx.globalAlpha = p.alpha;
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = p.huge ? 80 : 15;
    ctx.shadowColor = p.color;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();

// Hero yazı geçişi + çizgi + harf harf animasyon
const basliklar = [
  { h1: "Medya ve Tanıtım Hizmetleri", p: "Profesyonel video çekimleri ve tanıtım çözümleri" },
  { h1: "Marka Değerinizi Yükseltin", p: "Yaratıcı içeriklerle iz bırakın" },
  { h1: "Tanıtımda Yeni Nesil Yaklaşım", p: "Stratejik medya planlama ve uygulama" },
  { h1: "Sosyal Medya İçerikleri", p: "Kısa video, reels ve animasyon çözümleri" }
];

let aktifIndex = 0;
const heroText = document.getElementById("degisenHero");
const h1 = document.getElementById("heroBaslik");
const p = document.getElementById("heroAltYazi");

function yaziyiHarfHarfYaz(text) {
  const pElement = document.getElementById("heroAltYazi");
  pElement.innerHTML = ''; // Temizle

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');

    // Boşluk karakteri için görünür boşluk kullan
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = char;
    }

    span.style.animation = `harfGiris 0.6s forwards`;
    span.style.animationDelay = `${i * 30}ms`;
    pElement.appendChild(span);
  });
}


function heroYaziDegistir() {
  heroText.classList.remove("fade-in");
  heroText.classList.add("fade-out");

  setTimeout(() => {
    aktifIndex = (aktifIndex + 1) % basliklar.length;
    h1.textContent = basliklar[aktifIndex].h1;
    yaziyiHarfHarfYaz(basliklar[aktifIndex].p);

    heroText.classList.remove("fade-out");
    heroText.classList.add("fade-in");
  }, 400);
}

setTimeout(() => {
  heroText.classList.add("fade-in");
  yaziyiHarfHarfYaz(basliklar[0].p);
}, 300);

setInterval(heroYaziDegistir, 5000);

