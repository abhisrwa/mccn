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
exports.EmailService = void 0;
var mail_1 = require("@sendgrid/mail");
var config_1 = require("../config/config");
var EmailService = /** @class */ (function () {
    function EmailService(sgapikey) {
        mail_1["default"].setApiKey(sgapikey);
    }
    EmailService.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toEmail, fromEmail, subject, textBody, htmlBody, msg, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toEmail = config_1["default"].tomailid;
                        fromEmail = config_1["default"].frommailid;
                        subject = 'Email from function using SendGrid Library';
                        textBody = 'This is the plain text content.';
                        htmlBody = '<p>This is the <strong>HTML</strong> content.</p>';
                        if (!fromEmail || !toEmail) {
                            console.error("Missing required information: API Key, From Email, or To Email.");
                            return [2 /*return*/, {
                                    statusCode: 400,
                                    body: JSON.stringify({ message: 'Missing SendGrid API Key, sender email, or recipient email.' })
                                }];
                        }
                        msg = {
                            to: toEmail,
                            from: fromEmail,
                            subject: subject,
                            text: textBody,
                            html: htmlBody
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, mail_1["default"].send(msg)];
                    case 2:
                        _a.sent();
                        console.log('Email sent successfully using @sendgrid/mail');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error sending email:', error_1.response ? error_1.response.body : error_1);
                        return [2 /*return*/, {
                                statusCode: error_1.code || 500,
                                body: JSON.stringify({ message: 'Failed to send email', error: error_1.message })
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return EmailService;
}());
exports.EmailService = EmailService;
