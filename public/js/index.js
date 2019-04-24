"use strict";
// (() => {
const canvas = document.getElementById("meme-canvas");
// const ctx = canvas.getContext("2d");

const topTxtInput = document.getElementById("top-txt");
const bottomTxtInput = document.getElementById("bottom-txt");

const topTxtSizeInput = document.getElementById("top-txt-size");
const bottomTxtSizeInput = document.getElementById("bottom-txt-size");

const autoTxtPosInput = document.getElementById("auto-position");
const topTxtPosInput = document.getElementById("top-txt-position");
const bottomTxtPosInput = document.getElementById("bottom-txt-position");

const colorSliders = document.querySelectorAll(".color-slider input[type=range]");
const colorPreview = document.getElementById("color-preview");

const downloadBtn = document.getElementById("download-meme");

class Meme {
  constructor(c) {
    this.cWidth;
    this.cHeight;
    this.canvas = c;
    this.ctx = c.getContext("2d");
    this.img;
    this.contentTop = "Hello \n World";
    this.contentBottom = "";
    this.topSize = 16;
    this.bottomSize = 16;
    this.color;
    this.topPos;
    this.bottomPos;
    this.topTxt.bind(this)
    this.bottomTxt.bind(this)
    this.topTxtSize.bind(this)
    this.bottomTxtSize.bind(this)

    this.createImage().then(this.update.bind(this))
  }

  createImage() {
    return new Promise((resolve, reject) => {
      this.img = new Image()
      this.img.src = this.canvas.dataset.img;

      this.img.onload = e => {
        this.cWidth = e.target.width;
        this.cHeight = e.target.height;
        this.topPos = this.cHeight / 20;
        this.bottomPos = this.cHeight - this.cHeight / 20;

        this.canvas.setAttribute("width", this.cWidth);
        this.canvas.setAttribute("height", this.cHeight);

        resolve()
      }
    })
  }

  update() {
    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

    // Step 1: Draw the background
    this.ctx.drawImage(this.img, 0, 0);

    // Step 2: Set the color of the text
    this.ctx.fillStyle = this.color || "white";

    // Step 3: Set the size of the top text and draw the text
    this.ctx.font = `${this.topSize}px Comic Sans MS`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.contentTop, this.cWidth / 2, this.topPos);

    // Step 4: Set the size of the bottom text and draw the text
    this.ctx.font = `${this.bottomSize}px Comic Sans MS`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "alphabetic";
    this.ctx.fillText(this.contentBottom, this.cWidth / 2, this.bottomPos);
  }

  topTxt(e) {
    this.contentTop = e.target.value;
    this.update()
  }

  bottomTxt(e) {
    this.contentBottom = e.target.value;
    this.update()
  }

  topTxtSize(e) {
    this.topSize = parseInt(e.target.value);
    this.update()
  }

  bottomTxtSize(e) {
    this.bottomSize = parseInt(e.target.value);
    this.update()
  }

  topTxtPos(e) {
    this.topPos = parseInt(e.target.value)
    this.update()
  }

  bottomTxtPos(e) {
    this.bottomPos = this.cHeight - parseInt(e.target.value)
    this.update()
  }

  autoTxtPos(e) {
    if (e.target.checked) {
      this.topPos = this.cHeight / 20;
      this.bottomPos = this.cHeight - this.cHeight / 20;
    }

    this.update()
  }

  updateTxtColor(color) {
    this.color = color;
    this.update()
  }
}

const meme = new Meme(canvas);

const keys = {
  37: -1,
  38: 10,
  39: 1,
  40: -10,
  188: -30,
  190: 30
}

topTxtInput.addEventListener("keydown", e => {
  setTimeout(() => meme.topTxt(e), 0)
});

bottomTxtInput.addEventListener("keydown", e => {
  setTimeout(() => meme.bottomTxt(e), 0)
});

topTxtSizeInput.addEventListener("keydown", e => {

  if (keys[e.keyCode]) {
    e.preventDefault()

    e.target.value = parseInt(e.target.value) + keys[e.keyCode]
  }

  setTimeout(() => meme.topTxtSize(e), 0)
});

bottomTxtSizeInput.addEventListener("keydown", e => {
  if (keys[e.keyCode]) {
    e.preventDefault()

    e.target.value = parseInt(e.target.value) + keys[e.keyCode]
  }

  setTimeout(() => meme.bottomTxtSize(e), 0)
});

topTxtPosInput.addEventListener("keydown", e => {
  if (keys[e.keyCode]) {
    e.preventDefault()

    e.target.value = parseInt(e.target.value) + keys[e.keyCode]
  }

  setTimeout(() => meme.topTxtPos(e), 0)
})

bottomTxtPosInput.addEventListener("keydown", e => {
  if (keys[e.keyCode]) {
    e.preventDefault()

    e.target.value = parseInt(e.target.value) + keys[e.keyCode]
  }

  setTimeout(() => meme.bottomTxtPos(e), 0)
})

autoTxtPosInput.addEventListener("change", e => {
  setTimeout(() => meme.autoTxtPos(e), 0)
})

void function() {
  const colors = {}

  function updateColor(colorType) {
    const type = colorType;
    const data = colors[colorType];

    const color = `${type}(${Object.keys(data).map(key => {
      return `${data[key].value}${data[key].unit}`
    }).join(",")})`

    colorPreview.style.setProperty("background", color)

    meme.updateTxtColor(color);
  }



  for (let i = 0; i < colorSliders.length; i++) {
    if (!colors[colorSliders[i].dataset.colorType]) {
      colors[colorSliders[i].dataset.colorType] = {}
    }

    colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char] = {
      value: colorSliders[i].value,
      unit: colorSliders[i].dataset.unit || ""
    };
    //
    // const keys = {
    //   37: -1,
    //   38: 10,
    //   39: 1,
    //   40: -10,
    //   188: -30,
    //   190: 30
    // }



    let valDisplay;

    if (colorSliders[i].nextElementSibling.classList.contains("slider-val")) {
      valDisplay = colorSliders[i].nextElementSibling
      valDisplay.max = colorSliders[i].max;
      valDisplay.min = colorSliders[i].min;
      valDisplay.value = colorSliders[i].value;
    }

    valDisplay.addEventListener("keydown", (e) => {
      let val = parseInt(colorSliders[i].value);

      if (keys[e.keyCode]) {
        e.preventDefault()

        val += keys[e.keyCode];
      }

      if (val < parseInt(colorSliders[i].max) && val > parseInt(colorSliders[i].min)) {
        colorSliders[i].value = val;
      } else {
        if (val >= parseInt(colorSliders[i].max)) {
          colorSliders[i].value = colorSliders[i].max
        } else {
          colorSliders[i].value = colorSliders[i].min
        }
      }

      colorSliders[i].value = val;

      colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = val;

      updateColor(colorSliders[i].dataset.colorType)
    })

    colorSliders[i].addEventListener("keydown", (e) => {
      let val = parseInt(colorSliders[i].value);

      if (keys[e.keyCode]) {
        e.preventDefault()

        val += keys[e.keyCode];

        colorSliders[i].value = val;

        valDisplay.value = colorSliders[i].value;

        colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = val;

        updateColor(colorSliders[i].dataset.colorType)
      }
    })

    colorSliders[i].addEventListener("change", (e) => {
      valDisplay.value = colorSliders[i].value;

      colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = colorSliders[i].value;

      updateColor(colorSliders[i].dataset.colorType)
    })
  }

  updateColor("rgb");
}()
