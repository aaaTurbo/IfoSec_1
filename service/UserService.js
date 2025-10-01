const Dao = require("../dao/UserDao");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = class UserService {

    static async getInstance() {
        if (UserService.instance)
            return UserService.instance;

        let instance = new UserService();
        await instance.init();
        UserService.instance = instance;

        return UserService.instance;
    }

    async init() {
        if (!this.dao)
            this.dao = await Dao.getInstance();
    }

    async auth(user) {
        let found = await this.findByUsername(user);
        if (await bcrypt.compare(user.password, found.password)) {
            return true;
        } else {
            throw new Error("Invalid login");
        }
    }

    async save(user) {
        user.password = await this.hashString(user.password);
        return this.dao.save(user);
    }

    async findByUsername(user) {
        return this.dao.findByUsername(user);
    }

    async findAll() {
        return this.dao.findAll();
    }

    async hashString(str) {
        return bcrypt.hash(str, saltRounds);
    }

}