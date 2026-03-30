(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const menuOverlay = document.querySelector("[data-menu-overlay]");
  const openMenuBtn = document.querySelector("[data-menu-open]");
  const closeMenuBtn = document.querySelector("[data-menu-close]");

  const scrollToHash = (hash) => {
    if (!hash || hash === "#") return;
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", hash);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", hash);
  };

  const openMenu = () => {
    if (!menuOverlay || !openMenuBtn) return;
    menuOverlay.hidden = false;
    openMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!menuOverlay || !openMenuBtn) return;
    menuOverlay.hidden = true;
    openMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  openMenuBtn?.addEventListener("click", openMenu);
  closeMenuBtn?.addEventListener("click", closeMenu);

  document.querySelectorAll('.site-header a[href^="#"], [data-menu-overlay] a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const fromMobileMenu = Boolean(link.closest("[data-menu-overlay]"));
      if (fromMobileMenu) closeMenu();
      const go = () => scrollToHash(href);
      if (fromMobileMenu) {
        requestAnimationFrame(() => requestAnimationFrame(go));
      } else {
        go();
      }
    });
  });

  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  const dialog = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  if (!dialog || !img) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    return;
  }

  const fallbackSrc = "assets/milk%20glass.jpg";

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    img.onerror = () => {
      if (img.src.includes("milk%20glass.jpg")) return;
      img.src = fallbackSrc;
    };
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "open");
  };

  const close = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    const button = t?.closest?.("[data-lightbox]");
    if (button) {
      const src = button.getAttribute("data-lightbox");
      const alt = button.querySelector("img")?.getAttribute("alt") || "";
      if (src) open(src, alt);
      return;
    }

    if (t?.closest?.("[data-close]")) close();
  });

  // Fallback automatico per immagini mancanti
  document.querySelectorAll("img[data-fallback]").forEach((el) => {
    el.addEventListener(
      "error",
      () => {
        const fb = el.getAttribute("data-fallback") || fallbackSrc;
        if (el.src.includes("milk%20glass.jpg")) return;
        el.src = fb;
      },
      { once: true }
    );
  });

  dialog.addEventListener("click", (e) => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (!inside) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog.hasAttribute("open")) close();
    if (e.key === "Escape") closeMenu();
  });
})();
