const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const progressIndicator = document.querySelector(".scroll-progress span");
const heroImage = document.querySelector(".hero-media > img");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollTicking = false;

function setMenu(open) {
  if (!menuButton || !navigation) return;

  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector(".sr-only").textContent = open ? "Menü schließen" : "Menü öffnen";
  navigation.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenu(false);
});

function updateScrollEffects() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
  if (progressIndicator) progressIndicator.style.transform = `scaleX(${scrollProgress})`;

  if (heroImage) {
    const parallaxOffset = !reducedMotion.matches && window.innerWidth > 820
      ? Math.min(window.scrollY * 0.035, 24)
      : 0;
    heroImage.style.setProperty("--parallax-offset", `${parallaxOffset}px`);
  }

  scrollTicking = false;
}

function requestScrollEffects() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollEffects);
}

updateScrollEffects();
window.addEventListener("scroll", requestScrollEffects, { passive: true });
window.addEventListener("resize", requestScrollEffects);
reducedMotion.addEventListener?.("change", requestScrollEffects);

const revealGroups = [
  ".promise-grid article",
  ".service-grid .service-card",
  ".visit-steps > li",
];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
  });
});

const revealElements = document.querySelectorAll("[data-reveal]");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -7% 0px",
  });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const schedule = {
  Sun: [],
  Mon: [[540, 720], [840, 1080]],
  Tue: [[540, 720], [840, 1080]],
  Wed: [[540, 720], [840, 1080]],
  Thu: [[540, 720], [840, 1080]],
  Fri: [[540, 720], [840, 1080]],
  Sat: [[600, 720]],
};

const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const germanDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function getBerlinTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    day: values.weekday,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function nextOpening(day, minutes) {
  const dayIndex = dayOrder.indexOf(day);

  for (let offset = 0; offset < 8; offset += 1) {
    const index = (dayIndex + offset) % 7;
    const periods = schedule[dayOrder[index]];
    const firstOpening = periods[0]?.[0];

    if (firstOpening === undefined) continue;
    if (offset === 0 && firstOpening <= minutes) continue;

    return {
      offset,
      dayLabel: germanDays[index],
      time: minutesToTime(firstOpening),
    };
  }

  return null;
}

function updateOpeningStatus() {
  const status = document.querySelector("#opening-status");
  if (!status) return;

  const statusText = status.querySelector("span:last-child");
  const { day, minutes } = getBerlinTime();
  const periods = schedule[day];
  const activePeriod = periods.find(([start, end]) => minutes >= start && minutes < end);

  if (activePeriod) {
    status.classList.add("is-open");
    statusText.textContent = `Heute geöffnet · bis ${minutesToTime(activePeriod[1])} Uhr`;
    return;
  }

  status.classList.remove("is-open");
  const laterToday = periods.find(([start]) => minutes < start);

  if (laterToday) {
    statusText.textContent = `Heute wieder geöffnet · ab ${minutesToTime(laterToday[0])} Uhr`;
    return;
  }

  const next = nextOpening(day, minutes);
  if (!next) return;

  const label = next.offset === 1 ? "Morgen" : next.dayLabel;
  statusText.textContent = `${label} geöffnet · ab ${next.time} Uhr`;
}

updateOpeningStatus();
setInterval(updateOpeningStatus, 60_000);
