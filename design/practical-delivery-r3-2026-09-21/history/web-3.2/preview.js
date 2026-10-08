const offersTrigger = document.querySelector(".offers-trigger");
const offersMenu = document.querySelector("#offers-menu");

function setOffersOpen(open) {
  offersTrigger.setAttribute("aria-expanded", String(open));
  offersMenu.hidden = !open;
}

offersTrigger.addEventListener("click", () => {
  setOffersOpen(offersMenu.hidden);
});

document.addEventListener("click", (event) => {
  if (!offersMenu.contains(event.target) && !offersTrigger.contains(event.target)) {
    setOffersOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !offersMenu.hidden) {
    setOffersOpen(false);
    offersTrigger.focus();
  }
});

offersMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setOffersOpen(false);
});

document.addEventListener("focusin", (event) => {
  if (!offersMenu.contains(event.target) && event.target !== offersTrigger) {
    setOffersOpen(false);
  }
});

// Keep the first Tab inside the disclosure before continuing to the other links.
offersTrigger.addEventListener("keydown", (event) => {
  if (!offersMenu.hidden && event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    offersMenu.querySelector("a").focus();
  }
});
offersMenu.addEventListener("keydown", (event) => {
  const links = [...offersMenu.querySelectorAll("a")];
  if (event.key !== "Tab") return;
  if (event.shiftKey && event.target === links[0]) {
    event.preventDefault();
    offersTrigger.focus();
  } else if (!event.shiftKey && event.target === links.at(-1)) {
    event.preventDefault();
    [...document.querySelectorAll(".site-header nav a")]
      .find((link) => link.getClientRects().length > 0)
      .focus();
  }
});

const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
  document.querySelector('meta[name="theme-color"]').content = dark ? "#14211d" : "#f8f2e8";
});

// The preview has no submission endpoint, no form field names and a form-action
// CSP of 'none'. Never send or persist the visitor's input, including on Enter.
document.querySelector(".inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
});
document.querySelector(".submit-preview").addEventListener("click", () => {
  document.querySelector("#preview-note").textContent = "Preview only — nothing was sent or saved.";
});

const motifs = document.querySelectorAll(".motif");
const visibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle("is-visible", entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add("has-entered");
  }
});
motifs.forEach((motif) => visibility.observe(motif));
function syncVisibility() {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
}
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();
