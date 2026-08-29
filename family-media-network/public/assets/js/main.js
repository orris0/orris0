// Family Media Network – main.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a link is clicked (mobile)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Copy email template
  const copyBtn = document.getElementById("copy-email");
  const template = document.getElementById("email-template");

  if (copyBtn && template) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(template.textContent);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = original;
        }, 2000);
      } catch (err) {
        // Fallback
        const range = document.createRange();
        range.selectNode(template);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy email template";
        }, 2000);
      }
    });
  }
});
