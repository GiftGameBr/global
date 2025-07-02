const playPauseBtn = document.getElementById("playPause");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const spectrum = document.getElementById("spectrum");

// Generate 20 bars dynamically for spectrum
for (let i = 0; i < 42; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    spectrum.appendChild(bar);
}

// Play/Pause functionality
playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.classList.add("playing");
        startSpectrum();
    } else {
        audio.pause();
        playPauseBtn.classList.remove("playing");
        stopSpectrum(); 
    }
});

// Start spectrum animation
function startSpectrum() {
    spectrum.classList.add("active");
    document.querySelectorAll(".bar").forEach((bar, index) => {
        let delay = Math.random() * 0.3;
        bar.style.animation = `bounce 0.8s infinite alternate ease-in-out ${delay}s`;
    });
}

// Stop spectrum animation (Turn into a black horizontal line)
function stopSpectrum() {
    spectrum.classList.remove("active");
    document.querySelectorAll(".bar").forEach(bar => {
        bar.style.animation = "none";
        bar.style.height = "3px";
        bar.style.background = "black"; 
    });
}

// Update progress bar, progress color, and current time
audio.addEventListener("timeupdate", () => {
    updateProgress();
});

function updateProgress() {
    let progressPercent = (audio.currentTime / audio.duration) * 100;

    progress.value = progressPercent;

    progress.style.background = `linear-gradient(to right, #6218FF ${progressPercent}%, #ddd ${progressPercent}%)`;

    currentTimeEl.textContent = formatTime(audio.currentTime);
}

// Seek functionality (User moves the progress bar manually)
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
    updateProgress();
});

// Format time in MM:SS
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
