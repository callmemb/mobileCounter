
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Create Trusted Types policy if supported
    const scriptPolicy =
      window.trustedTypes && window.trustedTypes.createPolicy
        ? window.trustedTypes.createPolicy("sw-policy", {
            createScriptURL: (url) => (url.startsWith("/sw.js") ? url : null),
          })
        : {
            createScriptURL: (url) => url,
          };

    // Get trusted script URL
    const link = scriptPolicy.createScriptURL("/sw.js");
    
    // Register service worker with the trusted URL
    navigator.serviceWorker
      .register(link)
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}
