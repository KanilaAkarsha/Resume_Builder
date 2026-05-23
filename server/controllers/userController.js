import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
  // Implement token generation logic (e.g., using JWT)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Implement registerUser function

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined; // Hide password in response

    res
      .status(201)
      .json({ message: "User registered successfully", token, User: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Implement loginUser function

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined; // Hide password in response

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

//controller for getting user by id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in the request object after authentication
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined; // Hide password in response
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in the request object after authentication
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("Error fetching user resumes:", error);
    return res.status(400).json({ message: error.message });
  }
};
