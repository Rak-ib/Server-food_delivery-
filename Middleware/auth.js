const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        console.log("Signed Cookies:", req.signedCookies);

        if (!req.signedCookies || Object.keys(req.signedCookies).length === 0) {
            return res.status(401).json({ success: false, message: "No cookies found. Please log in again." });
        }

        if (!process.env.COOKIE_NAME || !process.env.JWT_SECRETE) {
            console.error("❌ Missing COOKIE_NAME or JWT_SECRETE in environment variables.");
            return res.status(500).json({ success: false, message: "Server error: Missing auth configuration" });
        }

        const token = req.signedCookies[process.env.COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token found. Please log in again." });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRETE);
        req.user = decode;

        console.log("✅ User Authenticated:", req.user.userName);
        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }
};

module.exports = authMiddleware;
