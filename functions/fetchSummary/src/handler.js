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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.handler = void 0;
//import { KeyVaultProvider } from "./azure/KeyVaultProvider";
var SummaryService_1 = require("./services/SummaryService");
/**
 * A simple Lambda function that processes an API Gateway proxy event.
 * It echoes the request body and adds a greeting.
 *
 * @param event The API Gateway proxy event.
 * @param context The Lambda context object.
 * @returns A Promise that resolves to an API Gateway proxy result.
 */
var handler = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, responseBody, statusCode, headers, requestBody, dbProvider, KeyVaultProvider, CosmosDBProvider, secProvider, connectionString, error_1, DynamoDBProvider, summaryService, sentAnalysis, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                platform = process.env.PLATFORM;
                if (platform !== 'aws' && platform !== 'azure') {
                    throw new Error("Invalid or missing PLATFORM env variable: ".concat(platform));
                }
                statusCode = 200;
                headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                requestBody = null;
                dbProvider = void 0;
                if (!(platform === 'azure')) return [3 /*break*/, 8];
                KeyVaultProvider = require('./azure/KeyVaultProvider').KeyVaultProvider;
                CosmosDBProvider = require('./azure/CosmosDBProvider').CosmosDBProvider;
                secProvider = new KeyVaultProvider();
                return [4 /*yield*/, secProvider.getSecret('dbconnstring')];
            case 2:
                connectionString = _a.sent();
                dbProvider = new CosmosDBProvider(connectionString);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 7]);
                return [4 /*yield*/, event.json()];
            case 4:
                requestBody = _a.sent();
                return [3 /*break*/, 7];
            case 5:
                error_1 = _a.sent();
                // Body might not be JSON, or empty
                context.log('Request body was not JSON or was empty:', error_1.message);
                return [4 /*yield*/, event.text()];
            case 6:
                // Fallback to text if needed, or handle as empty
                requestBody = _a.sent(); // Or leave as null
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                if (platform === 'aws') {
                    DynamoDBProvider = require('./aws/DynamoDBProvider').DynamoDBProvider;
                    dbProvider = new DynamoDBProvider();
                    if (!event.body) {
                        throw new Error('Request body is missing.');
                    }
                    requestBody = JSON.parse(event.body);
                }
                else {
                    console.log("Platform not supported");
                }
                _a.label = 9;
            case 9:
                summaryService = new SummaryService_1.SummaryService(dbProvider);
                return [4 /*yield*/, summaryService.process()];
            case 10:
                sentAnalysis = _a.sent();
                console.log('Processed');
                responseBody = {
                    message: sentAnalysis,
                    input: requestBody
                };
                return [3 /*break*/, 12];
            case 11:
                error_2 = _a.sent();
                console.error('Error processing event:', error_2);
                statusCode = 400; // Bad Request
                responseBody = {
                    message: 'Failed to process request.',
                    error: error_2.message || 'An unknown error occurred.'
                };
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/, {
                    statusCode: statusCode,
                    headers: headers,
                    body: JSON.stringify(responseBody)
                }];
        }
    });
}); };
exports.handler = handler;
