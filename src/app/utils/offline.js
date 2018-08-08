if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(reg => {
      console.log("Service worker registered");
    })
    .catch(err => {
      console.error("Error during worker registration:", err);
    });
}
