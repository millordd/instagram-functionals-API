const jsonServer = require("json-server");
const express = require("express");
const auth = require("json-server-auth");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();

const server = jsonServer.create();
const router = jsonServer.router("db.json");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer
const upload = multer({ storage: storage });
app.use(cors());
app.post("/upload", upload.single("file"), async (req, res) => {
  const imageUrl = req.file;
  console.log(imageUrl);
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  } else {
    return res.send({ img: imageUrl });
  }
});

app.post("/uploads", upload.array("files", 10), async (req, res) => {
  const imageUrl = req.files;
  console.log(imageUrl);
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  } else {
    return res.send({ img: imageUrl });
  }
});

app.use("/uploads", express.static("./uploads"));

server.db = router.db;

server.use(auth);
server.use(router);
app.use("/api", server);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
