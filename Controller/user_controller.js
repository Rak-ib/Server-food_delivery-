const bcrypt = require('bcryptjs'); 
// Remove validator import and use custom validation instead
const jwt = require('jsonwebtoken');
const User = require('../Modals/userModel');
const verifyGoogleToken = require("../Utils/googleVerify");
require('dotenv').config();

// Custom validation functions to replace validator
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isStrongPassword = (password) => {
    return password && password.length >= 6;
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ email: req.body.name }, { userName: req.body.name }]
        })
        if (user) {
            const passwordCompare = await bcrypt.compare(req.body.password, user.password)
            if (!passwordCompare) {
                return res.json({ message: "password didn't match", success: false });
            }
            // console.log('from login ',user.userName);
            const userObject = {
                userName: user.userName,
                userId: user._id,
                email: user.email,
                role: user.role,
                image: user.image || null,
            };
            const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });
            res.cookie(process.env.COOKIE_NAME, token, {
                maxAge: 86400000,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            res.status(200).json({ message: "Login successful", success: true, user });
        } else {
            console.log("error sss", error);
            return res.json({ message: "user not found", success: false })
        }
    } catch (error) {
        console.log("error", error);
        res.json({ message: error.data, success: false })
    }
}

const register = async (req, res) => {
    try {
        const { userName, email, password, image } = req.body;
        const userExist = await User.findOne({ userName: userName });
        const emailExist = await User.findOne({ email: email });
        
        if (emailExist) {
            return res.json({ message: "email already exist try new one", success: false })
        }
        if (userExist) {
            return res.json({ message: "Username already taken", success: false })
        }
        
        // Replace validator.isEmail with custom validation
        if (!isValidEmail(email)) {
            return res.json({ message: "Invalid Email", success: false })
        }
        
        // Add password strength check
        if (!isStrongPassword(password)) {
            return res.json({ message: "Password must be at least 6 characters long", success: false })
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashPassword,
            image: image,
        })

        const result = await newUser.save();
        console.log("okay ", result)
        res.json({ message: "Account created", success: true })

    } catch (error) {
        console.log("error", error)
        res.json({ message: error, success: false })
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("learn_with_rakib", {
            httpOnly: true,
            signed: true,
            sameSite: 'none',
        });
        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during logout", success: false });
    }
};

const currentUser = async (req, res) => {
    try {
        let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
        if (cookies) {
            try {
                const token = cookies[process.env.COOKIE_NAME]
                const decode = jwt.verify(token, process.env.JWT_SECRET)
                const user = decode;
                res.json({ success: true, user })
            } catch (error) {
                // console.log("error",error); 
                res.json({ success: false, message: "login again" })
            }
        } else {
            res.json({ success: false, message: "login again" })
        }
    } catch (error) {
        res.json({ success: false, message: "login again" })
    }
}

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const googleUser = await verifyGoogleToken(token);

        let user = await User.findOne({ email: googleUser.email });
        if (!user) {
            user = await User.create({
                email: googleUser.email,
                userName: googleUser.name,
                googleId: googleUser.googleId,
                image: googleUser.picture,
                role: 'user',
            });
        }

        const userObject = {
            userName: user.userName,
            userId: user._id,
            email: user.email,
            role: user.role || 'user',
            image: user.image || null,
        };
        const jwtToken = jwt.sign(userObject, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.cookie(process.env.COOKIE_NAME, jwtToken, {
            httpOnly: true,
            secure: true,
            maxAge: 86400000,
            sameSite: 'none',
        });
        res.status(200).json({ message: "Google Login successful", success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Google login failed", error: err.message });
    }
};

module.exports = { login, register, logout, currentUser, googleLogin }