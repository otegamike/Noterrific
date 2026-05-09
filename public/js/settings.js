import { renderSettingsHeaderActions, showAlert } from "./sharedUi.js";
let accessToken = sessionStorage.getItem("validate");

const prefs = {
  compactCards: "pref_compact_cards",
  reduceMotion: "pref_reduce_motion",
  pinnedFirst: "pref_pinned_first"
};

const renderHeaderActions = () => {
  const username = sessionStorage.getItem("username");
  if (!username) return;
  renderSettingsHeaderActions({ username });
  document.getElementById("accountUsername").textContent = username;
};

const applyPreferenceClasses = () => {
  document.body.classList.toggle("pref-reduce-motion", localStorage.getItem(prefs.reduceMotion) === "true");
  document.body.classList.toggle("pref-compact-cards", localStorage.getItem(prefs.compactCards) === "true");
  document.body.classList.toggle("pref-pinned-first", localStorage.getItem(prefs.pinnedFirst) === "true");
};

const initPreferences = () => {
  const compactEl = document.getElementById("prefCompactCards");
  const motionEl = document.getElementById("prefReduceMotion");
  const pinnedEl = document.getElementById("prefPinnedFirst");

  compactEl.checked = localStorage.getItem(prefs.compactCards) === "true";
  motionEl.checked = localStorage.getItem(prefs.reduceMotion) === "true";
  pinnedEl.checked = localStorage.getItem(prefs.pinnedFirst) === "true";

  compactEl.addEventListener("change", () => {
    localStorage.setItem(prefs.compactCards, String(compactEl.checked));
    applyPreferenceClasses();
    showAlert("Compact cards preference saved");
  });

  motionEl.addEventListener("change", () => {
    localStorage.setItem(prefs.reduceMotion, String(motionEl.checked));
    applyPreferenceClasses();
    showAlert("Motion preference saved");
  });

  pinnedEl.addEventListener("change", () => {
    localStorage.setItem(prefs.pinnedFirst, String(pinnedEl.checked));
    applyPreferenceClasses();
    showAlert("Pinned-order preference saved");
  });

  applyPreferenceClasses();
};

const logout = async () => {
  try {
    const res = await fetch("/.netlify/functions/app/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ACCESSTOKEN: accessToken })
    });

    if (res.status === 200 || res.status === 403) {
      sessionStorage.removeItem("validate");
      sessionStorage.removeItem("username");
      window.location.href = "/login.html?logout=true";
      return;
    }

    showAlert("Could not log out. Please try again.");
  } catch (_err) {
    showAlert("Could not log out. Please try again.");
  }
};

const updatePassword = async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    showAlert("New password and confirmation do not match.");
    return;
  }

  if (newPassword.length < 8) {
    showAlert("New password must be at least 8 characters.");
    return;
  }

  try {
    const res = await fetch("/.netlify/functions/app/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ACCESSTOKEN: accessToken, currentPassword, newPassword })
    });

    const data = await res.json();
    if (res.status === 200) {
      accessToken = data.accessToken || accessToken;
      sessionStorage.setItem("validate", accessToken);
      document.getElementById("passwordForm").reset();
      showAlert("Password updated successfully.");
      return;
    }

    showAlert(data.message || "Failed to update password.");
  } catch (_err) {
    showAlert("Network error while updating password.");
  }
};

const renderApiKeyStatus = (status, masked) => {
  document.getElementById("apiKeyStatus").textContent = status;
  document.getElementById("apiKeyMasked").textContent = masked || "-";
};

const loadApiKeyStatus = async () => {
  try {
    const res = await fetch("/.netlify/functions/app/remote-post/key/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken || ""
      }
    });

    const data = await res.json();
    if (res.status === 200) {
      accessToken = data.accessToken || accessToken;
      sessionStorage.setItem("validate", accessToken);
      renderApiKeyStatus(data.apiKeyStatus || "inactive", data.apiKeyClient);
      return;
    }

    renderApiKeyStatus("inactive", null);
  } catch (_err) {
    renderApiKeyStatus("inactive", null);
  }
};

const createApiKey = async () => {
  try {
    const res = await fetch("/.netlify/functions/app/remote-post/key/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ACCESSTOKEN: accessToken })
    });
    const data = await res.json();

    if (res.status === 201) {
      accessToken = data.accessToken || accessToken;
      sessionStorage.setItem("validate", accessToken);
      const reveal = document.getElementById("apiKeyReveal");
      document.getElementById("apiKeyValue").textContent = data.apiKey;
      reveal.classList.remove("hidden");
      showAlert("API key created. Copy it now. you wont see it again!", "alert-success");
      loadApiKeyStatus();
      return;
    }

    showAlert(data.message || "Could not create API key.");
  } catch (_err) {
    showAlert("Network error while creating API key.");
  }
};

const deleteApiKey = async () => {
  try {
    const res = await fetch("/.netlify/functions/app/remote-post/key/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ACCESSTOKEN: accessToken })
    });

    const data = await res.json();
    if (res.status === 200) {
      accessToken = data.accessToken || accessToken;
      sessionStorage.setItem("validate", accessToken);
      document.getElementById("apiKeyReveal").classList.add("hidden");
      document.getElementById("apiKeyValue").textContent = "";
      showAlert("API key revoked.");
      loadApiKeyStatus();
      return;
    }

    showAlert(data.message || "Could not revoke API key.");
  } catch (_err) {
    showAlert("Network error while revoking API key.");
  }
};

const copyApiKey = async () => {
  const key = document.getElementById("apiKeyValue").textContent;
  if (!key) {
    showAlert("No key to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(key);
    showAlert("API key copied to clipboard.");
  } catch (_err) {
    showAlert("Could not copy key.");
  }
};

const init = () => {
  renderHeaderActions();
  initPreferences();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => loadApiKeyStatus(), { timeout: 2000 });
  } else {
    requestAnimationFrame(() => setTimeout(loadApiKeyStatus, 0));
  }

  document.getElementById("passwordForm").addEventListener("submit", updatePassword);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("createApiKeyBtn").addEventListener("click", createApiKey);
  document.getElementById("deleteApiKeyBtn").addEventListener("click", deleteApiKey);
  document.getElementById("copyApiKeyBtn").addEventListener("click", copyApiKey);
};

window.addEventListener("DOMContentLoaded", init);

