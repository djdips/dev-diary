export function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  // Icons (can use emoji or SVG here)
  const sunIcon = "☀️";
  const moonIcon = "🌙";

  // Detect saved theme or fallback to system preference
  let savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    savedTheme = prefersDark ? "dark" : "light";
  }

  // Apply theme classes
  applyTheme(savedTheme);

  // Update button UI
  updateButton(savedTheme);

  // Listen for system preference changes (optional)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (!localStorage.getItem("theme")) { // Only if no manual override
      const newTheme = e.matches ? "dark" : "light";
      applyTheme(newTheme);
      updateButton(newTheme);
    }
  });

  // Click handler to toggle theme
  btn.onclick = () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    updateButton(newTheme);
  };

  function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }

  function updateButton(theme) {
    const isDark = theme === "dark";
    btn.textContent = isDark ? sunIcon + " Light Mode" : moonIcon + " Dark Mode";
    btn.setAttribute("aria-pressed", isDark);
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}
