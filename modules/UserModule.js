const express = require("express")
const AuthEntrypoint = require("../utils/AuthEntrypoint")
const UserService = require("../service/UserService");
const UserSerializer = require("../serializers/UserSerializer")

const prefix = "/api/data/users";

const UserModule = express();

UserModule.use(AuthEntrypoint);

UserModule.get("/", async (request, response) => {
    try {

        let service = await UserService.getInstance();
        let list = await service.findAll()

        response
            .status(200)
            .json( {
                list: list.map(u => UserSerializer.toJson(u))
            })
            .end();


    } catch (error) {
        console.error(error);

        response
            .status(400)
            .json({error: error.message})
            .end();
    }
})

module.exports = {prefix, UserModule};