/* ── Year ── */
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

/* ==========================================================================
   NAV TOGGLE
   ========================================================================== */
const navToggle = document.querySelector(".nav-toggle");
const primaryNavigation = document.querySelector(".primary-nav");

if (navToggle && primaryNavigation) {
  const setNavigationOpen = (isOpen) => {
    primaryNavigation.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú principal" : "Abrir menú principal");
  };

  navToggle.addEventListener("click", () => {
    setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigationOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavigationOpen(false);
      navToggle.focus();
    }
  });

  window.matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
    if (event.matches) setNavigationOpen(false);
  });
}

/* ==========================================================================
   CAROUSEL — Announcement Banners
   ========================================================================== */
const carouselSection = document.querySelector(".announcement-carousel");

if (carouselSection) {
  const slides = [...carouselSection.querySelectorAll(".carousel-slide")];
  const dots = [...carouselSection.querySelectorAll(".carousel-dot")];
  const prevBtn = carouselSection.querySelector(".carousel-arrow--prev");
  const nextBtn = carouselSection.querySelector(".carousel-arrow--next");
  const progressBar = carouselSection.querySelector(".carousel-progress-bar");
  const totalSlides = slides.length;
  const INTERVAL = 5500; // ms
  const TICK = 50; // ms for progress update

  let currentIndex = 0;
  let autoplayTimer = null;
  let progressTimer = null;
  let progressValue = 0;

  const goToSlide = (index) => {
    currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentIndex);
    });

    // Reset progress
    progressValue = 0;
    if (progressBar) progressBar.style.width = "0%";
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoplay = () => {
    stopAutoplay();
    progressValue = 0;

    progressTimer = setInterval(() => {
      progressValue += (TICK / INTERVAL) * 100;
      if (progressBar) progressBar.style.width = `${Math.min(progressValue, 100)}%`;
    }, TICK);

    autoplayTimer = setInterval(() => {
      nextSlide();
      progressValue = 0;
    }, INTERVAL);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
    clearInterval(progressTimer);
    autoplayTimer = null;
    progressTimer = null;
  };

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", () => { goToSlide(currentIndex - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { goToSlide(currentIndex + 1); startAutoplay(); });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.dot));
      startAutoplay();
    });
  });

  // Pause on hover
  carouselSection.addEventListener("mouseenter", stopAutoplay);
  carouselSection.addEventListener("mouseleave", startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  carouselSection.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carouselSection.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide(); else prevSlide();
      startAutoplay();
    }
  }, { passive: true });

  // Keyboard
  carouselSection.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prevSlide(); startAutoplay(); }
    if (e.key === "ArrowRight") { nextSlide(); startAutoplay(); }
  });

  // Start
  startAutoplay();
}

/* ==========================================================================
   SCROLL SPY
   ========================================================================== */
const scrollSpySections = document.querySelectorAll("#universo-honda, #soporte, #contacto");
const scrollSpyLinks = document.querySelectorAll(".primary-nav a:not(.primary-nav__cta)");

if (scrollSpySections.length && scrollSpyLinks.length && "IntersectionObserver" in window) {
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        scrollSpyLinks.forEach((link) => {
          const href = link.getAttribute("href");
          const isActive = href === `#${id}`;
          link.classList.toggle("is-current", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    });
  }, observerOptions);

  scrollSpySections.forEach((section) => observer.observe(section));
}
