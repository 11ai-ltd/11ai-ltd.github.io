(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // Header background on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Platforms dropdown (click/keyboard; hover handled in CSS)
  document.querySelectorAll(".has-menu").forEach(function (item) {
    var btn = item.querySelector(".menu-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!item.contains(e.target)) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form
  var form = document.getElementById("contact-form");
  if (!form) return;

  var interest = new URLSearchParams(window.location.search).get("interest");
  var select = form.querySelector("#interest");
  if (interest && select && select.querySelector('option[value="' + interest + '"]')) {
    select.value = interest;
  }

  var status = form.querySelector(".form-status");
  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = "form-status " + (cls || "");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (form.querySelector(".hp-field input").checked) return; // bot trap

    var data = new FormData(form);
    if (data.get("access_key").indexOf("YOUR_") === 0) {
      setStatus("The contact form is not active yet. Please try again later.", "err");
      return;
    }
    data.set("subject", "11AI website: " + select.options[select.selectedIndex].text + " (" + data.get("company") + ")");
    data.set("interest", select.options[select.selectedIndex].text);
    data.delete("consent");

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    setStatus("Sending…");
    fetch(form.getAttribute("action"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(data))
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.success) throw new Error(res.message);
        form.reset();
        setStatus("Thank you. Your message has been sent and our team will be in touch shortly.", "ok");
      })
      .catch(function () {
        setStatus("Sorry, your message could not be sent. Please try again in a few minutes.", "err");
      })
      .then(function () { btn.disabled = false; });
  });
})();
