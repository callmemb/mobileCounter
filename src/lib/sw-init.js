if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const scriptPolicy =
      window.trustedTypes && window.trustedTypes.createPolicy
        ? window.trustedTypes.createPolicy("sw-policy", {
            createScriptURL: (url) => (url.startsWith("/sw.js") ? url : null),
          })
        : {
            createScriptURL: (url) => url,
          };

    const link = scriptPolicy.createScriptURL("/sw.js");
    navigator.serviceWorker
      .register(link)
      .then((registration) =>
        console.log("Service Worker registered:", registration)
      )
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
