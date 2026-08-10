const routes = {
  about: "./about.html",
  contact: "./contact.html",
};

const normalize = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();

function routeFromLabel(label) {
  const text = normalize(label);

  if (text === "westfield aes") return "./index.html";
  if (text === "about") return routes.about;
  if (text === "contact" || text.includes("talk to us") || text.includes("join the vision")) return routes.contact;
  if (text.includes("request beta") || text.includes("access platform")) return routes.contact;
  if (text.includes("architecture")) return routes.contact;
  if (text.includes("view product") || text.includes("explore platform")) return routes.contact;
  if (text === "privacy policy") return "./legal.html#privacy";
  if (text === "terms of service") return "./legal.html#terms";
  return null;
}

function wireRoutes() {
  document.querySelectorAll("a, button").forEach((element) => {
    const route = routeFromLabel(element.textContent || "");
    if (!route) return;

    if (element.tagName === "A") {
      if (!element.getAttribute("href") || element.getAttribute("href") === "#") {
        element.setAttribute("href", route);
      }
    } else if (!element.closest("form")) {
      element.addEventListener("click", () => window.location.assign(route));
    }
  });
}

function prepareHomeEntrance() {
  const hero = document.querySelector(".home-hero");
  if (!hero || !Element.prototype.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const animations = [];

  const copyItems = [
    ".home-hero__title",
    ".home-hero__lead",
    ".home-hero__meta",
  ];

  copyItems.forEach((selector, index) => {
    const element = hero.querySelector(selector);
    if (!element) return;
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 820,
        delay: 70 + index * 130,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      },
    );
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
  });

  const visual = hero.querySelector(".home-hero__visual");
  if (visual) {
    const finalOpacity = getComputedStyle(visual).opacity;
    const animation = visual.animate(
      [
        { opacity: 0, transform: "scale(0.82) rotate(-5deg)", filter: "blur(12px)" },
        { opacity: finalOpacity, transform: "scale(1) rotate(0)", filter: "blur(0)" },
      ],
      {
        duration: 1500,
        delay: 160,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      },
    );
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
  }

  const grid = hero.querySelector(".home-hero__grid");
  if (grid) {
    const animation = grid.animate([{ opacity: 0 }, { opacity: 0.62 }], {
      duration: 1400,
      delay: 100,
      easing: "ease-out",
      fill: "both",
    });
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
  }

  if (!("IntersectionObserver" in window)) {
    animations.forEach((animation) => animation.play());
    return;
  }

  let hasEntered = false;
  let isHeroVisible = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.14;
      if (isVisible === isHeroVisible) return;
      isHeroVisible = isVisible;

      if (isVisible) {
        hasEntered = true;
        animations.forEach((animation) => {
          animation.playbackRate = 1;
          animation.play();
        });
      } else if (hasEntered) {
        animations.forEach((animation) => animation.reverse());
      }
    },
    { threshold: [0, 0.14] },
  );

  observer.observe(hero);
}

function prepareHomeScrollMotion() {
  const sections = [...document.querySelectorAll("[data-home-section]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!sections.length || reducedMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("home-motion-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.12;
        entry.target.classList.toggle("is-visible", isVisible);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: [0, 0.12],
    },
  );

  sections.forEach((section) => observer.observe(section));

  const depthSection = document.querySelector(".home-global");
  if (!depthSection) return;

  let animationFrame = null;
  const updateDepth = () => {
    animationFrame = null;
    const bounds = depthSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (bounds.bottom < -viewportHeight * 0.25 || bounds.top > viewportHeight * 1.25) return;

    const progress = Math.min(1, Math.max(0, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));
    const shift = (0.5 - progress) * 24;
    depthSection.style.setProperty("--home-depth-shift", `${shift.toFixed(2)}px`);
  };

  const requestDepthUpdate = () => {
    if (animationFrame !== null) return;
    animationFrame = window.requestAnimationFrame(updateDepth);
  };

  updateDepth();
  window.addEventListener("scroll", requestDepthUpdate, { passive: true });
  window.addEventListener("resize", requestDepthUpdate, { passive: true });
}

function prepareContactForm() {
  const form = document.querySelector("form");
  if (!form || !document.querySelector("#email")) return;

  const fields = ["name", "company", "email", "subject", "message"];
  fields.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.name = id;
    if (["name", "email", "message"].includes(id)) field.required = true;
  });

  const button = form.querySelector("button");
  if (button) button.type = "submit";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = document.querySelector("#subject option:checked")?.textContent || "Website inquiry";
    const body = [
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      `Email: ${data.get("email")}`,
      "",
      data.get("message"),
    ].join("\n");

    window.location.href = `mailto:contact@westfieldaes.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("Your email app is opening with the message ready to send.");
  });
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

function enhancePage() {
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main-content";

  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#main-content";
  skip.textContent = "Skip to content";
  document.body.prepend(skip);

  document.querySelectorAll("footer").forEach((footer) => {
    footer.innerHTML = footer.innerHTML.replace(/©\s*2024/g, `© ${new Date().getFullYear()}`);
  });
}

wireRoutes();
prepareHomeEntrance();
prepareHomeScrollMotion();
prepareContactForm();
enhancePage();
