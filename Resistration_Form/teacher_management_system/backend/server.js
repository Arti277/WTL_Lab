require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Teacher = require("./models/Teacher");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Teacher Management System Backend is running"
    });
});


// ===============================
// REGISTER
// ===============================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// PROFILE - PROTECTED
// ===============================

app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User
            .findById(req.user.userId)
            .select("-password");

        res.json({
            message: "Profile accessed successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// ADD TEACHER - PROTECTED
// ===============================

app.post("/api/teachers", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            department,
            subject,
            experience
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !department ||
            !subject ||
            experience === undefined
        ) {
            return res.status(400).json({
                message: "All teacher fields are required"
            });
        }

        const teacher = new Teacher({
            name,
            email,
            phone,
            department,
            subject,
            experience
        });

        await teacher.save();

        res.status(201).json({
            message: "Teacher added successfully",
            teacher
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// GET ALL TEACHERS - PROTECTED
// ===============================

app.get("/api/teachers", authMiddleware, async (req, res) => {
    try {
        const teachers = await Teacher.find();

        res.json(teachers);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// GET SINGLE TEACHER - PROTECTED
// ===============================

app.get("/api/teachers/:id", authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        res.json(teacher);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// UPDATE TEACHER - PROTECTED
// ===============================

app.put("/api/teachers/:id", authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        res.json({
            message: "Teacher updated successfully",
            teacher
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// DELETE TEACHER - PROTECTED
// ===============================

app.delete("/api/teachers/:id", authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(
            req.params.id
        );

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        res.json({
            message: "Teacher deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});