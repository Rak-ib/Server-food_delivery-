// const mongoose = require('mongoose');

// const orderSchema=mongoose.Schema(
//     {
//         userId:{
//             type:String,
//             required:true,
//         },
//         items:{
//             type:Array,
//             required:true,
//         },
//         amount:{
//             type:Number,
//             required:true,
//         },
//         address:{
//             type:Object,
//             required:true,
//         },
//         status: {
//             type: String,
//             enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
//             default: "Pending"
//         },
//         date:{
//             type:Date,
//             default:Date.now()
//         },
//         payment:{
//             type:Boolean,
//             default:false
//         },
//     },{timestamps: true}
// )

// const Order=mongoose.model("Order",orderSchema);
// module.exports=Order




const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Failed", "Refunded"],
        default: "Pending"
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    },
    // SSLCommerz specific fields
    transactionId: {
        type: String,
        default: null
    },
    paymentDetails: {
        type: Object,
        default: null
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "sslcommerz", "bkash", "card", "cash on delivery"],
        default: "COD"
    },
    // Additional tracking fields
    deliveryDate: {
        type: Date,
        default: null
    },
    estimatedDelivery: {
        type: Date,
        default: function() {
            // Default estimated delivery: 45 minutes from order
            return new Date(Date.now() + 45 * 60 * 1000);
        }
    }
}, { timestamps: true });

// Add indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ transactionId: 1 });

// Virtual for formatted amount
orderSchema.virtual('formattedAmount').get(function() {
    return `৳${this.amount}`;
});

// Method to check if order is paid
orderSchema.methods.isPaid = function() {
    return this.payment === true;
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
    return ['Pending', 'Processing'].includes(this.status);
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;