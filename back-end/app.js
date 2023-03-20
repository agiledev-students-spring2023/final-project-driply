require("dotenv").config({ silent: true });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
