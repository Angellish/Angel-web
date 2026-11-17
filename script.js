/* ==========================================================
   ANGEL. — MUSIC PLAYER & INTERACTIONS
   ADDING A PLAYABLE SONG:
   1) Upload the audio file to the same GitHub folder as index.html.
   2) Add one object to the playlist array below.
   3) The src value must exactly match the uploaded filename (including spaces/capital letters).
   Example:
   { title: "Sweater Weather", artist: "The Neighbourhood", src: "Sweater Weather.mp3" }
   ========================================================== */

const playlist = [
  {
    title: "PLAY",
    artist: "Fairuz · Reema Rahbany",
    src: "Fayrouz  PLAY by Reema Rahbany.m4a"
  },
  {
    title: "وحدن",
    artist: "فيروز",
    src: "Wahdon CD 1 TRACK 5 (320).mp3"
  },
  {
    title: "كيفك انت",
    artist: "فيروز",
    src: "Fairuz - Kifak Inta.mp3"
  },
  {
    title: "عندي ثقة فيك",
    artist: "فيروز",
    src: "Fairuz - Indi Thika Feek.mp3"
  }

  // ADD NEW SONGS BELOW THIS LINE (put a comma after the previous song):
  // {
  //   title: "Sweater Weather",
  //   artist: "The Neighbourhood",
  //   src: "Sweater Weather.mp3"
  // }
];

// ==========================================================
// ANGEL'S GROWING TASTE ARCHIVE
// Add new names to these arrays whenever your taste changes.
// Music taste is separate from the playable audio playlist.
// ==========================================================
const favoriteArtists = [
  "The Neighbourhood", "Lana Del Rey", "The Weeknd", "Lord Huron",
  "10cc", "Arctic Monkeys", "Massive Attack", "Adele",
  "TV Girl", "Kazem Al Saher", "Majid Al Mohandis", "Amr Diab", "Hamaki"
];

const favoriteSongs = [
  "The Night We Met", "Lover, You Should've Come Over", "I'm Not in Love",
  "My Way", "Hot Blooded", "So Far So Fake", "My Moon My Man",
  "Roommates", "Earrings", "Angel", "Fade Into You"
];

const bookCollections = [
  { title: "A Song of Ice and Fire", note: "The world behind Game of Thrones", type: "FANTASY SERIES" },
  { title: "Harry Potter", note: "A wizarding world", type: "FANTASY SERIES" },
  { title: "Twilight", note: "The Twilight Saga", type: "FANTASY / ROMANCE" },
  { title: "The Hunger Games", note: "A dystopian trilogy", type: "DYSTOPIAN SERIES" }
];

const screenCollections = [
  { title: "Marvel Universe", note: "Heroes, antiheroes & connected stories", type: "UNIVERSE" },
  { title: "The 100", note: "Survival, choices & a new world", type: "TV SERIES" },
  { title: "Supernatural", note: "Monsters, mysteries & the Winchester brothers", type: "TV SERIES" },
  { title: "DC Universe", note: "A world of heroes and legends", type: "UNIVERSE" },
  { title: "The Punisher", note: "A darker corner of Marvel", type: "TV SERIES" },
  { title: "Daredevil", note: "Hell's Kitchen", type: "TV SERIES" },
  { title: "Batman", note: "The Dark Knight", type: "CHARACTER / STORIES" },
  { title: "Superman", note: "The Man of Steel", type: "CHARACTER / STORIES" },
  { title: "Bones", note: "Crime, forensic anthropology & mystery", type: "TV SERIES" },
  { title: "The Rookie", note: "A new start in the LAPD", type: "TV SERIES" },
  { title: "The Walking Dead", note: "Survival in a changed world", type: "TV SERIES" }
];

function renderTags(elementId, items) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.innerHTML = "";
  items.forEach(item => {
    const tag = document.createElement("span");
    tag.className = "taste-tag";
    tag.textContent = item;
    target.appendChild(tag);
  });
}

function renderLibrary(listId, countId, searchId, items, countLabel) {
  const list = document.getElementById(listId);
  const count = document.getElementById(countId);
  const search = document.getElementById(searchId);
  if (!list || !count || !search) return;
  const draw = () => {
    const query = search.value.trim().toLowerCase();
    const filtered = items.filter(item => `${item.title} ${item.note} ${item.type}`.toLowerCase().includes(query));
    count.textContent = `${String(filtered.length).padStart(2, "0")} ${countLabel}`;
    list.innerHTML = "";
    if (!filtered.length) {
      list.innerHTML = '<p class="empty-list">Nothing found. Try another title.</p>';
      return;
    }
    filtered.forEach((item, index) => {
      const row = document.createElement("article");
      row.className = "library-item";
      row.innerHTML = `<span class="library-number">${String(index + 1).padStart(2, "0")}</span><div class="library-item-copy"><strong></strong><small></small></div><span class="library-type"></span>`;
      row.querySelector("strong").textContent = item.title;
      row.querySelector("small").textContent = item.note;
      row.querySelector(".library-type").textContent = item.type;
      list.appendChild(row);
    });
  };
  search.addEventListener("input", draw);
  draw();
}

renderTags("artistTags", favoriteArtists);
renderTags("songTags", favoriteSongs);
renderLibrary("bookList", "bookCount", "bookSearch", bookCollections, "COLLECTIONS");
renderLibrary("screenList", "screenCount", "screenSearch", screenCollections, "TITLES");

const audio = document.getElementById("audioPlayer");
const player = document.querySelector(".now-playing");
const record = document.getElementById("record");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const favoriteBtn = document.getElementById("favoriteBtn");
const playlistList = document.getElementById("playlistList");
const songSearch = document.getElementById("songSearch");
const playerMessage = document.getElementById("playerMessage");
const songCount = document.getElementById("songCount");

let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("angel-favorites")) || [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem("angel-favorites", JSON.stringify(favorites));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function renderPlaylist(filter = "") {
  const query = filter.trim().toLowerCase();
  const visibleTracks = playlist
    .map((track, index) => ({ ...track, index }))
    .filter(track => `${track.title} ${track.artist}`.toLowerCase().includes(query));

  songCount.textContent = `${String(playlist.length).padStart(2, "0")} TRACKS`;
  playlistList.innerHTML = "";

  if (!visibleTracks.length) {
    playlistList.innerHTML = '<p class="empty-list">No tracks found. Try another title.</p>';
    return;
  }

  visibleTracks.forEach((track, displayIndex) => {
    const row = document.createElement("div");
    row.className = `song-row${track.index === currentTrackIndex ? " current" : ""}`;
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `Play ${track.title}`);
    row.innerHTML = `
      <span class="song-index">${String(displayIndex + 1).padStart(2, "0")}</span>
      <span class="song-details"><strong></strong><small></small></span>
      <span class="song-duration">${track.index === currentTrackIndex ? "NOW" : "MP3"}</span>
      <button class="song-fav${favorites.includes(track.index) ? " active" : ""}" aria-label="Favorite ${track.title}" title="Favorite">♡</button>
    `;
    row.querySelector("strong").textContent = track.title;
    row.querySelector("small").textContent = track.artist;

    row.addEventListener("click", event => {
      if (event.target.closest(".song-fav")) {
        toggleFavorite(track.index);
        return;
      }
      selectTrack(track.index, true);
    });
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTrack(track.index, true);
      }
    });
    playlistList.appendChild(row);
  });
}

function updateFavoriteButton() {
  const active = favorites.includes(currentTrackIndex);
  favoriteBtn.classList.toggle("active", active);
  favoriteBtn.textContent = active ? "♥" : "♡";
  favoriteBtn.setAttribute("aria-label", active ? "Remove from favorites" : "Add to favorites");
}

function toggleFavorite(index) {
  if (favorites.includes(index)) {
    favorites = favorites.filter(item => item !== index);
  } else {
    favorites.push(index);
  }
  saveFavorites();
  updateFavoriteButton();
  renderPlaylist(songSearch.value);
}

function loadTrack(index) {
  currentTrackIndex = (index + playlist.length) % playlist.length;
  const track = playlist[currentTrackIndex];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  progress.value = 0;
  currentTimeLabel.textContent = "0:00";
  durationLabel.textContent = "0:00";
  updateFavoriteButton();
  renderPlaylist(songSearch.value);
  playerMessage.textContent = "Ready when you are.";
}

async function playAudio() {
  try {
    await audio.play();
  } catch (error) {
    playerMessage.textContent = "Couldn't play this file. Check its name and location.";
    setPlayingState(false);
  }
}

function setPlayingState(playing) {
  player.classList.toggle("is-playing", playing);
  record.classList.toggle("playing", playing);
  playBtn.innerHTML = playing
    ? '<svg class="pause-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>'
    : '<svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 19 12 7 19.5z"/></svg>';
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

async function togglePlay() {
  if (audio.paused) {
    await playAudio();
  } else {
    audio.pause();
  }
}

async function selectTrack(index, autoplay = false) {
  loadTrack(index);
  if (autoplay) await playAudio();
}

async function nextTrack() {
  if (isShuffle && playlist.length > 1) {
    let nextIndex = currentTrackIndex;
    while (nextIndex === currentTrackIndex) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    }
    await selectTrack(nextIndex, true);
  } else {
    await selectTrack((currentTrackIndex + 1) % playlist.length, true);
  }
}

async function previousTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  await selectTrack((currentTrackIndex - 1 + playlist.length) % playlist.length, true);
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", previousTrack);

audio.addEventListener("play", () => {
  setPlayingState(true);
  playerMessage.textContent = "Now playing.";
});
audio.addEventListener("pause", () => setPlayingState(false));
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playAudio();
  } else {
    nextTrack();
  }
});
audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  durationLabel.textContent = formatTime(audio.duration);
});
audio.addEventListener("error", () => {
  if (audio.src) playerMessage.textContent = "Audio file not found. Check the filename in script.js.";
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});
audio.volume = Number(volume.value);

favoriteBtn.addEventListener("click", () => toggleFavorite(currentTrackIndex));

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("selected", isShuffle);
  playerMessage.textContent = isShuffle ? "Shuffle is on." : "Shuffle is off.";
});
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("selected", isRepeat);
  playerMessage.textContent = isRepeat ? "Repeat current track is on." : "Repeat is off.";
});
songSearch.addEventListener("input", () => renderPlaylist(songSearch.value));

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the section currently in view.
const navLinks = [...document.querySelectorAll(".nav-link")];
const observedSections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
observedSections.forEach(section => sectionObserver.observe(section));

// Initial setup
loadTrack(currentTrackIndex);
