// Data constants
const NAV_LINKS = [
  { name: 'Все туры', href: '#tours' },
  { name: 'О нас', href: '#promo' },
  { name: 'Галерея', href: '#gallery' },
  { name: 'Контакты', href: '#cta' },
];

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Озеро Брайес',
    location: 'Италия',
    image: 'images/braes.jpg'
  },
  {
    id: 2,
    title: 'Долина Гейзеров',
    location: 'Исландия',
    image: 'images/islandia.jpg'
  },
  {
    id: 3,
    title: 'Гора Фудзи',
    location: 'Япония',
    image: 'images/fydzi.jpg'
  },
  {
    id: 4,
    title: 'Пустыня Вади-Рам',
    location: 'Иордания',
    image: 'images/vadiRam.jpg'
  }
];

const TOURS_DATA = [
  {
    id: 1,
    name: 'Альпийские луга',
    image: 'images/braes.jpg',
    category: 'Треккинг',
  },
  {
    id: 2,
    name: 'Норвежские фьорды',
    image: 'images/vadiRam.jpg',
    category: 'Каякинг',
  },
  {
    id: 3,
    name: 'Ледники Исландии',
    image: 'images/islandia.jpg',
    category: 'Экспедиция',
  },
  {
    id: 4,
    name: 'Горы Шотландии',
    image: 'images/fydzi.jpg',
    category: 'Хайкинг',
  },
];

const GALLERY_IMAGES = [
  'images/gal1.jpg',
  'images/gal2.jpg',
  'images/gal3.jpg',
  'images/gal4.jpg',
  'images/gal5.jpg',
  'images/gal6.jpg',
  'images/gal7.jpg',
];

// Global variables
let currentSlideIndex = 0;
let heroInterval;
let isHeroPaused = false;
let currentGalleryIndex = 0;
let galleryImages = [];

// DOM elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const heroImage = document.getElementById('hero-image');
const heroTitle = document.getElementById('hero-title');
const heroLocation = document.getElementById('hero-location');
const heroIndicators = document.getElementById('hero-indicators');
const heroProgress = document.getElementById('hero-progress');
const toursGrid = document.getElementById('tours-grid');
const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightboxBtn = document.getElementById('close-lightbox');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const ctaForm = document.getElementById('cta-form');
const currentYear = document.getElementById('current-year');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeHero();
  initializeMobileMenu();
  initializeTours();
  initializeGallery();
  initializeForm();
  initializeIntersectionObserver();
  initializeYear();
  initializeHeroAnimations();
  initializeTourCardsAnimation();

  // Start hero slideshow
  startHeroSlideshow();
});

// Header scroll effect
window.addEventListener('scroll', function() {
  if (window.scrollY > 10) {
    header.classList.add('bg-[#11161A]/80', 'backdrop-blur-sm');
    header.classList.remove('bg-transparent');
  } else {
    header.classList.remove('bg-[#11161A]/80', 'backdrop-blur-sm');
    header.classList.add('bg-transparent');
  }
});

// Mobile menu functionality
function initializeMobileMenu() {
  mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.remove('translate-x-full');
  });

  closeMobileMenuBtn.addEventListener('click', function() {
    closeMobileMenu();
  });

  // Close mobile menu when clicking outside
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on scroll
  window.addEventListener('scroll', function() {
    if (!mobileMenu.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking on menu items
  const menuItems = mobileMenu.querySelectorAll('a');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  mobileMenu.classList.add('translate-x-full');
}

// Hero slideshow functionality
function initializeHero() {
  // Create indicators
  HERO_SLIDES.forEach((slide, index) => {
    const indicator = document.createElement('button');
    indicator.className = `flex items-center gap-3 group cursor-pointer ${index === 0 ? 'active-indicator' : 'inactive-indicator'}`;
    indicator.onclick = () => goToSlide(index);

    const number = document.createElement('span');
    number.className = `text-sm font-bold transition-colors duration-300 ${index === 0 ? 'text-[#20D6C9]' : 'text-[#90A0A8] group-hover:text-white'}`;
    number.textContent = `0${slide.id}`;

    indicator.appendChild(number);
    heroIndicators.appendChild(indicator);
  });

  // Set initial slide
  updateHeroSlide();
}

function startHeroSlideshow() {
  heroInterval = setInterval(() => {
    if (!isHeroPaused) {
      nextSlide();
    }
  }, 6000);
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % HERO_SLIDES.length;
  updateHeroSlide();
}

function goToSlide(index) {
  currentSlideIndex = index;
  updateHeroSlide();
}

function updateHeroSlide() {
  const slide = HERO_SLIDES[currentSlideIndex];

  // Update background image with fade effect
  heroImage.style.opacity = '0';
  setTimeout(() => {
    heroImage.style.backgroundImage = `url(${slide.image})`;
    heroImage.style.opacity = '1';
  }, 150);

  // Update title and location with smooth transition
  // Fade out current text with longer duration
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(-30px)';
  heroLocation.style.opacity = '0';
  heroLocation.style.transform = 'translateY(-30px)';

  setTimeout(() => {
    // Change text content
    heroTitle.textContent = slide.title;
    heroLocation.textContent = slide.location;

    // Fade in new text with longer duration
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
    heroLocation.style.opacity = '1';
    heroLocation.style.transform = 'translateY(0)';
  }, 600);

  // Update indicators with smooth transition
  const indicators = heroIndicators.children;
  for (let i = 0; i < indicators.length; i++) {
    const number = indicators[i].querySelector('span');
    const indicator = indicators[i];

    setTimeout(() => {
      if (i === currentSlideIndex) {
        number.classList.remove('text-[#90A0A8]', 'group-hover:text-white');
        number.classList.add('text-[#20D6C9]');
        indicator.classList.add('active-indicator');
        indicator.classList.remove('inactive-indicator');
      } else {
        number.classList.remove('text-[#20D6C9]');
        number.classList.add('text-[#90A0A8]', 'group-hover:text-white');
        indicator.classList.add('inactive-indicator');
        indicator.classList.remove('active-indicator');
      }
    }, i * 100); // Staggered animation with smaller delay
  }

  // Update progress bar with smooth animation
  const targetPosition = currentSlideIndex * 100;
  const currentPosition = parseFloat(heroProgress.style.transform?.replace('translateY(', '').replace('%)', '') || '0');

  // Smooth transition from current to target position
  const duration = 800; // ms
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const newPosition = currentPosition + (targetPosition - currentPosition) * easeOutCubic;

    heroProgress.style.transform = `translateY(${newPosition}%)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Pause hero slideshow on hover
document.getElementById('hero').addEventListener('mouseenter', () => {
  isHeroPaused = true;
});

document.getElementById('hero').addEventListener('mouseleave', () => {
  isHeroPaused = false;
});

// Tours functionality
function initializeTours() {
  TOURS_DATA.forEach((tour, index) => {
    const tourCard = document.createElement('div');
    tourCard.className = `relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4] transition-all duration-300 hover:shadow-2xl hover:shadow-[#20D6C9]/10 hover:-translate-y-2 bounce-in bounce-delay-${index + 1}`;

    tourCard.innerHTML = `
      <img src="${tour.image}" alt="${tour.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute top-4 left-4">
        <span class="bg-[#141A1F]/70 backdrop-blur-sm text-[#20D6C9] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">${tour.category}</span>
      </div>
      <div class="absolute bottom-0 left-0 p-6 text-white">
        <h3 class="text-xl font-bold">${tour.name}</h3>
      </div>
    `;

    toursGrid.appendChild(tourCard);
  });
}

// Gallery functionality
function initializeGallery() {
  const galleryItems = [
    { img: GALLERY_IMAGES[0], class: 'md:col-span-2 md:row-span-2' },
    { img: GALLERY_IMAGES[1], class: 'md:row-span-2' },
    { img: GALLERY_IMAGES[2], class: '' },
    { img: GALLERY_IMAGES[3], class: 'md:row-span-2' },
    { img: GALLERY_IMAGES[4], class: 'col-span-2 md:col-span-4' },
    { img: GALLERY_IMAGES[5], class: 'md:col-span-2' },
    { img: GALLERY_IMAGES[6], class: 'md:col-span-2' },
  ];

  galleryImages = galleryItems.map(item => item.img);

  galleryItems.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = `rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 gallery-fade-in gallery-delay-${index + 1} ${item.class}`;
    galleryItem.onclick = () => openLightbox(index);

    galleryItem.innerHTML = `
      <img
        src="${item.img}"
        alt="Gallery image ${index + 1}"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    `;

    galleryGrid.appendChild(galleryItem);
  });
}

function openLightbox(index) {
  currentGalleryIndex = index;
  lightboxImage.src = galleryImages[currentGalleryIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showNextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  lightboxImage.src = galleryImages[currentGalleryIndex];
}

function showPrevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[currentGalleryIndex];
}

// Lightbox event listeners
closeLightboxBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// Close lightbox on background click
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  }
});

// Form functionality
function initializeForm() {
  // Populate tour select options
  const tourSelect = document.getElementById('tour-select');
  TOURS_DATA.forEach(tour => {
    const option = document.createElement('option');
    option.value = tour.name;
    option.textContent = tour.name;
    tourSelect.appendChild(option);
  });

  // Form submission
  ctaForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(ctaForm);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // In a real application, you would send this data to a server
    alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
    ctaForm.reset();
  });
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px'
  });

  // Observe all animated elements
  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-up, .slide-up-delay, .slide-in-left, .slide-in-right, .slide-in-right-delay, .bounce-in, .gallery-fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Set current year in footer
function initializeYear() {
  currentYear.textContent = new Date().getFullYear();
}

// Initialize tour cards and gallery animations on page load
function initializeTourCardsAnimation() {
  setTimeout(() => {
    const tourCards = document.querySelectorAll('.bounce-in');
    tourCards.forEach(card => {
      card.style.animationPlayState = 'running';
    });

    // Also initialize gallery animations
    setTimeout(() => {
      const galleryCards = document.querySelectorAll('.gallery-fade-in');
      galleryCards.forEach(card => {
        card.style.animationPlayState = 'running';
      });
    }, 500); // Additional delay for gallery
  }, 1000); // Longer delay for smooth sequential effect
}

// Initialize hero text animations on page load
function initializeHeroAnimations() {
  // Set initial styles for smooth animations
  const heroTitle = document.getElementById('hero-title');
  const heroLocation = document.getElementById('hero-location');

  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
  }

  if (heroLocation) {
    heroLocation.style.opacity = '0';
    heroLocation.style.transform = 'translateY(30px)';
  }

  setTimeout(() => {
    // Left line animation
    const leftLine = document.querySelector('.slide-in-left');
    if (leftLine) {
      leftLine.classList.add('visible');
    }

    // Hero title animation
    setTimeout(() => {
      if (heroTitle) {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }
    }, 300);

    // Hero location animation
    setTimeout(() => {
      if (heroLocation) {
        heroLocation.style.opacity = '1';
        heroLocation.style.transform = 'translateY(0)';
      }
    }, 600);

    // Right indicators animation
    const rightIndicators = document.querySelector('.slide-in-right');
    setTimeout(() => {
      if (rightIndicators) {
        rightIndicators.classList.add('visible');
      }
    }, 400);

    // Right progress line animation
    const rightLine = document.querySelector('.slide-in-right-delay');
    setTimeout(() => {
      if (rightLine) {
        rightLine.classList.add('visible');
      }
    }, 700);
  }, 500);
}
