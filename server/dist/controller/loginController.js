"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require('../db/db-connect.ts');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express_1.default.json());
const port = 8080;
// POST login request
app.post('/login', (req, res, next) => {
    const { id, password, email } = req.body;
    console.log(`login request: id=${id}, password=${password}, email=${email}`);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
