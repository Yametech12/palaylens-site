// Clean section URLs: /performance instead of /#performance.
// The server rewrites section paths to index.html; this script scrolls to
// the matching section on load and turns nav clicks into in-page scrolls
// that update the address bar without a reload or a hash.
(function () {
  var SECTIONS = ["top", "how", "detects", "performance", "privacy", "about", "versions", "faq"];

  function sectionFromPath() {
    var seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
    return SECTIONS.indexOf(seg) >= 0 ? seg : null;
  }

  function goTo(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    } else {
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
    return true;
  }

  // Direct visit or refresh on a clean URL: jump to its section.
  var initial = sectionFromPath();
  if (initial && initial !== "top") {
    // Run before first paint settles; 'auto' avoids a visible sweep.
    goTo(initial, false);
    window.addEventListener("load", function () { goTo(initial, false); });
  }

  // Nav clicks: scroll in place, then set the clean URL.
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) !== "/") return;
    var seg = href.replace(/^\/+|\/+$/g, "");
    if (SECTIONS.indexOf(seg) < 0) return;
    if (!document.getElementById(seg)) return;
    ev.preventDefault();
    goTo(seg, true);
    if (window.location.pathname !== href) {
      window.history.pushState(null, "", href);
    }
  });

  // Back/forward buttons: follow the URL to its section.
  window.addEventListener("popstate", function () {
    var id = sectionFromPath();
    if (id) goTo(id, true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
