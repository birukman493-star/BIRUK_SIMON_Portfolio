document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const links = document.querySelectorAll("a, button, .btn, .project-card, .service-box");

  // Custom Cursor Following
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate dot movement
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth cursor ring movement
  const animateCursor = () => {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    cursor.style.left = `${cursorX - 20}px`;
    cursor.style.top = `${cursorY - 20}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Cursor Hover Effects
  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
    });
    link.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });
  });

  // Magnetic Buttons & Shine Effect
  const magneticElements = document.querySelectorAll(".btn, .social-pill, .logo");
  
  magneticElements.forEach(el => {
    let centerX, centerY;

    // Inject shine element if it's a button
    if (el.classList.contains("btn")) {
      const shine = document.createElement("div");
      shine.classList.add("btn-shine");
      el.appendChild(shine);
    }

    el.addEventListener("mouseenter", () => {
      const rect = el.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    });

    el.addEventListener("mousemove", (e) => {
      if (!centerX || !centerY) return;

      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      
      // Magnetic pull (stable factor)
      const pullFactor = 0.15;
      el.style.transform = `translate(${x * pullFactor}px, ${y * pullFactor}px)`;

      // Shine effect logic (relative to the element's actual position for visual accuracy)
      if (el.classList.contains("btn")) {
        const rect = el.getBoundingClientRect();
        const shineX = e.clientX - rect.left;
        const shineY = e.clientY - rect.top;
        el.style.setProperty("--x", `${shineX}px`);
        el.style.setProperty("--y", `${shineY}px`);
      }
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = `translate(0px, 0px)`;
      centerX = null;
      centerY = null;
    });
  });

  // Mobile Navigation Toggle
  const menuIcon = document.getElementById("menu-icon");
  const navMenu = document.querySelector(".navbar ul");

  if (menuIcon && navMenu) {
    menuIcon.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    const navLinks = document.querySelectorAll(".navbar ul li a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // Smooth Scrolling with Lenis
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

  // Intersection Observer for Reveal
  const observerOptions = {
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Form Submission Logic (Formspree)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerText;
      const formData = new FormData(contactForm);

      // 1. Show loading state
      submitBtn.classList.add("loading");
      submitBtn.innerText = "Sending...";

      try {
        // 2. Send data to Formspree
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // 3. Show success state
          submitBtn.classList.remove("loading");
          submitBtn.classList.add("success");
          submitBtn.innerText = "Message Sent!";
          contactForm.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        submitBtn.classList.remove("loading");
        submitBtn.innerText = "Error! Try again";
        console.error(error);
      } finally {
        // 4. Reset button after delay
        setTimeout(() => {
          submitBtn.classList.remove("success");
          submitBtn.innerText = originalText;
        }, 3000);
      }
    });
  }

  document.querySelectorAll(".framer-reveal, .framer-scale, .framer-left, .project-card, .service-box").forEach((el) => {
    observer.observe(el);
  });
});
