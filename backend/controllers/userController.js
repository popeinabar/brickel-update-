const User = require("../models/userinfo");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

//get all userData
const getUsers = async (req, res) => {
  const user = await User.find().sort({ createdAt: -1 });
  res.status(200).json(user);
};

//get a single userData
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such user" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "no such dir found" });
  }
  res.status(200).json(user);
};

//create a new user
const createUser = async (req, res) => {
  const {
    Name,
    DOB,
    Occupation,
    Impression,
    LSubject,
    LTopic,
    LTiming,
    TSubject,
    TTopic,
    TTiming,
    Image,
    Email,
  } = req.body;
  //add doc to db
  try {
    const result = await cloudinary.uploader.upload(Image, {
      folder: "products",
    });
    const user = await User.create({
      Name,
      DOB,
      Occupation,
      Impression,
      LSubject,
      LTopic,
      LTiming,
      TSubject,
      TTopic,
      TTiming,
      Image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      Email,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

//delete a new user

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such user" });
  }
  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(404).json({ error: "no such dir found" });
  }
  res.status(200).json(user);
};

//update userData
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such user" });
  }
  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(404).json({ error: "no such dir found" });
  }
  res.status(200).json(user);
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
};
