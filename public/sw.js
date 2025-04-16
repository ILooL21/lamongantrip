const CACHE_NAME = "lamongan-trip-cache-v1";

// Inisialisasi WebSocket (akan dihubungkan nanti)
let socket;

self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated");
  // Coba hubungkan ke server saat aktivasi
  connectWebSocket();
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Notifikasi!", body: "Ada pesan baru." };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192x192.png", // Pastikan ikon ada
    })
  );
});

function connectWebSocket() {
  socket = new WebSocket("ws://localhost:3000"); // Ganti dengan URL server WebSocket Anda

  socket.onopen = () => {
    console.log("WebSocket connected");
    // Kirim pesan ke server untuk "berlangganan" dengan ID unik klien
    const clientId = localStorage.getItem("pwaClientId") || generateClientId();
    socket.send(JSON.stringify({ type: "subscribe", clientId }));
    localStorage.setItem("pwaClientId", clientId);
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "notification") {
      self.registration.showNotification(message.title, {
        body: message.body,
        icon: "/icon-192x192.png",
      });
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    // Coba reconnect setelah beberapa detik
    setTimeout(connectWebSocket, 5000);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

function generateClientId() {
  return Math.random().toString(36).substring(2, 15);
}
