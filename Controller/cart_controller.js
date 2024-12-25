const User = require("../Modals/userModel");


const addToCart=async(req,res)=>{
   try {
    const userId=req.user.userId;
    let userData=await User.findOne({_id:userId});
    console.log("userData",userData);
    let cartData=await userData.cartData;
    console.log("cartData",cartData);
    console.log("food id",req.body);
    if(!cartData[req.body.itemId]){
        console.log("came here1");
        cartData[req.body.itemId]=1;
    }else{
        cartData[req.body.itemId]+=1;
        console.log("came here 2");
    }
    console.log("okk",cartData);
    const result= await User.findByIdAndUpdate(userId,{cartData})
    console.log("result:",result);
    res.json({success:true,message:cartData})


   } catch (error) {
    res.json({success:false,message:error})
   }
}


const getFromCart=async(req,res)=>{
    try {
        const userId=req.user.userId;
    let userData=await User.findOne({_id:userId});
    console.log(userData);
    let cart=userData.cartData;
    console.log(cart);
    res.json({success:true,message:cart})
    } catch (error) {
        res.send(error)
    }
}


const removeFromCart=async(req,res)=>{
    try {
        const userId=req.user.userId;
    let userData=await User.findOne({_id:userId});
    let cartData=userData.cartData;
    if(cartData[req.body.itemId]>0){
        cartData[req.body.itemId]-=1;
    }
    await User.findByIdAndUpdate(userId,{cartData})
    res.json({success:true,message:cartData})
    } catch (error) {
        res.json({success:false,message:error})
    }
}


module.exports={addToCart,getFromCart,removeFromCart}