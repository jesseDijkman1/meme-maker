const express = require("express"),
      session = require("express-session"),
      ejs = require("ejs"),
      path = require("path"),
      fs = require("fs"),
      https = require('https');

const port = process.env.PORT || 3000;

let users = {},
    memes = {}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static("public"));
app.use(session({secret: "Shh, its a secret!"}));

class Meme {
  constructor(data) {
    this.userID = data.userID;
    this.step = data.step;
    this.imgName;
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs", {
    sessionID: req.session.id
  })
});

app.get("/meme-maker", async (req, res) => {
  const step = parseInt(req.query.s),
        sessionID = req.query.id,
        imgSrc = req.query.img || undefined;

  if (!sessionID || !step) return res.redirect("/");

  switch (step) {
    case 1:
      memes[sessionID] = new Meme({
        userID: sessionID,
        step: step
      })

      const data = await getData("https://api.imgflip.com/get_memes");

      res.render("imagePicker.ejs", {sessionID: sessionID, data: data.data.memes})
      break;

    case 2:
      res.render("editor.ejs", {
        sessionID: sessionID,
        imgSrc: imgSrc
      })
      break;
  }
})


function getData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";

      // A chunk of data has been recieved.
      res.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on("end", () => {
        resolve(JSON.parse(data))
      });

    }).on("error", err => {
      console.log("Error: " + err.message);
    });
  })
}

app.listen(port, () => console.log(`Listening to port: ${port}`));
