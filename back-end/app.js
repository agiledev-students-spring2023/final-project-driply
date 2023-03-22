require("dotenv").config({ silent: true });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

// Set up Express app
const app = express();
app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.post("/post-form", upload.single("image"), (req, res) => {
  if (req.file) {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.filename,
    };
    res.json(data);
  } else throw "error";
});

module.exports = app;
