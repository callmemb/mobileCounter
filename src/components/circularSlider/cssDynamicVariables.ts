/**
 * Creating css property used for the rotation of the circular slider
 * Error expected on hot-reload, but should not affect the application.
 */
try {
  window.CSS.registerProperty({
    name: "--value-deg",
    syntax: "<angle>",
    inherits: false,
    initialValue: "0deg",
  });
  window.CSS.registerProperty({
    name: "--value2-deg",
    syntax: "<angle>",
    inherits: false,
    initialValue: "0deg",
  });
} catch (error) {
  console.warn("This error should only show in developer mode:", error);
}

