const express = require("express"),
      session = require("express-session"),
      ejs = require("ejs"),
      // multer  = require("multer"),
      path = require("path"),
      fs = require("fs"),
      https = require('https');


// // ===== Multer ===== //
// const storage = multer.diskStorage({
//   destination: "./tempImgStorage",
//   filename: (req, file, callback) => callback(null, `${file.fieldname}-${req.session.id}${path.extname(file.originalname)}`)
// })

// const upload = multer({storage: storage})

const port = 3000;

let users = {},
    memes = {}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static("public"));
// app.use(express.static('tempImgStorage'));
app.use(session({secret: "Shh, its a secret!"}));

class Meme {
  constructor(data) {
    this.userID = data.userID;
    this.step = data.step;
    this.imgName;
  }

  // remove() {
  //   fs.readdir("tempImgStorage", (err, files) => {
  //     if (files.length) {
  //       fs.unlink(`tempImgStorage/${this.imgName}`, (err) => {
  //         if (err) throw err;
  //       });
  //     }
  //   })
  // }
}

// function cleanImgStorage(sessions) {
//   const allSessions = Object.keys(sessions);
//
//   if (Object.keys(memes).length) {
//     for (let meme in memes) {
//       if (!allSessions.includes(memes[meme].userID)) {
//         memes[meme].remove()
//       }
//     }
//   }

//   fs.readdir("tempImgStorage", (err, files) => {
//     files.forEach(file => {
//       const rx = /(?<=meme-).[^\.]+(?=.\w+)/;
//       const fileId = rx.exec(file)[0]
//
//       if (!allSessions.includes(fileId)) {
//         fs.unlink(`tempImgStorage/${file}`, (error) => {
//           if (error) throw error;
//         });
//       }
//     })
//   })
//
//
// }

app.get("/", (req, res) => {
  // if (memes[req.session.id]) {
  //   memes[req.session.id].remove()
  // }

  // cleanImgStorage(req.sessionStore.sessions)

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
    console.log(imgSrc)
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

// app.post('/uploadIMG', upload.single("meme"), (req, res) => {
//   const sessionID = req.body.sessionID,
//         fileName = req.file.filename;
//
//   memes[sessionID].imgName = fileName;
//
//   res.redirect(`/meme-maker?s=2&id=${sessionID}`)
// })

// app.post("/saveMeme", upload.single("meme"), (req, res) => {
//   console.log(req.file)
// })

app.listen(port, () => console.log(`Listening to port: ${port}`));
