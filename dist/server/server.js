"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_patch_parser_1 = require("./merge-patch.parser");
const restify = require("restify");
const environment_1 = require("./../common/environment");
const mongoose = require("mongoose");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        console.log(environment_1.environment.db.url);
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'custommer-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                //routes
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
