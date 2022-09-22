import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import cloudinary from "../helper/cloudinaryImages.js";

export const register = async (req, res) => {
  let userData = req.body;
  try {
    const { url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: `profile_pic/${userData.phone_number}`,
    });

    const phoneNumberExist = await User.findOne({
      phone_number: userData.phone_number,
    });

    if (phoneNumberExist)
      return res.status(400).send("Phone number already exist");

    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(userData.password, salt);

    const createdUser = new User({
      ...userData,
      password: hashPassword,
      picture: url,
    });

    const token = jwt.sign(
      {
        _id: createdUser._id,
        phone_number: userData.phone_number,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await createdUser.save();
    res.status(201).json({ token, user: createdUser });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  let { phone_number, password } = req.body;

  try {
    const user = await User.findOne({ phone_number: phone_number });
    if (!user) return res.status(400).send("user not exist");

    let isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      {
        _id: user._id,
        phone_number: user.phone_number,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { phone_number: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.userId } });
  res.send(users);
};

export const updateUser = async (req, res) => {
  const { name, phone_number } = req.body;
  try {
    const phoneNumberExist = await User.findOne({
      phone_number,
    });

    if (phoneNumberExist)
      return res.status(400).send("Phone number already exist");

    const { url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: `profile_pic/${phone_number}`,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, phone_number, picture: url },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(error);
  }
};
