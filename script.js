/* =====================================================================
   CONFIGURATION: update these links when they're ready.
   Leave a value as "" to keep showing the "Coming soon" state.
   External links open safely in a new tab automatically.
   ===================================================================== */
var BYRAE_CONFIG = {
  facebook:         "",   // e.g. "https://www.facebook.com/yourpage"
  starter:          "",   // 14-day Starter enrolment page
  resourcePillars:  "",   // Content Pillar Worksheet
  resourceCaptions: "",   // Caption Check
  resourceCalendar: "",   // One-Month Content Calendar
  email:            ""    // e.g. "hello@yourdomain.com" (no "mailto:" needed)
};
/* ================= Nothing below needs editing ================= */

(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Config-driven links ---- */
  var slots = document.querySelectorAll("[data-config]");
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    var raw = (BYRAE_CONFIG[slot.getAttribute("data-config")] || "").trim();
    if (!raw) continue;
    var live = slot.querySelector("[data-live]");
    var soon = slot.querySelector("[data-soon]");
    if (!live) continue;
    var isEmail = slot.getAttribute("data-config") === "email";
    var url = isEmail ? "mailto:" + raw.replace(/^mailto:/i, "") : raw;
    if (!isEmail && !/^https?:\/\//i.test(url)) continue; // ignore malformed links
    live.setAttribute("href", url);
    if (!isEmail) { live.setAttribute("target", "_blank"); live.setAttribute("rel", "noopener noreferrer"); }
    live.hidden = false;
    if (soon) soon.hidden = true;
  }

  /* ---- In-embed navigation ---- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    // If jumping to a FAQ item, make sure its answer is open
    var btn = target.querySelector && target.querySelector(".faq-btn");
    if (btn) setFaq(btn, true);
    try { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
    catch (err) { target.scrollIntoView(true); }
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    try { target.focus({ preventScroll: true }); } catch (err2) { /* older browsers */ }
  });

  /* ---- Audience selector ---- */
  var choices = document.querySelectorAll("[data-audience]");
  var panels = document.querySelectorAll("[data-audience-panel]");
  function selectAudience(key, animate) {
    for (var c = 0; c < choices.length; c++) {
      choices[c].setAttribute("aria-pressed", choices[c].getAttribute("data-audience") === key ? "true" : "false");
    }
    for (var p = 0; p < panels.length; p++) {
      var show = panels[p].getAttribute("data-audience-panel") === key;
      panels[p].hidden = !show;
      panels[p].classList.remove("is-entering");
      if (show && animate && !reduceMotion) {
        void panels[p].offsetWidth; // restart animation
        panels[p].classList.add("is-entering");
      }
    }
  }
  for (var k = 0; k < choices.length; k++) {
    choices[k].addEventListener("click", function () { selectAudience(this.getAttribute("data-audience"), true); });
  }
  selectAudience("scratch", false);

  /* ---- FAQ accordion (all answers stay open if JS fails) ---- */
  function setFaq(button, open) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    var panel = document.getElementById(button.getAttribute("aria-controls"));
    if (panel) panel.hidden = !open;
  }
  var faqBtns = document.querySelectorAll(".faq-btn");
  for (var f = 0; f < faqBtns.length; f++) {
    setFaq(faqBtns[f], f === 0); // first one open by default
    faqBtns[f].addEventListener("click", function () {
      setFaq(this, this.getAttribute("aria-expanded") !== "true");
    });
  }

  /* ---- Gentle entrance animations ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    root.classList.add("can-animate");
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      for (var r = 0; r < entries.length; r++) {
        if (entries[r].isIntersecting) {
          seen = true;
          entries[r].target.classList.add("is-in");
          io.unobserve(entries[r].target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    for (var v = 0; v < revealEls.length; v++) io.observe(revealEls[v]);
    // Safety net: if the observer never fires in this embed, show everything
    setTimeout(function () {
      if (!seen) { for (var s = 0; s < revealEls.length; s++) revealEls[s].classList.add("is-in"); }
    }, 2500);
  }
})();
