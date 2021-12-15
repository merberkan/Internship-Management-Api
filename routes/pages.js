const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({result: 'selamin aleykum'})
    console.log("giris sayfasina hosgeldin")
  });