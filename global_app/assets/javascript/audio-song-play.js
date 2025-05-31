
document.addEventListener("DOMContentLoaded", () => {
    const voiceCards = document.querySelectorAll(".ai-voice-car-main");

    voiceCards.forEach((card) => {
        const playButton = card.querySelector(".play-btn");
        const playIcon = card.querySelector(".play-icon");
        const audioPlayer = card.querySelector(".audio-player");
        const selectButton = card.querySelector(".select .main-bg-color-btn");
        const musicGraph = card.querySelector(".music-graph");
        const waveform = card.querySelector(".waveform-animation");

        if (!playButton || !audioPlayer || !selectButton) {
            console.error("Missing elements inside ai-voice-car-main.");
            return;
        }

        // Toggle Play/Pause
        playButton.addEventListener("click", () => {
            if (audioPlayer.paused) {
                document.querySelectorAll(".audio-player").forEach((audio) => {
                    if (audio !== audioPlayer) {
                        audio.pause();
                        audio.currentTime = 0; 
                        const otherCard = audio.closest(".ai-voice-car-main");
                        if (otherCard) {
                            const otherPlayIcon = otherCard.querySelector(".play-icon");
                            const otherPlayButton = otherCard.querySelector(".play-btn");
                            const otherWaveform = otherCard.querySelector(".waveform-animation");
                            const otherMusicGraph = otherCard.querySelector(".music-graph");
                            if (otherPlayIcon) otherPlayIcon.src = "assets/images/svg/play-btn.svg";
                            if (otherPlayButton) otherPlayButton.classList.remove("playing");
                            if (otherWaveform) otherWaveform.style.display = "none";
                            if (otherMusicGraph) otherMusicGraph.style.display = "inline-block";
                        }
                    }
                });

                audioPlayer.play();
                playIcon.src = "assets/images/svg/pause-btn.svg"; 
                playButton.classList.add("playing");
            } else {
                audioPlayer.pause();
                playIcon.src = "assets/images/svg/play-btn.svg"; 
                playButton.classList.remove("playing"); 
            }
        });

        // Show Music Graph on Select Button when playing
        audioPlayer.addEventListener("play", () => {
            if (musicGraph) musicGraph.style.display = "none"; 
            if (waveform) waveform.style.display = "flex"; 
        });

        // Hide waveform when paused
        audioPlayer.addEventListener("pause", () => {
            if (musicGraph) musicGraph.style.display = "inline-block"; 
            if (waveform) waveform.style.display = "none"; 
        });

        // Reset UI when the song ends
        audioPlayer.addEventListener("ended", () => {
            playIcon.src = "assets/images/svg/play-btn.svg"; 
            playButton.classList.remove("playing"); 
            if (musicGraph) musicGraph.style.display = "inline-block"; 
            if (waveform) waveform.style.display = "none"; 
        });
    });
});
