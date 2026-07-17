document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

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

const heroCards = [...document.querySelectorAll("[data-hero-card]")];
const heroImages = [...document.querySelectorAll("[data-hero-image]")];
const heroCardGroup = document.querySelector(".hero-cards");
const heroSection = document.querySelector(".cinematic-hero");

if (heroCards.length && heroImages.length && heroCardGroup && heroSection) {
  const touchMode = window.matchMedia("(hover: none), (pointer: coarse)");
  const mobileCarousel = window.matchMedia("(max-width: 820px)");

  const showHeroImage = (key = "default") => {
    const hasActiveBackground = key !== "default";

    heroImages.forEach((image) => {
      image.classList.toggle("is-active", image.dataset.heroImage === key);
    });

    heroCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.heroCard === key);
    });

    heroSection.classList.toggle("has-active-background", hasActiveBackground);
  };

  heroCards.forEach((card) => {
    const activate = () => showHeroImage(card.dataset.heroCard);
    card.addEventListener("mouseenter", activate);
    card.addEventListener("focusin", activate);
    card.addEventListener("pointerdown", () => {
      if (touchMode.matches) activate();
    });
  });

  heroCardGroup.addEventListener("mouseleave", () => showHeroImage());
  heroCardGroup.addEventListener("focusout", (event) => {
    if (!heroCardGroup.contains(event.relatedTarget)) showHeroImage();
  });

  if (mobileCarousel.matches) {
    const sequence = ["autos", "motos", "power"]
      .map((key) => heroCards.find((card) => card.dataset.heroCard === key));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = -1;
    let scrollFrame = 0;
    let autoplayIndex = 0;
    let autoplayTimer = 0;
    let userHasInteracted = false;

    const centerCard = (index, behavior = "smooth") => {
      if (index === activeIndex) return;
      activeIndex = index;
      const card = sequence[index];
      heroCardGroup.scrollTo({
        left: card.offsetLeft - (heroCardGroup.clientWidth - card.offsetWidth) / 2,
        behavior: reducedMotion.matches ? "auto" : behavior,
      });
      showHeroImage(card.dataset.heroCard);
    };

    const stopAutoplay = () => {
      userHasInteracted = true;
      window.clearInterval(autoplayTimer);
    };

    const updateScrollSequence = () => {
      scrollFrame = 0;
      const start = heroSection.offsetTop;
      const distance = Math.max(1, heroSection.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(0.999, (window.scrollY - start) / distance));
      const index = Math.min(sequence.length - 1, Math.floor(progress * sequence.length));

      if (window.scrollY >= start - 2 && window.scrollY <= start + distance + 2) {
        centerCard(index);
      }
    };

    window.addEventListener("scroll", () => {
      stopAutoplay();
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollSequence);
    }, { passive: true });

    heroCardGroup.addEventListener("pointerdown", stopAutoplay, { passive: true });
    heroCardGroup.addEventListener("touchstart", stopAutoplay, { passive: true });

    requestAnimationFrame(() => {
      centerCard(0, "auto");

      if (!reducedMotion.matches) {
        autoplayTimer = window.setInterval(() => {
          if (userHasInteracted) return;
          autoplayIndex = (autoplayIndex + 1) % sequence.length;
          centerCard(autoplayIndex);
        }, 4200);
      }
    });
  }
}

// Scroll spy for navbar links
const scrollSpySections = document.querySelectorAll("#lineas-honda, #soporte, #contacto");
const scrollSpyLinks = document.querySelectorAll(".primary-nav a:not(.primary-nav__cta)");

if (scrollSpySections.length && scrollSpyLinks.length && 'IntersectionObserver' in window) {
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px", // Trigger when section occupies the main viewport region
    threshold: 0
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

