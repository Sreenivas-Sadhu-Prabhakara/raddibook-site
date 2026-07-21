/* RaddiBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero weigh-slip "totals itself" — the plastic
      line is weighed in, the amount fills, the cash-to-pay and total
      weight tick up, and the payout slip completes. A live demo of the
      buy → payout promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the weigh-slip totals itself ---------- */
  var liveRow = document.getElementById("reg-live-row");
  var liveWt = document.getElementById("reg-live-wt");
  var liveAmt = document.getElementById("reg-live-amt");
  var totalEl = document.getElementById("reg-total");
  var weightEl = document.getElementById("reg-weight");
  var pill = document.querySelector(".register__pill");
  var caption = document.getElementById("reg-caption");

  if (!liveRow || !totalEl || !weightEl) return;

  // The first two lines (paper ₹196, iron ₹272) are already on the slip.
  var BASE_AMOUNT = 468;       // 196 + 272
  var BASE_WEIGHT = 22.5;      // 14.0 + 8.5 kg
  var PLASTIC_RATE = 11;       // ₹/kg
  var PLASTIC_KG = 6.0;        // final plastic weight
  var PLASTIC_AMOUNT = 66;     // 6.0 × 11

  function rupee(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }
  function kg(n) {
    return n.toFixed(1) + " kg";
  }

  // Cycle: empty pan -> weight climbs -> settles -> slip done -> reset.
  var stages = [
    {
      pill: "Weighing",
      wt: "0.0 kg × ₹11",
      amt: "₹0",
      plasticKg: 0,
      caption: "Plastic on the pan… weight climbing.",
      flash: false
    },
    {
      pill: "Weighing",
      wt: "3.5 kg × ₹11",
      amt: "₹39",
      plasticKg: 3.5,
      caption: "3.5 kg so far — the cash-to-pay ticks up live.",
      flash: false
    },
    {
      pill: "Weighing",
      wt: "6.0 kg × ₹11",
      amt: "₹66",
      plasticKg: 6.0,
      caption: "Settled at 6.0 kg × ₹11 = ₹66. Line locked in.",
      flash: true
    },
    {
      pill: "Slip ready",
      wt: "6.0 kg × ₹11",
      amt: "₹66",
      plasticKg: 6.0,
      caption: "Payout PAY-20260719-0043 printed · ₹534 paid in full.",
      flash: false
    }
  ];

  function applyStage(s) {
    if (pill) pill.textContent = s.pill;
    if (liveWt) liveWt.textContent = s.wt;
    if (liveAmt) liveAmt.textContent = s.amt;
    caption.textContent = s.caption;
    totalEl.textContent = rupee(BASE_AMOUNT + s.plasticKg * PLASTIC_RATE);
    weightEl.textContent = kg(BASE_WEIGHT + s.plasticKg);
    if (s.flash) {
      liveRow.classList.add("flash");
      setTimeout(function () {
        liveRow.classList.remove("flash");
      }, 900);
    }
  }

  // Reduced motion: show the completed slip end-state and don't loop.
  if (reduceMotion) {
    applyStage(stages[3]);
    return;
  }

  var i = 0;
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      i = (i + 1) % stages.length;
      applyStage(stages[i]);
      loop();
    }, i === 3 ? 2600 : 1900);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(liveRow.closest(".register"));
})();
