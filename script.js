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

  // ============================================================
  // THEME TOGGLE (DARK / LIGHT MODE)
  // ============================================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");

  const applyTheme = (theme) => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
    localStorage.setItem("portfolio_theme", theme);
  };

  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  applyTheme(savedTheme);

  const toggleTheme = () => {
    const isLight = document.body.classList.contains("light-theme");
    applyTheme(isLight ? "dark" : "light");
  };

  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);

  // ============================================================
  // READING SCROLL PROGRESS BAR & BACK TO TOP BUTTON
  // ============================================================
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================================
  // SPOTLIGHT SITE SEARCH (MODAL & CMD+K)
  // ============================================================
  const searchModalBackdrop = document.getElementById("searchModalBackdrop");
  const navSearchBtn = document.getElementById("navSearchBtn");
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const searchModalClose = document.getElementById("searchModalClose");
  const siteSearchInput = document.getElementById("siteSearchInput");
  const searchResultsContainer = document.getElementById("searchResultsContainer");
  const quickTags = document.querySelectorAll(".quick-tag");

  // Search items database compiled from the portfolio content
  const searchableIndex = [
    { title: "Apple-Inspired E-Commerce", cat: "Project", desc: "Full-stack e-commerce with React, Node.js, Express, MySQL & admin dashboard.", link: "#projects", icon: "fa-shopping-bag" },
    { title: "AI Web Security Analyzer", cat: "Project", desc: "FastAPI & React AI vulnerability scanner for code, URLs, and SSL certificates.", link: "#projects", icon: "fa-shield-alt" },
    { title: "Student Registration System", cat: "Project", desc: "Full-stack school management system with Node.js, Express & MySQL.", link: "#projects", icon: "fa-graduation-cap" },
    { title: "Portfolio Website", cat: "Project", desc: "Responsive personal portfolio with glassmorphism, animations & smooth scroll.", link: "#projects", icon: "fa-laptop-code" },
    { title: "React.js & Next.js", cat: "Skill", desc: "Modern frontend frameworks, component architecture, hooks & SSR.", link: "#skills", icon: "fa-react" },
    { title: "NestJS & Node.js", cat: "Skill", desc: "Enterprise scalable backend architecture, TypeScript, REST APIs.", link: "#skills", icon: "fa-server" },
    { title: "FastAPI & Python", cat: "Skill", desc: "High-performance Python backend APIs for AI and security services.", link: "#skills", icon: "fa-python" },
    { title: "MySQL & MongoDB", cat: "Skill", desc: "Relational and document database design, querying, and optimization.", link: "#skills", icon: "fa-database" },
    { title: "Full Stack Development", cat: "Service", desc: "End-to-end web apps with React + NestJS / Node.js & clean architecture.", link: "#services", icon: "fa-layer-group" },
    { title: "Web & UI/UX Design", cat: "Service", desc: "Responsive, high-converting Figma prototypes and intuitive interfaces.", link: "#services", icon: "fa-palette" },
    { title: "Code Review & Debugging", cat: "Service", desc: "Performance audits, security reviews, and refactoring clean code.", link: "#services", icon: "fa-bug" },
    { title: "Jimma University", cat: "Experience", desc: "4th-year Software Engineering student, Jimma, Ethiopia.", link: "#experience", icon: "fa-university" },
    { title: "Freelance Developer", cat: "Experience", desc: "Independent and Upwork full-stack web application development.", link: "#experience", icon: "fa-briefcase" },
    { title: "Download Resume", cat: "Action", desc: "Download Biruk Simon's latest updated PDF resume.", link: "Biruk_Simon_Resume.pdf", icon: "fa-download" },
    { title: "Contact / Hire Me", cat: "Contact", desc: "Get in touch for freelance projects and full-time opportunities.", link: "#contact", icon: "fa-envelope" }
  ];

  let activeResultIndex = -1;

  const openSearchModal = () => {
    if (!searchModalBackdrop) return;
    searchModalBackdrop.classList.add("active");
    setTimeout(() => siteSearchInput && siteSearchInput.focus(), 100);
    renderSearchResults(siteSearchInput ? siteSearchInput.value : "");
  };

  const closeSearchModal = () => {
    if (!searchModalBackdrop) return;
    searchModalBackdrop.classList.remove("active");
    if (siteSearchInput) siteSearchInput.value = "";
    activeResultIndex = -1;
  };

  const renderSearchResults = (query = "") => {
    if (!searchResultsContainer) return;
    const cleanQuery = query.trim().toLowerCase();
    
    let matches = searchableIndex;
    if (cleanQuery.length > 0) {
      matches = searchableIndex.filter(item => 
        item.title.toLowerCase().includes(cleanQuery) ||
        item.desc.toLowerCase().includes(cleanQuery) ||
        item.cat.toLowerCase().includes(cleanQuery)
      );
    }

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          <i class="fas fa-search-minus"></i>
          <p>No results found for "${query}"</p>
          <span style="font-size:0.8rem; color:var(--text-muted)">Try searching "React", "NestJS", "Projects", or "Resume"</span>
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = matches.map((item, idx) => `
      <a href="${item.link}" class="search-result-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
        <div class="search-result-icon"><i class="fas ${item.icon}"></i></div>
        <div class="search-result-info">
          <div class="search-result-title">
            <span>${item.title}</span>
            <span class="search-result-category">${item.cat}</span>
          </div>
          <div class="search-result-desc">${item.desc}</div>
        </div>
        <i class="fas fa-chevron-right" style="font-size:0.75rem; color:var(--text-muted)"></i>
      </a>
    `).join("");

    activeResultIndex = 0;

    // Attach click events to close modal upon selection
    searchResultsContainer.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        closeSearchModal();
      });
    });
  };

  if (navSearchBtn) navSearchBtn.addEventListener("click", openSearchModal);
  if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", openSearchModal);
  if (searchModalClose) searchModalClose.addEventListener("click", closeSearchModal);

  if (searchModalBackdrop) {
    searchModalBackdrop.addEventListener("click", (e) => {
      if (e.target === searchModalBackdrop) closeSearchModal();
    });
  }

  // Quick Tags
  quickTags.forEach(tag => {
    tag.addEventListener("click", () => {
      const q = tag.dataset.query || tag.textContent;
      if (siteSearchInput) {
        siteSearchInput.value = q;
        siteSearchInput.focus();
        renderSearchResults(q);
      }
    });
  });

  // Search input typing
  if (siteSearchInput) {
    siteSearchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });

    siteSearchInput.addEventListener("keydown", (e) => {
      const items = searchResultsContainer ? searchResultsContainer.querySelectorAll(".search-result-item") : [];
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        items[activeResultIndex]?.classList.remove("selected");
        activeResultIndex = (activeResultIndex + 1) % items.length;
        items[activeResultIndex]?.classList.add("selected");
        items[activeResultIndex]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[activeResultIndex]?.classList.remove("selected");
        activeResultIndex = (activeResultIndex - 1 + items.length) % items.length;
        items[activeResultIndex]?.classList.add("selected");
        items[activeResultIndex]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[activeResultIndex]) {
          items[activeResultIndex].click();
        }
      }
    });
  }

  // Keyboard shortcut: Ctrl + K / Cmd + K to open search, Esc to close
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (searchModalBackdrop && searchModalBackdrop.classList.contains("active")) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === "Escape") {
      if (searchModalBackdrop && searchModalBackdrop.classList.contains("active")) {
        closeSearchModal();
      }
    }
  });

  // ============================================================
  // INTERACTIVE COPY BUTTONS (Snippet & Contact Email)
  // ============================================================
  const copyCodeSnippetBtn = document.getElementById("copyCodeSnippetBtn");
  if (copyCodeSnippetBtn) {
    copyCodeSnippetBtn.addEventListener("click", () => {
      const codeSnippet = `const developer = {
  name: "Biruk Simon",
  role: "Full Stack Dev",
  skills: ["React", "NestJS", "Node.js", "TypeScript"],
  available: true,
  hire: () => "Let's build!"
};`;
      navigator.clipboard.writeText(codeSnippet).then(() => {
        copyCodeSnippetBtn.classList.add("copied");
        setTimeout(() => copyCodeSnippetBtn.classList.remove("copied"), 2200);
      });
    });
  }

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = "birukman493@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        const textSpan = copyEmailBtn.querySelector(".copy-text");
        const icon = copyEmailBtn.querySelector("i");
        copyEmailBtn.classList.add("copied");
        if (textSpan) textSpan.textContent = "Copied!";
        if (icon) icon.className = "fas fa-check";

        setTimeout(() => {
          copyEmailBtn.classList.remove("copied");
          if (textSpan) textSpan.textContent = "Copy";
          if (icon) icon.className = "fas fa-copy";
        }, 2200);
      });
    });
  }

  // ============================================================
  // 3D PERSPECTIVE TILT ON PROJECT & SERVICE CARDS (DESKTOP)
  // ============================================================
  if (window.matchMedia("(min-width: 992px)").matches) {
    const tiltElements = document.querySelectorAll(".project-card, .service-box");

    tiltElements.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
});
