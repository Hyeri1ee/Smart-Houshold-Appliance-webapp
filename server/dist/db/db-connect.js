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
exports.handleConnection = void 0;
const typeorm_1 = require("typeorm");
const promises_1 = __importDefault(require("fs/promises"));
const user_1 = require("./entities/user");
const revoked_token_1 = require("./entities/revoked_token");
const solar_setup_1 = require("./entities/solar_setup");
const schedule_1 = require("./entities/schedule");
const time_1 = require("./entities/time");
const location_1 = require("./entities/location");
const getSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile("config.json", "utf8");
        return JSON.parse(data);
    }
    catch (err) {
        console.error("Error reading config file:", err);
        throw err;
    }
});
const getDataSource = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    return new typeorm_1.DataSource({
        type: "postgres",
        host: settings.host,
        port: settings.port,
        username: settings.username,
        password: settings.password,
        database: settings.dbName,
        entities: [
            user_1.User,
            location_1.Location,
            solar_setup_1.Solar_setup,
            schedule_1.Schedule,
            time_1.Time,
            revoked_token_1.Revoked_token,
        ],
        synchronize: settings.synchronize,
        logging: settings.logging,
    });
});
const handleConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Starting db connection");
        const settings = yield getSettings();
        const dataSource = yield getDataSource(settings);
        yield dataSource.initialize();
        console.log("db source done");
        return dataSource;
    }
    catch (e) {
        console.error(e);
    }
});
exports.handleConnection = handleConnection;
