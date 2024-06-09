const express = require("express");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const Note = require("./models/Note");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Connect to MongoDB
const connect = require("./config");
connect();

// Routes and middleware can be added here
// Add a GET route
app.get("/", (req, res) => {
  console.log("Hello");
  res.json({ message: "Hello World" });
});

// Create User API
app.post("/create-user", async (req, res) => {
  // Get user data from request body
  const { name, email, password } = req.body;

  // Perform validation on user data
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }
  try {
    // Check if user already exists in the database
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  // Create a new user
  const user = new User({
    name,
    email,
    password,
  });
  // Save the user to the database
  await user.save();
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "36000m",
  });
  // Return success response
  res.status(201).json({ message: "User created successfully", user, token });
});

// Login API
app.post("/login", async (req, res) => {
  // Get user data from request body
  const { email, password } = req.body;

  // Perform validation on user data
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  // Check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Check if password is correct
  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "36000m",
  });

  // Return success response with token
  res.status(200).json({ message: "Login successful", token });
});

// Add Note API
app.post("/add-note", async (req, res) => {
  // Get user id from JWT token
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.user._id;

  // Get note data from request body
  const { title, content, tags } = req.body;

  // Perform validation on note data
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Please provide title, content, and tags for the note" });
  }

  // Create a new note

  const note = new Note({
    title,
    content,
    tags: tags || [],
    userID: userId,
  });
  await note.save();

  // Save the note to the database or perform any other necessary operations

  // Return success response
  res.status(201).json({ message: "Note added successfully", note });
});

// Edit Note API
app.put("/edit-note/:noteId", async (req, res) => {
  try {
    // Get user id from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;

    // Get note id from request params
    const noteId = req.params.noteId;

    // Find the note by note id and user id
    const note = await Note.findOne({ _id: noteId, userID: userId });

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Get updated note data from request body
    const { title, content, tags } = req.body;

    // Update the note
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags || [];
    await note.save();

    // Return success response
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Note API
app.delete("/delete-note/:noteId", async (req, res) => {
  try {
    // Get user id from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;

    // Get note id from request params
    const noteId = req.params.noteId;

    // Find the note by note id and user id
    const note = await Note.findOne({ _id: noteId, userID: userId });

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Delete the note
    await note.deleteOne();

    // Return success response
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get User API
app.get("/get-user", async (req, res) => {
  try {
    // Get user id from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;

    // Find the user by user id
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return success response with user
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Notes API
app.get("/get-all-notes", async (req, res) => {
  try {
    // Get user id from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;

    // Find all notes for the user
    const notes = await Note.find({ userID: userId }).sort({ isPinned: -1 });

    // Return success response with notes
    res.status(200).json({ message: "Notes retrieved successfully", notes });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Pin Note API
app.put("/pin-note/:noteId", async (req, res) => {
  try {
    // Get user id from JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;

    // Get note id from request params
    const noteId = req.params.noteId;

    // Find the note by note id and user id
    const note = await Note.findOne({ _id: noteId, userID: userId });

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Update the note's pinned status
    if (note.isPinned) {
      note.isPinned = false;
    } else {
      note.isPinned = true;
    }
    await note.save();

    // Return success response
    res.status(200).json({ message: "Note pinned successfully", note });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;
