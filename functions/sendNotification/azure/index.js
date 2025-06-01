"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const handler_1 = require("../handler");
const config_1 = __importDefault(require("../config/config"));
functions_1.app.storageQueue('tsnotify', {
    queueName: config_1.default.azqueue.queuename,
    connection: config_1.default.azqueue.queueurl,
    handler: handler_1.handler
});
