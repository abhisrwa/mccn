"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const handler_1 = require("./handler");
functions_1.app.http('tsdemo', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: handler_1.handler
});
