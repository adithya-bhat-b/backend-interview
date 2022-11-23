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

const host = "http://127.0.0.1:3000/";

describe("Suite for services: ", function(){

    let serverProcess;
    beforeAll(function(cb){
        serverProcess = spawn("npm", ["start"]);
        serverProcess.stdout.on('data', function(){
            cb();
        })
    })

    beforeEach(async function(){
        await Service.create(services[0]);
        await Service.create(services[1]);
    })

    it("Test the service creation for invalid request", function(cb){
        const url = host + "service";
        const payload = {
            name1: "test service"
        }
        axios.post(url, payload)
        .then(function (response) {
            //
        })
        .catch(function (error) {
            expect(error).toBeTruthy();
            expect(error.response.status).toBe(400);
            expect(error.response.data).toEqual({
                error: "name field should be present",
                data: null
            });
        })
        .then(function () {
            cb();
        });
    })

    it("Test the valid service creation request", function(cb){
        const url = host + "service";
        const payload = {
            name: "test service"
        }
        axios.post(url, payload)
        .then(function (response) {
            expect(response).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                error: null,
                data: {
                    id: response.data.data.id,
                    name: "test service"
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

    it("Test the valid get request with all the services", function(cb){
        const url = host + "services";
        axios.get(url)
        .then(function (response) {
            expect(response).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                error: null,
                data: [
                    {
                        id: 123,
                        name: "Inspection"
                      },
                      {
                        id: 456,
                        name: "Analysis"
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

    afterEach(async function(){
        await Service.destroy({
            truncate: true
        });
    })

    afterAll(function(){
        serverProcess.kill('SIGINT');
    })
})