"use strict";

const images = document.querySelectorAll("#meme-templates a");

for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("keypress", switchTarget)
}

function switchTarget(e) {
  switch (e.keyCode) {
    case 37: // Arrow Left

    break;

    case 38: // Arrow Up
    break;

    case 39: // Arrow Right
    break;

    case 40: // Arrow Down

    break;
  }
}
