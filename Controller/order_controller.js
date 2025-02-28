const Stripe = require('stripe');
const Order = require('../Modals/orderModel');
const User = require('../Modals/userModel');
const { verify } = require('jsonwebtoken');


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const placeOrder = async (req, res) => {
    try {
        const url = "http://localhost:5173"
        const newOrder = new Order({
            userId: req.user.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();       
        await User.findByIdAndUpdate(req.user.userId, { cartData: {} })
        const lineItems = req.body.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity

        }))
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: "delivery charges"
                },
                unit_amount: 5 * 100,
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${url}/verify?success=true&&orderId=${newOrder._id}`,
            cancel_url: `${url}/verify?success=false&&orderId=${newOrder._id}`,
        })
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        res.json({success:false,error})

    }

}

const verifyOrder=async(req,res)=>{
    const {orderId,success}=req.body;
    try {
        if(success){
            await Order.findByIdAndUpdate(orderId,{payment:true})
            res.json({message:"Paid",success:true})
        }else{
            await Order.findByIdAndDelete(orderId);
            res.json({message:"Not Paid",success:false})
        }
    } catch (error) {
        res.json({message:"error",success:false})
    }
}


const userOrder=async(req,res)=>{
    try {
        const result=await Order.find({userId:req.user.userId});
        console.log("user Oreder");
        console.log(result);
        res.json({success:true,order:result})
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}


const ordersList=async(req,res)=>{
    try {
        const result=await Order.find().sort({ date: -1 });
        console.log("orderList",result);
        res.json({success:true,orders:result})
    } catch (error) {
        console.log("order error:",error);
        res.json({success:false,message:"Error"})
    }
}


module.exports = { placeOrder ,verifyOrder,userOrder,ordersList}