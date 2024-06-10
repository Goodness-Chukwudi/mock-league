"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
const app_config_1 = require("../config/app_config");
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return connectToMongoDbUsingMongoose();
});
function connectToMongoDbUsingMongoose() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                mongoose_1.default.connect(environment_variables_1.default.MONGODB_URI, app_config_1.DbConfig);
                mongoose_1.default.connection.on('error', err => {
                    console.error('Unable to connect to MongoDB via Mongoose\n' + err.message);
                    reject(err);
                });
                mongoose_1.default.connection.once('open', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Connected to MongoDB via Mongoose');
                    resolve(true);
                }));
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        });
    });
}
exports.default = connectToDB;
//# sourceMappingURL=db.js.map