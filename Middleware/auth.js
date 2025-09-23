const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // console.log("cookkkkk",req)
        // console.log("Cookies:", req.cookies); // Debug log
        // console.log("Signed Cookies:", req.signedCookies);

        // Check both regular and signed cookies
        const token = req.signedCookies?.[process.env.COOKIE_NAME] || req.cookies?.[process.env.COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token found. Please log in."
            });
        }

        if (!process.env.JWT_SECRET) {
            // console.error("❌ Missing JWT_SECRET in environment variables.");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        // console.log("✅ User Authenticated:", req.user.userName);
        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again."
        });
    }
};


const verifyAdmin = async (req, res, next)=> {

    try {
        const token = req.signedCookies?.[process.env.COOKIE_NAME] || req.cookies?.[process.env.COOKIE_NAME];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        const role = decoded.role;
        console.log("role",role);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }


}


module.exports = {authMiddleware,verifyAdmin};