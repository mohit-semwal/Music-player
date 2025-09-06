// Song Controller
let masterPlay = document.getElementById("masterPlay");
let previousBtn = document.getElementById("previousBtn");
let nextBtn = document.getElementById("nextBtn");
let shuffleBtn = document.getElementById("shuffleBtn");
let myProgressBar = document.getElementById("myProgressBar");
let myVolume = document.getElementById("myVolume");

let playMusic = new Audio();
let songPlay = document.querySelectorAll(".songPlay");
let songCurrentTime = document.querySelectorAll(".timeStamp");

let songIndex;
let isShuffle = false;

let songs = [
    { songName: "Ae Dil Hai Mushkil", filePath: "./assets/songs/Ae-Dil-Hai-Mushkil.mp3", coverImage: "./assets/cover_Img/cover-img1.jpg" },
    { songName: "Aye Khuda", filePath: "./assets/songs/Aye-Khuda.mp3", coverImage: "./assets/cover_Img/cover-img2.jpg" },
    { songName: "Banjaara", filePath: "./assets/songs/Banjaara.mp3", coverImage: "./assets/cover_Img/cover-img3.jpg" },
    { songName: "Bewafa Nikli Hai Tu", filePath: "./assets/songs/Bewafa-Nikli-Hai-Tu.mp3", coverImage: "./assets/cover_Img/cover-img4.jpg" },
    { songName: "Haye Mera Dil", filePath: "./assets/songs/Haye-Mera-Dil.mp3", coverImage: "./assets/cover_Img/cover-img5.jpg" },
    { songName: "Main Dhoondne Ko", filePath: "./assets/songs/Main-Dhoondne-Ko.mp3", coverImage: "./assets/cover_Img/cover-img6.jpg" },
    { songName: "Tu Hi Haqeeqat", filePath: "./assets/songs/Tu-Hi-Haqeeqat.mp3", coverImage: "./assets/cover_Img/cover-img7.jpg" },
    { songName: "Yeh Shaam Mastani", filePath: "./assets/songs/Yeh-Shaam-Mastani.mp3", coverImage: "./assets/cover_Img/cover-img8.jpg" },
    { songName: "Zaroorat", filePath: "./assets/songs/Zaroorat.mp3", coverImage: "./assets/cover_Img/cover-img9.jpg" },
    { songName: "Zaroori Tha", filePath: "./assets/songs/Zaroori-Tha.mp3", coverImage: "./assets/cover_Img/cover-img10.jpg" }
];




// Helper: format time
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

// Reset all mini icons
let makeAllPlays = () => {
    songPlay.forEach(icon => {
        icon.classList.remove("fa-circle-pause");
        icon.classList.add("fa-circle-play");
    });
};

// Update song durations in UI
songs.forEach((s, index) => {
    let audio = new Audio(s.filePath);
    audio.addEventListener("loadedmetadata", () => {
        if (songCurrentTime[index]) {
            songCurrentTime[index].textContent = formatTime(audio.duration);
        }
    });
});

// Update current song time
playMusic.addEventListener("timeupdate", () => {
    if (songIndex !== undefined && songCurrentTime[songIndex]) {
        songCurrentTime[songIndex].textContent = formatTime(playMusic.currentTime);
    }
    let progress = (playMusic.currentTime / playMusic.duration) * 100;
    myProgressBar.value = progress;
});

// Reset song duration
function resetCurrentTime(index) {
    if (index === undefined) return;
    let audio = new Audio(songs[index].filePath);
    audio.addEventListener("loadedmetadata", () => {
        songCurrentTime[index].textContent = formatTime(audio.duration);
    });
}

// Play a song
function playSong(index) {
    songIndex = index;

    if (playMusic.src !== songs[songIndex].filePath) {
        playMusic.src = songs[songIndex].filePath;
        playMusic.currentTime = 0;
    }

    playMusic.play();
    masterPlay.classList.remove("fa-circle-play");
    masterPlay.classList.add("fa-circle-pause");

    makeAllPlays();
    songPlay[songIndex].classList.remove("fa-circle-play");
    songPlay[songIndex].classList.add("fa-circle-pause");
}

// Master play/pause
masterPlay.addEventListener("click", () => {
    if (songIndex === undefined) songIndex = 0;

    if (playMusic.paused) {
        playMusic.play();
        masterPlay.classList.remove("fa-circle-play");
        masterPlay.classList.add("fa-circle-pause");
        songPlay[songIndex]?.classList.remove("fa-circle-play");
        songPlay[songIndex]?.classList.add("fa-circle-pause");
    } else {
        playMusic.pause();
        masterPlay.classList.add("fa-circle-play");
        masterPlay.classList.remove("fa-circle-pause");
        songPlay[songIndex]?.classList.remove("fa-circle-pause");
        songPlay[songIndex]?.classList.add("fa-circle-play");
    }
});

// Next song
nextBtn.addEventListener("click", () => {
    let prevIndex = songIndex;
    if (isShuffle) {
        let randomIndex;
        do { randomIndex = Math.floor(Math.random() * songs.length); } while (randomIndex === songIndex);
        songIndex = randomIndex;
    } else {
        songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    }
    resetCurrentTime(prevIndex);
    playSong(songIndex);
});

// Previous song
previousBtn.addEventListener("click", () => {
    let prevIndex = songIndex;
    if (isShuffle) {
        let randomIndex;
        do { randomIndex = Math.floor(Math.random() * songs.length); } while (randomIndex === songIndex);
        songIndex = randomIndex;
    } else {
        songIndex = (songIndex <= 0) ? songs.length - 1 : songIndex - 1;
    }
    resetCurrentTime(prevIndex);
    playSong(songIndex);
});

// Shuffle button
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? "blue" : "white";

    if (isShuffle) {
        // Play random song immediately if none is playing
        if (!playMusic.src || playMusic.paused) {
            let randomIndex = Math.floor(Math.random() * songs.length);
            if (songIndex !== undefined) {
                while (randomIndex === songIndex) randomIndex = Math.floor(Math.random() * songs.length);
            }
            playSong(randomIndex);
        } else {
            // Stop current and play new random
            let randomIndex;
            do { randomIndex = Math.floor(Math.random() * songs.length); } while (randomIndex === songIndex);
            playSong(randomIndex);
        }
    }
});

// Song ended: auto-next
playMusic.addEventListener("ended", () => {
    let prevIndex = songIndex;
    if (isShuffle) {
        let randomIndex;
        do { randomIndex = Math.floor(Math.random() * songs.length); } while (randomIndex === songIndex);
        songIndex = randomIndex;
    } else {
        songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
    }
    resetCurrentTime(prevIndex);
    playSong(songIndex);
});

// Progress bar
myProgressBar.addEventListener("input", () => {
    playMusic.currentTime = (myProgressBar.value * playMusic.duration) / 100;
});

// Volume
myVolume.addEventListener("input", () => {
    playMusic.volume = myVolume.value / 15;
});

// Mini icons
songPlay.forEach((icon, index) => {
    icon.addEventListener("click", () => {
        let prevIndex = songIndex;
        if (songIndex !== index) {
            resetCurrentTime(prevIndex);
            playSong(index);
        } else {
            // Toggle pause/play
            if (playMusic.paused) {
                playMusic.play();
                masterPlay.classList.remove("fa-circle-play");
                masterPlay.classList.add("fa-circle-pause");
                icon.classList.remove("fa-circle-play");
                icon.classList.add("fa-circle-pause");
            } else {
                playMusic.pause();
                masterPlay.classList.add("fa-circle-play");
                masterPlay.classList.remove("fa-circle-pause");
                icon.classList.remove("fa-circle-pause");
                icon.classList.add("fa-circle-play");
            }
        }
    });
});

