const Order = require('../Modals/orderModel');
const User = require('../Modals/userModel');
const sslService = require('../Utils/sslcommerzService');
require('dotenv').config();



const placeOrder = async (req, res) => {
    try {
        const newOrder = new Order({
            userId: req.user.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        
        await newOrder.save();
        await User.findByIdAndUpdate(req.user.userId, { cartData: {} });
        
        const { paymentMethod } = req.body;
        
        if (paymentMethod && paymentMethod.toLowerCase() === 'sslcommerz') {
            // Initiate SSLCommerz payment directly
            const postData = {
                total_amount: req.body.amount,
                currency: 'BDT',
                tran_id: newOrder._id.toString(),
                success_url: `${process.env.BACKEND_URL}/order/sslcommerz/success`,
                fail_url: `${process.env.BACKEND_URL}/order/sslcommerz/fail`,
                cancel_url: `${process.env.BACKEND_URL}/order/sslcommerz/cancel`,
                ipn_url: `${process.env.BACKEND_URL}/order/sslcommerz/ipn`,
                shipping_method: 'Courier',
                product_name: 'Food Order',
                product_category: 'Food',
                product_profile: 'general',
                cus_name: `${req.body.address.firstName} ${req.body.address.lastName}`,
                cus_email: req.body.address.email,
                cus_add1: req.body.address.street,
                cus_city: req.body.address.city,
                cus_postcode: req.body.address.zipCode,
                cus_country: 'Bangladesh',
                cus_phone: req.body.address.mobile,
                ship_name: `${req.body.address.firstName} ${req.body.address.lastName}`,
                ship_add1: req.body.address.street,
                ship_city: req.body.address.city,
                ship_postcode: req.body.address.zipCode,
                ship_country: 'Bangladesh',
            };

            const sslResponse = await sslService.createSession(postData);
            
            if (sslResponse.status === 'SUCCESS') {
                await Order.findByIdAndUpdate(newOrder._id, {
                    transactionId: newOrder._id.toString(),
                    status: 'Pending',
                    paymentMethod: 'sslcommerz'
                });

                return res.json({
                    success: true,
                    orderId: newOrder._id,
                    sessionUrl: sslResponse.GatewayPageURL
                });
            } else {
                await Order.findByIdAndDelete(newOrder._id);
                return res.status(400).json({
                    success: false,
                    message: 'Payment initiation failed'
                });
            }
        }

        return res.json({ 
            success: true, 
            orderId: newOrder._id,
            message: 'Order placed successfully' 
        });

    } catch (error) {
        console.error("Place order error:", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to place order',
            error: error.message 
        });
    }
};



const success = async (req, res) => {
    try {
        
        const val_id = req.body.val_id || req.query.val_id;
        const tran_id = req.body.tran_id || req.query.tran_id;
        const amount = req.body.amount || req.query.amount;

        if (!val_id || !tran_id) {
            console.log('Missing val_id or tran_id');
            return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
        }

        // Validate the transaction
        const validation = await sslService.validateByValId(val_id);
        // console.log('Validation response:', validation);

        if (validation.status === 'VALID' && validation.tran_id === tran_id) {
            // console.log('Payment validation successful');
            
            const order = await Order.findByIdAndUpdate(tran_id, {
                payment: true,
                status: 'Processing',
                paymentDetails: {
                    val_id,
                    card_type: req.body.card_type,
                    amount,
                    bank_tran_id: validation.bank_tran_id,
                    card_issuer: validation.card_issuer
                }
            }, { new: true });

            if (order) {
                // console.log('Order updated successfully, redirecting to success');
                return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${tran_id}`);
            } else {
                // console.log('Order not found');
                return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
            }
        } else {
            // console.log('Payment validation failed');
            await Order.findByIdAndUpdate(tran_id, { status: 'Failed' });
            return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
        }

    } catch (error) {
        // console.error('Success callback error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
    }
};


const verifyOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID required'
            });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.json({
            success: true,
            order: {
                id: order._id,
                status: order.status,
                payment: order.payment,
                amount: order.amount
            }
        });
        
    } catch (error) {
        console.error("Verify order error:", error);
        return res.status(500).json({ 
            message: "Verification error", 
            success: false 
        });
    }
};

const userOrder = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ date: -1 });
        // console.log("User orders fetched", orders);
        res.json({ success: true, orders: orders });
    } catch (error) {
        console.error("User orders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

const ordersList = async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json({ success: true, orders: orders });
    } catch (error) {
        console.error("Orders list error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Status updated successfully', 
            order 
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update status' 
        });
    }
};

// Add this to your order_controller.js file

const getAnalytics = async (req, res) => {
    try {
        const { range = '30d' } = req.query;
        
        // Calculate date ranges
        const now = new Date();
        let startDate;
        
        switch (range) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default: // 30d
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get all orders within the date range
        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: now }
        });

        // Get previous period data for comparison
        const prevStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
        const prevOrders = await Order.find({
            createdAt: { $gte: prevStartDate, $lte: startDate }
        });

        // Calculate overview metrics
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const prevTotalRevenue = prevOrders.reduce((sum, order) => sum + order.amount, 0);
        const revenueChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;

        const totalOrders = orders.length;
        const prevTotalOrders = prevOrders.length;
        const ordersChange = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0;

        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const prevAvgOrderValue = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0;
        const avgValueChange = prevAvgOrderValue > 0 ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100 : 0;

        // Get unique users (this is a simplified approach)
        const uniqueUsers = [...new Set(orders.map(order => order.userId))].length;
        const prevUniqueUsers = [...new Set(prevOrders.map(order => order.userId))].length;
        const usersChange = prevUniqueUsers > 0 ? ((uniqueUsers - prevUniqueUsers) / prevUniqueUsers) * 100 : 0;

        // Generate revenue data (group by day)
        const revenueData = [];
        const dateMap = {};
        
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!dateMap[date]) {
                dateMap[date] = { date, revenue: 0, orders: 0 };
            }
            dateMap[date].revenue += order.amount;
            dateMap[date].orders += 1;
        });

        // Fill in missing dates and sort
        const currentDate = new Date(startDate);
        while (currentDate <= now) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (!dateMap[dateStr]) {
                revenueData.push({ date: dateStr, revenue: 0, orders: 0 });
            } else {
                revenueData.push(dateMap[dateStr]);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Get top foods
        const foodMap = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!foodMap[item.name]) {
                    foodMap[item.name] = {
                        name: item.name,
                        orders: 0,
                        revenue: 0,
                        category: item.category || 'Uncategorized'
                    };
                }
                foodMap[item.name].orders += item.quantity;
                foodMap[item.name].revenue += item.price * item.quantity;
            });
        });

        const topFoods = Object.values(foodMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Get category data
        const categoryMap = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category || 'Uncategorized';
                if (!categoryMap[category]) {
                    categoryMap[category] = {
                        name: category,
                        value: 0,
                        revenue: 0,
                        color: getRandomColor()
                    };
                }
                categoryMap[category].value += item.quantity;
                categoryMap[category].revenue += item.price * item.quantity;
            });
        });

        const totalItems = Object.values(categoryMap).reduce((sum, cat) => sum + cat.value, 0);
        const categoryData = Object.values(categoryMap).map(cat => ({
            ...cat,
            value: totalItems > 0 ? Math.round((cat.value / totalItems) * 100) : 0
        }));

        // Get payment methods data
        const onlineOrders = orders.filter(order => 
            order.paymentMethod !== 'COD' && order.paymentMethod !== 'cash on delivery'
        ).length;

        const codOrders = orders.filter(order => 
            order.paymentMethod === 'COD' || order.paymentMethod === 'cash on delivery'
        ).length;

        const totalPaymentOrders = onlineOrders + codOrders;
        const paymentMethods = [
            {
                method: 'Online',
                orders: onlineOrders,
                percentage: totalPaymentOrders > 0 ? Math.round((onlineOrders / totalPaymentOrders) * 100) : 0,
                color: '#4ECDC4'
            },
            {
                method: 'Cash on Delivery',
                orders: codOrders,
                percentage: totalPaymentOrders > 0 ? Math.round((codOrders / totalPaymentOrders) * 100) : 0,
                color: '#FF6B6B'
            }
        ];

        // Get city data
        const cityMap = {};
        orders.forEach(order => {
            const city = order.address?.city || 'Unknown';
            if (!cityMap[city]) {
                cityMap[city] = { city, orders: 0, revenue: 0 };
            }
            cityMap[city].orders += 1;
            cityMap[city].revenue += order.amount;
        });

        const cityData = Object.values(cityMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Get hourly data
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i.toString().padStart(2, '0')}:00`,
            orders: 0
        }));

        orders.forEach(order => {
            const hour = order.createdAt.getHours();
            hourlyData[hour].orders += 1;
        });

        // Prepare response
        const analyticsData = {
            overview: {
                totalRevenue,
                totalOrders,
                avgOrderValue,
                activeUsers: uniqueUsers,
                revenueChange,
                ordersChange,
                avgValueChange,
                usersChange
            },
            revenueData,
            topFoods,
            categoryData,
            paymentMethods,
            cityData,
            hourlyData
        };
        console.log('Analytics data prepared');
        console.log(analyticsData);

        res.json({
            success: true,
            data: analyticsData
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data',
            error: error.message
        });
    }
};

// Helper function to generate random colors for categories
function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add this to your module.exports
module.exports = { 
    placeOrder, 
    success,
    verifyOrder, 
    userOrder, 
    ordersList, 
    updateOrderStatus,
    getAnalytics  // Add this line
};