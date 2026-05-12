document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", currentTheme);

  const updateThemeIcon = () => {
    const icon = toggle?.querySelector(".theme-icon");
    if (!icon) return;
    icon.textContent = currentTheme === "dark" ? "☼" : "◐";
    toggle.setAttribute("aria-label", `Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`);
  };

  updateThemeIcon();

  toggle?.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", currentTheme);
    updateThemeIcon();
  });

  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav?.classList.toggle("open");
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach(el => observer.observe(el));

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank") return;
      event.preventDefault();
      document.body.classList.add("page-transition");
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async event => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');

      formStatus.textContent = "Sending your enquiry...";
      submitButton.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          formStatus.textContent = "Thank you. Your enquiry has been submitted successfully.";
          contactForm.reset();
        } else {
          formStatus.textContent = result.message || "Something went wrong. Please try again.";
        }
      } catch (error) {
        formStatus.textContent = "Unable to send right now. Please try again in a moment.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});