const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
const connectToDatabase = require("../../lib/database");

exports.handler = async (req, res) => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.findOne({ where: { Id: 1 } });
    console.log("user:", user);
  } catch (error) {
    console.log("[USER CONTROLLER:]", error);
  }
};
