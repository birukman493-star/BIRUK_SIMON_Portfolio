document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const interactables = document.querySelectorAll(
    "a, button, .btn, .project-card, .service-box, .filter-btn, .skill-item"
  );

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
  });

  const animateCursor = () => {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    cursor.style.left = `${cursorX - 20}px`;
    cursor.style.top  = `${cursorY - 20}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  interactables.forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });

  // ============================================================
  // MAGNETIC BUTTONS & SHINE EFFECT
  // ============================================================
  const magneticElements = document.querySelectorAll(".btn, .social-pill, .logo, .nav-hire-btn");

  magneticElements.forEach(el => {
    let centerX, centerY;

    if (el.classList.contains("btn") || el.classList.contains("nav-hire-btn")) {
      const shine = document.createElement("div");
      shine.classList.add("btn-shine");
      el.appendChild(shine);
    }

    el.addEventListener("mouseenter", () => {
      const rect = el.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top  + rect.height / 2;
    });

    el.addEventListener("mousemove", (e) => {
      if (!centerX || !centerY) return;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;

      if (el.classList.contains("btn") || el.classList.contains("nav-hire-btn")) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = `translate(0px, 0px)`;
      centerX = null;
      centerY = null;
    });
  });

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  const menuIcon = document.getElementById("menu-icon");
  const navMenu  = document.querySelector(".navbar ul");

  if (menuIcon && navMenu) {
    menuIcon.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = menuIcon.querySelector("i");
      icon.className = navMenu.classList.contains("open") ? "fas fa-times" : "fas fa-bars";
    });

    document.querySelectorAll(".navbar ul li a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuIcon.querySelector("i").className = "fas fa-bars";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !menuIcon.contains(e.target)) {
        navMenu.classList.remove("open");
        menuIcon.querySelector("i").className = "fas fa-bars";
      }
    });
  }

  // ============================================================
  // ACTIVE NAV ON SCROLL
  // ============================================================
  const sections = document.querySelectorAll("section[id], .home[id]");
  const navItems = document.querySelectorAll(".navbar ul li");

  const activateNav = () => {
    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });

    navItems.forEach(li => {
      li.classList.remove("active");
      if (li.querySelector("a")?.getAttribute("href") === `#${current}`) {
        li.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", activateNav);
  activateNav();

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      navbar.style.padding = "0.8rem 5%";
    } else {
      navbar.style.padding = "1.2rem 5%";
    }
  });

  // ============================================================
  // SMOOTH SCROLLING WITH LENIS
  // ============================================================
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ============================================================
  // TYPING TEXT ANIMATION
  // ============================================================
  const typingEl = document.querySelector(".typing-text");
  if (typingEl) {
    const words = [
      "Full Stack Apps",
      "React Interfaces",
      "NestJS APIs",
      "Scalable Systems",
      "Beautiful UIs",
    ];
    let wordIndex = 0;
    let charIndex  = 0;
    let isDeleting = false;

    const type = () => {
      const word = words[wordIndex];
      const displayed = isDeleting
        ? word.substring(0, charIndex--)
        : word.substring(0, charIndex++);

      typingEl.textContent = displayed;

      let speed = isDeleting ? 60 : 100;

      if (!isDeleting && charIndex === word.length + 1) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }

      setTimeout(type, speed);
    };
    type();
  }

  // ============================================================
  // SCROLL REVEAL (IntersectionObserver)
  // ============================================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Don't unobserve so it stays active
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(
    ".framer-reveal, .framer-scale, .framer-left, .project-card, .service-box, .skill-category, .timeline-item"
  ).forEach(el => observer.observe(el));

  // ============================================================
  // SKILL BAR ANIMATION ON SCROLL
  // ============================================================
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".skill-fill").forEach(fill => {
            fill.style.width = fill.style.getPropertyValue("--fill") || getComputedStyle(fill).getPropertyValue("--fill");
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".skill-category").forEach(cat => {
    // Reset widths first
    cat.querySelectorAll(".skill-fill").forEach(f => { f.style.width = "0"; });
    skillObserver.observe(cat);
  });

  // ============================================================
  // PROJECT FILTER
  // ============================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cat = card.dataset.cat || "all";
        if (filter === "all" || cat === filter) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.5s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ============================================================
  // CONTACT FORM SUBMISSION
  // ============================================================
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalHTML = submitBtn.innerHTML;
      const formData = new FormData(contactForm);

      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          submitBtn.classList.remove("loading");
          submitBtn.classList.add("success");
          submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Sent!`;
          contactForm.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        submitBtn.classList.remove("loading");
        submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error! Try again`;
        console.error(err);
      } finally {
        setTimeout(() => {
          submitBtn.classList.remove("success");
          submitBtn.innerHTML = originalHTML;
        }, 4000);
      }
    });
  }

  // ============================================================
  // RESUME BUTTON — links directly to PDF in portfolio folder
  // ============================================================
  // The resume button uses a native HTML download attribute,
  // no JS handling needed. File: "CV-Bridge Resume (1).pdf"

  // ============================================================
  // COUNTER ANIMATION for hero stats
  // ============================================================
  const counters = document.querySelectorAll(".stat-number");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.textContent);
          const suffix = el.textContent.replace(/[0-9]/g, "");
          let current = 0;
          const step = Math.ceil(target / 30);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 60);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => counterObserver.observe(c));
});
