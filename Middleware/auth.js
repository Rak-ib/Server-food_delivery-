const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware=async (req,res,next)=>{
    console.log(req.signedCookies);
    let cookies=Object.keys(req.signedCookies).length>0?req.signedCookies:null;
    console.log("my",cookies);
    if(cookies){
        try {
            const token=cookies[process.env.COOKIE_NAME]
            const decode=jwt.verify(token,process.env.JWT_SECRETE)
            req.user=decode;
            console.log("NAME",req.user.userName);
            console.log("decode:::::",decode);
            next()

        } catch (error) {
            console.log("error",error); 
            res.json({success:false,message:"login again"})
        }
    }
    else{
        console.log("cookies problem ");
        console.log("login again");
        res.json({success:false,message:"login again"})
    }
}
module.exports=authMiddleware