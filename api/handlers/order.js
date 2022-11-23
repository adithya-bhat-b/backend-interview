const { Order, Service, sequelize } = require("../../db/models");

const getOrder = async (req, res) => {
    const ret = {
        error: null,
        data: null
    }
    const orderId = req.params.orderId;
    try{
        const order = await Order.findByPk(orderId);
        if(!order) {
            ret["error"] = "Invalid orderId"
            return res.status(400).json(ret);
        }
        const orderServices = await order.getServices();
        const response = order.dataValues;
        response.services = orderServices.map((service) => {
            return {
                id: service.id
            }
        });
        ret["data"] = response;
        return res.status(200).json(ret);
    }
    catch(err){
        ret["error"] = err
        return res.status(400).json(ret);
    }
}

const getAllOrders = async (req, res) => {
    const ret = {
        error: null,
        data: null
    }
    try{
        const orders = await Order.findAll();
        ret["data"] = await Promise.all(orders.map(async (order) => {
            const response = order.dataValues;
            const orderServices = await order.getServices();
            response.services = orderServices.map((service) => {
                return {
                    id: service.id
                }
            });
            return response;
        }));
        return res.status(200).json(ret);
    }
    catch(err){
        ret["error"] = err
        return res.status(400).json(ret);
    }
}

const createOrder = async (req, res) => {
    const ret = {
        error: null,
        data: null
    }
    try {
        const orderInfo = req.body;
        const order = await Order.create({
            totalfee: orderInfo.totalfee
        });
        const response = {
            id: order.id,
            totalfee: order.totalfee,
            datetime: order.datetime
        }
        const services = await Promise.all(orderInfo.services.map(async (serviceInfo) => await Service.findByPk(serviceInfo.id)

        ));
        await order.addServices(services);
        response.services = services.map(service => ({ id: service.id }));
        return res.status(200).json(response);
    }
    catch(err){
        ret["error"] = err
        return res.status(400).json(ret);
    }
}

const updateOrder = async (req, res) => {
    const ret = {
        error: null,
        data: null
    }
    try {
        const orderInfo = req.body;
        const orderId = orderInfo.id;
        let order = await Order.findByPk(orderId);
        if(!order){
            ret["error"] = "orderId does not exist"
            return res.status(400).json(ret)
        }
        await Order.update({
            totalfee: orderInfo.totalfee,
            datetime: sequelize.literal('CURRENT_TIMESTAMP')
        },
        {
            where: { 
                id: order.id 
            } 
        });
        order = await Order.findByPk(orderId);
        await order.removeServices(await order.getServices());
        const services = await Promise.all(orderInfo.services.map(async (service) => await Service.findByPk(service.id)));
        await order.addServices(services);
        const response = order.dataValues;
        response.services = services.map(service => ({ id: service.id }));
        ret["data"] = response;
        return res.status(200).json(ret);
    }
    catch(err){
        ret["error"] = err
        return res.status(400).json(ret);
    }
}

const deleteOrder = async (req, res) => {
    const ret = {
        error: null,
        data: null
    }
    try {
        const orderId = req.params.orderId;
        let order = await Order.findByPk(orderId);
        if(!order){
            ret["error"] = "orderId does not exist"
            return res.status(400).json(ret)
        }
        await Order.destroy({
            where: { 
                id: orderId
            }
        });
        ret["data"] = "Order is successfully deleted"
        return res.status(200).json(ret);
    }
    catch(err) {
        ret["error"] = err
        return res.status(400).json(ret);
    }
}

module.exports = {
    getOrder,
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
}