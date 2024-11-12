
const videoLinks = [
    
    "placeholder.mp4"
    
];

function getRandomVideoLink() {
    const randomIndex = Math.floor(Math.random() * videoLinks.length);
    return videoLinks[randomIndex];
}

document.addEventListener('DOMContentLoaded', function () {
    const randomEpisodeLink = document.getElementById('randomEpisodeLink');
    const randomLink = getRandomVideoLink();
    randomEpisodeLink.href = `player.html?${randomLink}`;
});