document.documentElement.classList.add("motion-ready");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function prepareHeader() {
  const header = document.querySelector("[data-site-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!header) return;

  let frame = null;
  const updateHeader = () => {
    frame = null;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestUpdate, { passive: true });

  if (!toggle || !menu) return;

  let closeTimer = null;
  const closeMenu = () => {
    window.clearTimeout(closeTimer);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    closeTimer = window.setTimeout(() => {
      menu.hidden = true;
    }, reducedMotion.matches ? 0 : 420);
  };

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    window.requestAnimationFrame(() => header.classList.add("is-open"));
  };

  toggle.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 767 && toggle.getAttribute("aria-expanded") === "true") closeMenu();
  });
}

function preparePageProgress() {
  const progress = document.querySelector("[data-page-progress]");
  if (!progress) return;

  let frame = null;
  const update = () => {
    frame = null;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const value = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${value})`;
  };
  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

function prepareReveals() {
  const elements = [...document.querySelectorAll("[data-reveal]")];
  if (!elements.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -9%", threshold: 0.08 },
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    observer.observe(element);
  });
}

function prepareHeroSignal() {
  const hero = document.querySelector("[data-hero]");
  const signal = document.querySelector("[data-hero-signal]");
  if (!hero || !signal || reducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

  let frame = null;
  let pointerX = 0;
  let pointerY = 0;
  const update = () => {
    frame = null;
    const bounds = hero.getBoundingClientRect();
    const x = ((pointerX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((pointerY - bounds.top) / bounds.height - 0.5) * 18;
    signal.style.setProperty("--signal-x", `${x.toFixed(2)}px`);
    signal.style.setProperty("--signal-y", `${y.toFixed(2)}px`);
  };

  hero.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame === null) frame = window.requestAnimationFrame(update);
  });
  hero.addEventListener("pointerleave", () => {
    signal.style.setProperty("--signal-x", "0px");
    signal.style.setProperty("--signal-y", "0px");
  });
}

function prepareOriginDepth() {
  const origin = document.querySelector(".origin");
  if (!origin || reducedMotion.matches) return;

  let frame = null;
  const update = () => {
    frame = null;
    const bounds = origin.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (bounds.bottom < 0 || bounds.top > viewport) return;
    const progress = (viewport - bounds.top) / (viewport + bounds.height);
    const shift = -9 + Math.min(1, Math.max(0, progress)) * 9;
    origin.style.setProperty("--origin-shift", `${shift.toFixed(2)}%`);
  };
  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

function prepareProductCards() {
  const links = [...document.querySelectorAll(".product__link")];
  if (!links.length) return;

  const releaseProductFocus = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement.matches(".product__link")) {
      activeElement.blur();
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      window.requestAnimationFrame(() => link.blur());
    });
  });

  window.addEventListener("pagehide", releaseProductFocus);
  window.addEventListener("pageshow", releaseProductFocus);
}

function showToast(message) {
  let toast = document.querySelector(".site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "site-toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.dataset.visible = "true";
  window.setTimeout(() => {
    toast.dataset.visible = "false";
  }, 4200);
}

function prepareContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = String(data.get("subject") || "Website inquiry");
    const body = [
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      `Email: ${data.get("email")}`,
      `Conversation: ${subject}`,
      "",
      data.get("message"),
    ].join("\n");

    window.location.href = `mailto:contact@westfieldaes.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("Your email app is opening with the project brief ready to send.");
  });
}

prepareHeader();
preparePageProgress();
prepareReveals();
prepareHeroSignal();
prepareOriginDepth();
prepareProductCards();
prepareContactForm();
