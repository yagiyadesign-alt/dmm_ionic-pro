(() => {
  "use strict";

  /* ---------- Header: mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const headerNav = document.getElementById("headerNav");

  if (menuBtn && headerNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = headerNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    headerNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        headerNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Dynamic section loading ---------- */
  let sectionsCssLoaded = false;

  function loadSectionsCss() {
    if (sectionsCssLoaded) return;
    sectionsCssLoaded = true;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/sections.css";
    document.head.appendChild(link);
  }

  function initFaqAccordion(scope) {
    const items = scope.querySelectorAll(".faq__item");
    items.forEach((item) => {
      const question = item.querySelector(".faq__question");
      const icon = item.querySelector(".faq__icon");
      if (!question) return;
      question.addEventListener("click", () => {
        const isOpen = item.classList.toggle("is-open");
        question.setAttribute("aria-expanded", String(isOpen));
        if (icon) icon.textContent = isOpen ? "−" : "+";
      });
    });
  }

  async function loadSection(section) {
    const src = section.dataset.src;
    if (!src) return;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
      const html = await res.text();
      loadSectionsCss();
      section.innerHTML = html;
      initFaqAccordion(section);
    } catch (err) {
      console.error(err);
    }
  }

  const lazySections = document.querySelectorAll(".lazy-section");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadSection(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "300px 0px", threshold: 0 }
    );

    lazySections.forEach((section) => observer.observe(section));
  } else {
    lazySections.forEach((section) => loadSection(section));
  }
})();
