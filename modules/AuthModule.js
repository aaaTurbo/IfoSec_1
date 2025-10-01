const express = require("express")
const UserService = require("../service/UserService")
const UserSerializer = require("../serializers/UserSerializer")
const AuthProvider = require("../utils/AuthProvider")

const prefix = "/auth";

const AuthModule = express();

AuthModule.use(express.json());

AuthModule.post("/", (request, response, next) => {
    if (request.body.username && request.body.password) {
        next();
    } else {
        response
            .sendStatus(422)
    }
})

AuthModule.post("/login", async (request, response) => {
    try {

        let service = await UserService.getInstance();
        let auth = await AuthProvider.getInstance();

        if (await service.auth(UserSerializer.toUser(request.body)))
            response
                .status(200)
                .json({
                    token: await auth.generate(request.username)
                })
                .end();


    } catch (error) {
        console.error(error);

        response
            .status(401)
            .json({error: error.message})
            .end();
    }
})

AuthModule.post("/register", async (request, response) => {
    try {

        let service = await UserService.getInstance();

        if (await service.save(UserSerializer.toUser(request.body)))
            response
                .sendStatus(200);

    } catch (error) {
        console.error(error);

        response
            .status(400)
            .json({error: error.message})
            .end();
    }
})

module.exports = {prefix, AuthModule};