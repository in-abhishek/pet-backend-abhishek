const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Register Logic
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully!",
            user: { id: newUser._id, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Login Logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const payload = { userId: user._id, role: user.role };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

       res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,          
            sameSite: 'None',      
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            accessToken,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 3. Refresh Token Logic
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

        const accessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            accessToken,
            user: { id: user._id, email: user.email, role: user.role }
        });
    });
};

const logOut =  (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/"
    });
    res.json({ message: "Logout successful" });
};


module.exports = {
    refreshToken,
    login,
    register,
    logOut
};
