(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const dialog = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  if (!dialog || !img) return;

  const fallbackSrc = "assets/missing.svg";

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    img.onerror = () => {
      if (img.src.includes("missing.svg")) return;
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
        if (el.src.includes("missing.svg")) return;
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
  });
})();
