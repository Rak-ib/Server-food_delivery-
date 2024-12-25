const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../Modals/userModel');
require('dotenv').config();



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
            console.log('from login ',user.name);
            const userObject = {
                userName: user.userName,
                userId: user._id,
                email: user.email,
                avatar: user.image || null,
            };
            const token = jwt.sign(userObject, process.env.JWT_SECRETE, {
                expiresIn: 86400000
            })
            res.cookie("learn_with_rakib", token, {
                maxAge: 86400000,
                httpOnly: true,
                signed: true,
            })
            res.status(200).json({ message: "Login successful", success: true, user });
        } else {
            return res.json({ message: "user not found", success: false })
        }
    } catch (error) {
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
        if (!validator.isEmail(email)) {
            return res.json({ message: "Invalid Email", success: false })
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashPassword,
            image: image,
        })
        await newUser.save();
        res.json({ message: "Account created", success: true })

    } catch (error) {
        res.json({ message: error, success: false })
    }
}


const logout = (req, res) => {
    try {
        res.clearCookie("learn_with_rakib", {
            httpOnly: true,
            signed: true,
        });
        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during logout", success: false });
    }
};

const currentUser=async(req,res)=>{
    try {
        let cookies=Object.keys(req.signedCookies).length>0?req.signedCookies:null;
        if(cookies){
            try {
                const token=cookies[process.env.COOKIE_NAME]
                const decode=jwt.verify(token,process.env.JWT_SECRETE)
                const user=decode;
                res.json({success:true,user})

    
            } catch (error) {
                console.log("error",error); 
                res.json({success:false,message:"login again"})
            }
        }else{
            res.json({success:false,message:"login again"}) 
        }
        
    } catch (error) {
        res.json({success:false,message:"login again"})
    }
}



module.exports = { login, register,logout,currentUser }