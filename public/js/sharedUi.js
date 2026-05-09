export const displayPhoto = (str, size = 40) => {
  const letter = (str || "U").charAt(0).toUpperCase();
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;display:flex;justify-content:center;align-items:center;font-size:${size * 0.5}px;font-weight:700;font-family:Arial,sans-serif;background-color:#96c703;color:white;">${letter}</div>`;
};

export const showAlert = (message, type = "") => {
  const alertEl = document.getElementById("alrtCon");
  if (!alertEl) return;
  const el = document.createElement("div");
  el.className = `alrt ${type}`.trim();
  el.textContent = message;
  alertEl.appendChild(el);
  requestAnimationFrame(() => el.classList.add("fade-in"));
  setTimeout(() => {
    el.classList.remove("fade-in");
    setTimeout(() => el.remove(), 500);
  }, 3500);
};

export const renderSettingsHeaderActions = ({ actionsId = "actions", username } = {}) => {
  const user = username || sessionStorage.getItem("username");
  if (!user) return;
  const target = document.getElementById(actionsId);
  if (!target) return;

  target.innerHTML = `
    <span class="loginn display-name" id="displayName">
      <span class="uname">${user.charAt(0).toUpperCase() + user.slice(1)}</span>
      <span class="panel">
        <span class="tablink" id="goNotes"><a href="/notes.html">notes</a></span>
      </span>
    </span>
    <span class="profilepic" id="profilepic">${displayPhoto(user, 40)}</span>
  `;
};
