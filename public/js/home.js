function redirect () {
    if (document.cookie.includes("has_auth=true")) {
        window.location.href = "/notes.html";
        return;
    }
}

window.onload = redirect() ;