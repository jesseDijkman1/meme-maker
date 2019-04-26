"use strict";
const canvas = document.getElementById("meme-canvas");

const topTxtInput = document.querySelector(".editor-section.section-top input[type=text]");
const bottomTxtInput = document.querySelector(".editor-section.section-bottom input[type=text]");

const topTxtSizeInput = document.querySelector(".editor-section.section-top input[type=number]");
const bottomTxtSizeInput = document.querySelector(".editor-section.section-bottom input[type=number]");

const autoTxtPosInput = document.getElementById("auto-position");
const topTxtPosInput = document.getElementById("top-txt-position");
const bottomTxtPosInput = document.getElementById("bottom-txt-position");

const colorSliders = document.querySelectorAll(".color-slider input[type=range]");
const colorPreview = document.getElementById("color-preview");

const downloadBtn = document.getElementById("download-meme");

const editorSections = document.getElementsByClassName("editor-section");
const sectionButtons = document.getElementsByClassName("section-button");
// const nextBtn = document.querySelectorAll(".section-button.next");

class Meme {
  constructor(c) {
    this.cWidth;
    this.cHeight;
    this.canvas = c;
    this.ctx = c.getContext("2d");
    this.img;
    this.contentTop = "";
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
        this.topPos = {x: this.cWidth / 2, y: this.cHeight / 20};
        this.bottomPos = {x: this.cWidth / 2, y: this.cHeight - this.cHeight / 20};

        this.topSize = this.cHeight * .10
        this.bottomSize = this.cHeight * .10

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
    this.ctx.font = `${this.topSize}px Impact`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";

    this.ctx.fillText(this.contentTop, this.topPos.x, this.topPos.y);

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = this.topSize * .05 + .5;
    this.ctx.strokeText(this.contentTop, this.topPos.x, this.topPos.y);

    // Step 4: Set the size of the bottom text and draw the text
    this.ctx.font = `${this.bottomSize}px Impact`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "alphabetic";

    this.ctx.fillText(this.contentBottom, this.bottomPos.x, this.bottomPos.y);

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = this.topSize * .05 + .5;
    this.ctx.strokeText(this.contentBottom, this.bottomPos.x, this.bottomPos.y);
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

  topTxtPos() {
    // this.topPos = parseInt(e.target.value)
    this.update()
  }

  bottomTxtPos() {
    // this.bottomPos = this.cHeight - parseInt(e.target.value)
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

const numberKeys = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5,
  54: 6,
  55: 7,
  56: 8,
  57: 9
}

topTxtInput.addEventListener("keydown", e => {
  setTimeout(() => meme.topTxt(e), 0)
});
//
bottomTxtInput.addEventListener("keydown", e => {
  setTimeout(() => meme.bottomTxt(e), 0)
});



topTxtSizeInput.addEventListener("keydown", e => {

  if (numberKeys[e.keyCode]) {
    e.preventDefault()

    e.target.value = ((parseInt(e.target.value)) ? parseInt(e.target.value) : 0) + numberKeys[e.keyCode]
  }

  setTimeout(() => meme.topTxtSize(e), 0)
});

bottomTxtSizeInput.addEventListener("keydown", e => {
  if (numberKeys[e.keyCode]) {
    e.preventDefault()

    e.target.value = ((parseInt(e.target.value)) ? parseInt(e.target.value) : 0) + numberKeys[e.keyCode]
  }

  setTimeout(() => meme.bottomTxtSize(e), 0)
});

// topTxtPosInput.addEventListener("keydown", e => {
//   if (keys[e.keyCode]) {
//     e.preventDefault()
//
//     e.target.value = parseInt(e.target.value) + keys[e.keyCode]
//   }
//
//   setTimeout(() => meme.topTxtPos(e), 0)
// })
//
// bottomTxtPosInput.addEventListener("keydown", e => {
//   if (keys[e.keyCode]) {
//     e.preventDefault()
//
//     e.target.value = parseInt(e.target.value) + keys[e.keyCode]
//   }
//
//   setTimeout(() => meme.bottomTxtPos(e), 0)
// })
//
// autoTxtPosInput.addEventListener("change", e => {
//   setTimeout(() => meme.autoTxtPos(e), 0)
// })

void function() {
  const colors = {}

  // function updateColor(colorType) {
  //   const type = colorType;
  //   const data = colors[colorType];
  //
  //   const color = `${type}(${Object.keys(data).map(key => {
  //     return `${data[key].value}${data[key].unit}`
  //   }).join(",")})`
  //
  //   colorPreview.style.setProperty("background", color)
  //
  //   meme.updateTxtColor(color);
  // }



  // for (let i = 0; i < colorSliders.length; i++) {
  //   if (!colors[colorSliders[i].dataset.colorType]) {
  //     colors[colorSliders[i].dataset.colorType] = {}
  //   }
  //
  //   colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char] = {
  //     value: colorSliders[i].value,
  //     unit: colorSliders[i].dataset.unit || ""
  //   };


  for (let i = 0; i < sectionButtons.length; i++) {
    sectionButtons[i].addEventListener("click", goToSection)
  }

  for (let i = 0; i < editorSections.length; i++) {
    if (i === 0) {
      selectInput(editorSections[i]).focus()
    }



    if (selectInput(editorSections[i]).classList.contains("positioner")) {
      positioner(editorSections[i])
    } else {
      selectInput(editorSections[i]).addEventListener("keydown", switchTarget)
    }



    editorSections[i].addEventListener("click", e => {
      if (e.target.nodeName != "BUTTON") {
        selectInput(editorSections[i]).focus()
        // editorSections[i].querySelector("input[type=text]").focus();
      }
    })
  }
    // const keys = {
    //   37: -1,
    //   38: 10,
    //   39: 1,
    //   40: -10,
    //   188: -30,
    //   190: 30
    // }

  //
  //
  //   let valDisplay;
  //
  //   if (colorSliders[i].nextElementSibling.classList.contains("slider-val")) {
  //     valDisplay = colorSliders[i].nextElementSibling
  //     valDisplay.max = colorSliders[i].max;
  //     valDisplay.min = colorSliders[i].min;
  //     valDisplay.value = colorSliders[i].value;
  //   }
  //
  //   valDisplay.addEventListener("keydown", (e) => {
  //     let val = parseInt(colorSliders[i].value);
  //
  //     if (keys[e.keyCode]) {
  //       e.preventDefault()
  //
  //       val += keys[e.keyCode];
  //     }
  //
  //     if (val < parseInt(colorSliders[i].max) && val > parseInt(colorSliders[i].min)) {
  //       colorSliders[i].value = val;
  //     } else {
  //       if (val >= parseInt(colorSliders[i].max)) {
  //         colorSliders[i].value = colorSliders[i].max
  //       } else {
  //         colorSliders[i].value = colorSliders[i].min
  //       }
  //     }
  //
  //     colorSliders[i].value = val;
  //
  //     colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = val;
  //
  //     updateColor(colorSliders[i].dataset.colorType)
  //   })
  //
  //   colorSliders[i].addEventListener("keydown", (e) => {
  //     let val = parseInt(colorSliders[i].value);
  //
  //     if (keys[e.keyCode]) {
  //       e.preventDefault()
  //
  //       val += keys[e.keyCode];
  //
  //       colorSliders[i].value = val;
  //
  //       valDisplay.value = colorSliders[i].value;
  //
  //       colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = val;
  //
  //       updateColor(colorSliders[i].dataset.colorType)
  //     }
  //   })
  //
  //   colorSliders[i].addEventListener("change", (e) => {
  //     valDisplay.value = colorSliders[i].value;
  //
  //     colors[colorSliders[i].dataset.colorType][colorSliders[i].dataset.char].value = colorSliders[i].value;
  //
  //     updateColor(colorSliders[i].dataset.colorType)
  //   })
  // }
  //
  // updateColor("rgb");
}()

function goToSection(e) {
  const parent = e.target.parentElement.parentElement;

  parent.classList.add("disappear");

  setTimeout(() => {
    parent.classList.remove("disappear");
    parent.removeAttribute("data-selected");

    // console.log(parent)
    if (e.target.classList.contains("previous")) {
      parent.previousElementSibling.classList.add("show");
      parent.previousElementSibling.setAttribute("data-selected", null)

      selectInput(parent.previousElementSibling).focus()
    }

    if (e.target.classList.contains("next")) {
      parent.nextElementSibling.classList.add("show");
      parent.nextElementSibling.setAttribute("data-selected", null)

      selectInput(parent.nextElementSibling).focus()
    }
  }, 400)
}


function selectInput(el) {
  if (!el.querySelector("input:first-of-type")) {
    return el.querySelector("button.positioner")
  }

  return el.querySelector("input:first-of-type")
}

function switchTarget(e) {
  const allowedKeys = [38, 40, 32];
  if (allowedKeys.includes(e.keyCode)) {


    switch (e.keyCode) {
      case 38: // Arrow Up
      e.preventDefault()
      console.log("Up")
      if (!e.target.previousElementSibling) {
        e.target.parentElement.previousElementSibling.focus()
        e.target.parentElement.previousElementSibling.addEventListener("keydown", switchTarget)
      } else {
        e.target.previousElementSibling.focus()
        e.target.previousElementSibling.addEventListener("keydown", switchTarget)
      }
      break;

      case 40: // Arrow Down
      e.preventDefault()
      console.log("ofaijwe")
      if (e.target.nextElementSibling.nodeName == "FOOTER") {
        e.target.nextElementSibling.firstElementChild.focus()
        e.target.nextElementSibling.firstElementChild.addEventListener("keydown", switchTarget)
      }

      if (!e.target.nextElementSibling) {
        e.target.parentElement.nextElementSibling.focus()
        e.target.parentElement.nextElementSibling.addEventListener("keydown", switchTarget)
      } else {
        e.target.nextElementSibling.focus()
        e.target.nextElementSibling.addEventListener("keydown", switchTarget)
      }
      break;

      case 32: // Space
        // if (e.target.nodeName === "BUTTON") {

          // e.target.click()
        // }

      break;
    }
  }
}

function positioner(el) {
  console.log(el)
  let state = false
  let tst = 1;

  // selectInput(el).addEventListener("keyup", e => {
  //   state = false;
  //   tst = 1
  //   e.target.classList.remove("moving")
  // })

  // selectInput(el).addEventListener("keypress", e => {
  //   console.log("pressed")
  // })

  selectInput(el).addEventListener("keyup", e => {
    tst = 1;
  })

  selectInput(el).addEventListener("keydown", e => {
    console.log(state)
    if (e.keyCode == 32) {
      if (state == false) {
        state = true
        e.target.classList.add("moving")
      } else {
        state = false
        e.target.classList.remove("moving")
      }
    }

    if (state) {
      tst += .1;

      switch (e.keyCode) {
        case 37: // Arrow Left
        if (e.target.classList.contains("top")) {
          meme.topPos.x -= tst;
        } else {
          meme.bottomPos.x -= tst;
        }
          // setTimeout(() => meme.topTxtPos(), 0)
        break;

        case 38: // Arrow Up
        if (e.target.classList.contains("top")) {
          meme.topPos.y -= tst
        } else {
          meme.bottomPos.y -= tst
        }
          // setTimeout(() => meme.topTxtPos(), 0)
        break;

        case 39: // Arrow Right

        if (e.target.classList.contains("top")) {
          meme.topPos.x += tst;
        } else {
          meme.bottomPos.x += tst;
        }

          // setTimeout(() => meme.topTxtPos(), 0)
        break;

        case 40: // Arrow Down
        if (e.target.classList.contains("top")) {
          meme.topPos.y += tst;
        } else {
          meme.bottomPos.y += tst;
        }
        break;
      }

      setTimeout(() => meme.topTxtPos(e), 0)
    } else {
      if (e.keyCode == 40) {
        // Arrow down
        e.target.nextElementSibling.querySelector("button.previous").focus()
        e.target.nextElementSibling.querySelector("button.previous").addEventListener("keydown", ev => {
          if (ev.keyCode == 38) {
            e.target.focus()
          }
          if (ev.keyCode == 40) {
            ev.target.nextElementSibling.focus()
            ev.target.nextElementSibling.addEventListener("keydown", eve => {
              if (eve.keyCode == 38) {
                ev.target.focus()
              }
            })
          }
        })

      }
    }
  })
}
