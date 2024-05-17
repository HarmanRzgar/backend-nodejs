// auth.js
const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET 

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role !== "Basic") {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Compare given password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const maxAge = 3 * 60 * 60; // 3 hours in seconds
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        jwtSecret,
        { expiresIn: maxAge }
      );

      // Set JWT token in cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3 hours in milliseconds
      });

      // Return response with token in body
      return res.status(200).json({
        message: "User successfully logged in",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: token // Include token in response body
      });
    } else {
      return res.status(400).json({ message: "Login not successful" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};


exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, Email, or Password not present",
    });
  }

  // Check if password meets minimum length requirement
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  try {
    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Username or Email already in use",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const maxAge = 3 * 60 * 60; // 3 hours in seconds
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: maxAge }
    );

    // Set JWT token in cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3 hours in milliseconds
    });

    // Respond with success message and user details
    return res.status(201).json({
      message: "User successfully created",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};


exports.update = async (req, res, next) => {
  const { role, id } = req.body;

  // Validate role and id presence
  if (!role || !id) {
    return res.status(400).json({ message: "Role or Id not present" });
  }

  // Validate role value
  if (role !== "admin") {
    return res.status(400).json({ message: "Role is not admin" });
  }

  try {
    // Find user by ID using async/await
    const user = await User.findById(id);

    // Ensure user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update role only if user isn't already an admin
    if (user.role !== "admin") {
      user.role = role;
      await user.save(); // Use async/await for saving
    }

    return res.status(201).json({ message: "Update successful", user });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Find user by ID using async/await
    const user = await User.findById(id);

    // Ensure user exists before deletion
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Efficiently delete user using deleteOne()
    await User.deleteOne({ _id: id });

    return res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "An error occurred" });
  }
};


