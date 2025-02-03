const backendURL = "https://your-backend.onrender.com"; // Replace with your backend URL
const socket = io(backendURL);
const videoElement = document.getElementById("screen-video");
const startButton = document.getElementById("start-share");
const splitButton = document.getElementById("split-screen");

let isSplit = false;

// Start Screen Sharing
startButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoElement.srcObject = stream;
        socket.emit("screen-data", "Screen sharing started");
    } catch (error) {
        console.error("Error sharing screen:", error);
    }
});

// Toggle Split Screen
splitButton.addEventListener("click", () => {
    isSplit = !isSplit;
    videoElement.style.width = isSplit ? "50%" : "80%";
});

// Capture Remote Control Events
document.addEventListener("mousemove", (event) => {
    socket.emit("remote-mouse", { x: event.clientX, y: event.clientY });
});

document.addEventListener("keydown", (event) => {
    socket.emit("remote-key", { key: event.key });
});
