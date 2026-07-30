/* ==================================================================
   BOXIE_E — SCRIPT.JS
   ================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------------------------------------------
     1. LOADING ANIMATION
     Sembunyikan loader setelah halaman selesai dimuat.
  ---------------------------------------------------------------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("is-hidden"), 400);
  });
  // Fallback in case 'load' fires slowly / already fired
  setTimeout(() => loader.classList.add("is-hidden"), 2000);

  /* ----------------------------------------------------------------
     2. NAVBAR: efek solid saat scroll + shadow
  ---------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll);

  /* ----------------------------------------------------------------
     3. SCROLL PROGRESS INDICATOR
  ---------------------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress);

  /* ----------------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ---------------------------------------------------------------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const navMenu = document.getElementById("navMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const navLinks = document.querySelectorAll("[data-link]");

  function openMobileMenu() {
    burgerBtn.classList.add("is-active");
    navMenu.classList.add("is-active");
    mobileOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu() {
    burgerBtn.classList.remove("is-active");
    navMenu.classList.remove("is-active");
    mobileOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    navMenu.classList.contains("is-active") ? closeMobileMenu() : openMobileMenu();
  });
  mobileOverlay.addEventListener("click", closeMobileMenu);

  // Menu otomatis tertutup setelah link dipilih (mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) closeMobileMenu();
    });
  });

  /* ----------------------------------------------------------------
     5. SMOOTH SCROLL untuk seluruh anchor link
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.getElementById("navbar").offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    });
  });

  /* ----------------------------------------------------------------
     6. SCROLL SPY: menu aktif mengikuti section yang sedang dibuka
  ---------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinkMap = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    navLinkMap[id] = link;
  });

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = navLinkMap[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((section) => spyObserver.observe(section));

  /* ----------------------------------------------------------------
     7. FADE UP ANIMATION saat section muncul (scroll reveal)
  ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------------
     8. BACK TO TOP BUTTON
  ---------------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------------------------------------------------------------
     9. TESTIMONIAL SLIDER (auto-play + dots navigation)
  ---------------------------------------------------------------- */
  const track = document.getElementById("testimonialTrack");
  const dotsWrap = document.getElementById("testimonialDots");
  const slides = track ? Array.from(track.children) : [];
  let currentSlide = 0;
  let sliderInterval;

  if (track && slides.length) {
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d) => d.classList.remove("is-active"));
      dots[currentSlide].classList.add("is-active");
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function startAutoplay() {
      sliderInterval = setInterval(nextSlide, 4500);
    }
    function stopAutoplay() {
      clearInterval(sliderInterval);
    }

    startAutoplay();

    const sliderWrap = document.querySelector(".testimonial-slider");
    sliderWrap.addEventListener("mouseenter", stopAutoplay);
    sliderWrap.addEventListener("mouseleave", startAutoplay);
  }

  /* ----------------------------------------------------------------
     10. PRODUCT "LIHAT DETAIL" BUTTON — arahkan ke WhatsApp
  ---------------------------------------------------------------- */
  const productModal = document.getElementById("productModal");
  const productModalOverlay = document.getElementById("productModalOverlay");
  const productModalClose = document.getElementById("productModalClose");
  const productModalImage = document.getElementById("productModalImage");
  const productModalName = document.getElementById("productModalName");
  const productModalDesc = document.getElementById("productModalDesc");
  const productModalPrice = document.getElementById("productModalPrice");
  const productModalOrder = document.getElementById("productModalOrder");

  function openProductModal(btn) {
    const name = btn.getAttribute("data-product");
    const image = btn.getAttribute("data-image");
    const price = btn.getAttribute("data-price");
    const desc = btn.getAttribute("data-desc");

    productModalImage.src = image;
    productModalImage.alt = name;
    productModalName.textContent = name;
    productModalDesc.textContent = desc;
    productModalPrice.textContent = price;

    const waMessage = encodeURIComponent(`Halo BOXIE_E, saya tertarik dengan produk "${name}". Boleh minta info lebih lanjut?`);
    productModalOrder.href = `https://wa.me/+6282279395684?text=${waMessage}`;

    productModal.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    productModal.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-product]").forEach((btn) => {
    btn.addEventListener("click", () => openProductModal(btn));
  });

  productModalOverlay.addEventListener("click", closeProductModal);
  productModalClose.addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });

  /* ----------------------------------------------------------------
     11. CONTACT FORM SUBMIT (client-side, tanpa backend)
  ---------------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Mohon lengkapi semua kolom.";
      return;
    }

    // Arahkan pesan ke WhatsApp sebagai fallback tanpa backend
    const waMessage = encodeURIComponent(`Halo BOXIE_E, saya ${name} (${email}).\n\n${message}`);
    window.open(`https://wa.me/+6282279395684?text=${waMessage}`, "_blank");

    formStatus.style.color = "#e0272b";
    formStatus.textContent = "Pesan kamu sedang diarahkan ke WhatsApp...";
    contactForm.reset();
  });

  /* ----------------------------------------------------------------
     12. FOOTER YEAR (dinamis)
  ---------------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
