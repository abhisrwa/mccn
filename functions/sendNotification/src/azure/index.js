"use strict";
exports.__esModule = true;
var functions_1 = require("@azure/functions");
var handler_1 = require("../handler");
var config_1 = require("../config/config");
functions_1.app.storageQueue('tsnotify', {
    queueName: config_1["default"].azqueue.queuename,
    connection: config_1["default"].azqueue.queueurl,
    handler: handler_1.handler
});
