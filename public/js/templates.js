"use strict";

const images = document.querySelectorAll("#meme-templates a");

for (let i = 0; i < images.length; i++) {
  if (i === 0) {
    // setTimeout(() => {
      images[i].focus()
      images[i].addEventListener("keydown", switchTarget)
    // }, 0)

  } else {
    images[i].addEventListener("focus", () => {
      images[i].addEventListener("keydown", switchTarget)
    })
  }


}

async function switchTarget(e) {
  const allowedKeys = [37, 38, 39, 40, 32];
  let rowEl;

  if (allowedKeys.includes(e.keyCode)) {
    e.preventDefault()

    switch (e.keyCode) {
      case 37: // Arrow Left
        e.target.previousElementSibling.focus()
      break;

      case 38: // Arrow Up
        rowEl = await getRow(e.target, "up")
        rowEl.focus()
      break;

      case 39: // Arrow Right
        e.target.nextElementSibling.focus()
      break;

      case 40: // Arrow Down
        rowEl = await getRow(e.target, "down")
        rowEl.focus()
      break;

      case 32: // Space
        e.target.click()
      break;
    }
  }
}

function getRow(el, where) {
  const selfTop = el.offsetTop;

    if (where === "up") {
      if (el.previousElementSibling.offsetTop < selfTop) {
        return Promise.resolve(el.previousElementSibling)
      } else {
        return getRow(el.previousElementSibling, "up")
      }
    } else {
      if (el.nextElementSibling.offsetTop > selfTop) {
        return Promise.resolve(el.nextElementSibling)
      } else {
        return getRow(el.nextElementSibling, "down")
      }
    }
}
