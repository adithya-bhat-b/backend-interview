const { spawn } = require('child_process');
const axios = require('axios');

process.env["environment"] = "test";

const { sequelize, Order, Service } = require("../../db/models");



const services = [
    {
      "id": 123,
      "name": "Inspection"
    },
    {
      "id": 456,
      "name": "Analysis"
    }
];

const orders = [
    {
      "id": 223,
      "datetime": "2022-11-01T11:11:11.111Z",
      "totalfee": 100,
      "services": [
          {
          "id": 123,
          }
      ]
    },
    {
        "id": 225,
        "datetime": "2022-11-01T11:11:11.111Z",
        "totalfee": 100,
        "services": [
            {
            "id": 456,
            }
        ]
    }
]

const host = "http://127.0.0.1:3000/";

describe("Suite for orders: ", function(){

    let serverProcess;
    beforeAll(function(cb){
        serverProcess = spawn("npm", ["start"]);
        serverProcess.stdout.on('data', function(){
            cb();
        })
    })

    beforeEach(async function(){
        const service1 = await Service.create(services[0]);
        const service2 = await Service.create(services[1]);
        const order1 = await Order.create({
            id: orders[0].id,
            totalfee: orders[0].totalfee,
            datetime: orders[0].datetime
        });
        await order1.addService(service1);
        const order2 = await Order.create({
            id: orders[1].id,
            totalfee: orders[1].totalfee,
            datetime: orders[1].datetime
        });
        await order2.addService(service2);
    })

    describe("Suite for getting orders: ", function(){
        it("Test the invalid get request", function(cb){
            const url = host + "order/100";
            axios.get(url)
            .then(function (response) {
                //
            })
            .catch(function (error) {
                expect(error).toBeTruthy();
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    "error": "Invalid orderId",
                    "data": null
                });
            })
            .then(function () {
                cb();
            });
        }) 
        it("Test the valid get request with orderId", function(cb){
            const url = host + "order/223";
            axios.get(url)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: {
                        id: 223,
                        datetime: '2022-11-01T11:11:11.111Z',
                        totalfee: 100,
                        services: [{
                            id: 123
                        }]
                    }
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
        it("Test the valid get request with all the orders", function(cb){
            const url = host + "orders";
            axios.get(url)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: [
                        {
                            id: 223,
                            datetime: '2022-11-01T11:11:11.111Z',
                            totalfee: 100,
                            services: [{
                                id: 123
                            }]
                        },
                        {
                            id: 225,
                            datetime: "2022-11-01T11:11:11.111Z",
                            totalfee: 100,
                            services: [
                                {
                                    id: 456,
                                }
                            ]
                        }
                    ]
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
    })

    describe("Suite for creating orders: ", function(){
        it("Test the order creation with invalid data", function(cb){
            const url = host + "order";
            const payload = {
                fee: 500
            }
            axios.post(url, payload)
            .then(function (response) {
                //
            })
            .catch(function (error) {
                expect(error).toBeTruthy();
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    error: "totalfee field should be present",
                    data: null
                });
            })
            .then(function () {
                cb();
            });
        }) 
        it("Test the valid order creation request", function(cb){
            const url = host + "order";
            const payload = {
                totalfee: 500,
                datetime: "2022-11-01T11:11:11.111Z",
                services: [
                    {
                        id: 123
                    }
                ]
            }
            axios.post(url, payload)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: {
                        id: response.data.data.id,
                        totalfee: 500,
                        datetime: "2022-11-01T11:11:11.111Z",
                        services: [
                            {
                                id: 123
                            }
                        ]
                    }
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
    })

    describe("Suite for updating orders: ", function(){
        it("Test the order updation with invalid data", function(cb){
            const url = host + "order";
            const payload = {
                fee: 500
            }
            axios.put(url, payload)
            .then(function (response) {
                //
            })
            .catch(function (error) {
                expect(error).toBeTruthy();
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    error: "id field should be present",
                    data: null
                });
            })
            .then(function () {
                cb();
            });
        }) 

        it("Test the order updation with the non present orderId ", function(cb){
            const url = host + "order";
            const payload = {
                id: 1000,
                totalfee: 750,
                services: [
                    {
                        id: 456
                    }
                ]

            }
            axios.put(url, payload)
            .then(function (response) {
                //
            })
            .catch(function (error) {
                expect(error).toBeTruthy();
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    error: "orderId does not exist",
                    data: null
                });
            })
            .then(function () {
                cb();
            });
        }) 

        it("Test the valid order updation request", function(cb){
            const url = host + "order";
            const payload = {
                id: 223,
                totalfee: 750,
                services: [
                    {
                        id: 456
                    }
                ]
            }
            axios.put(url, payload)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: {
                        id: 223,
                        totalfee: 750,
                        datetime: response.data.data.datetime,
                        services: [
                            {
                                id: 456
                            }
                        ]
                    }
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
    })

    describe("Suite for deleting orders: ", function(){
        it("Test the invalid order delete request", function(cb){
            const url = host + "order/1000";
            axios.delete(url)
            .then(function (response) {
                //
            })
            .catch(function (error) {
                expect(error).toBeTruthy();
                expect(error.response.status).toBe(400);
                expect(error.response.data).toEqual({
                    "error": "orderId does not exist",
                    "data": null
                });
            })
            .then(function () {
                cb();
            });
        }) 
        it("Test the valid get request with orderId", function(cb){
            const url = host + "order/223";
            axios.delete(url)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: "Order is successfully deleted"
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
        it("Test the valid get request with all the orders", function(cb){
            const url = host + "orders";
            axios.get(url)
            .then(function (response) {
                expect(response).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.data).toEqual({
                    error: null,
                    data: [
                        {
                            id: 223,
                            datetime: '2022-11-01T11:11:11.111Z',
                            totalfee: 100,
                            services: [{
                                id: 123
                            }]
                        },
                        {
                            id: 225,
                            datetime: "2022-11-01T11:11:11.111Z",
                            totalfee: 100,
                            services: [
                                {
                                    id: 456,
                                }
                            ]
                        }
                    ]
                  });
            })
            .catch(function (error) {
                //
            })
            .then(function () {
                cb();
            });
        }) 
    })

    afterEach(async function(){
        await Order.destroy({
            truncate: true
        });
        await Service.destroy({
            truncate: true
        });
    })

    afterAll(function(){
        serverProcess.kill('SIGINT');
    })
})