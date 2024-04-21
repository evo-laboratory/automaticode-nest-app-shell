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
var inquirer = require("inquirer");
var inquirer_type_1 = require("../types/inquirer.type");
var cli_static_1 = require("./cli.static");
var help_1 = require("../utils/help");
var file_1 = require("../utils/file");
var create_gdk_schema_json_exec_1 = require("./executors/create-gdk-schema-json.exec");
var create_gdk_modules_exec_1 = require("./executors/create-gdk-modules.exec");
var role_sync_exec_1 = require("./executors/role-sync.exec");
var scan_schema_exec_1 = require("./executors/scan-schema.exec");
var Inquirer = inquirer;
var START_QUESTIONS = [
    {
        type: inquirer_type_1.INQUIRER_TYPE.LIST,
        name: cli_static_1.Q_ACTION,
        message: 'What do you want to do ?',
        choices: (0, help_1.EnumToArray)(inquirer_type_1.CLI_ACTION)
    },
    {
        type: inquirer_type_1.INQUIRER_TYPE.INPUT,
        name: cli_static_1.Q_SCHEMA_NAME,
        message: 'Please enter schema name.',
        "default": 'use-singular-kebab-case',
        when: function (answers) {
            return answers[cli_static_1.Q_ACTION] === inquirer_type_1.CLI_ACTION.A_CREATE_SCHEMA;
        }
    },
];
function StartInquirer() {
    return __awaiter(this, void 0, void 0, function () {
        var schemaJSONfileNames;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, file_1.ReadSchemaDirectoryFileNames)()];
                case 1:
                    schemaJSONfileNames = _a.sent();
                    Inquirer.prompt(START_QUESTIONS).then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                        var selectedAction, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    selectedAction = answers[cli_static_1.Q_ACTION];
                                    _a = selectedAction;
                                    switch (_a) {
                                        case inquirer_type_1.CLI_ACTION.A_CREATE_SCHEMA: return [3 /*break*/, 1];
                                        case inquirer_type_1.CLI_ACTION.B_SCAN_SCHEMAS: return [3 /*break*/, 3];
                                        case inquirer_type_1.CLI_ACTION.C_RUN_ALL_GENERATION: return [3 /*break*/, 5];
                                        case inquirer_type_1.CLI_ACTION.D_RUN_SINGLE_GENERATION: return [3 /*break*/, 7];
                                        case inquirer_type_1.CLI_ACTION.E_RUN_SYNC_EXTRA_USER_AND_ROLE: return [3 /*break*/, 8];
                                    }
                                    return [3 /*break*/, 10];
                                case 1: return [4 /*yield*/, (0, create_gdk_schema_json_exec_1["default"])(answers)];
                                case 2:
                                    _b.sent();
                                    return [3 /*break*/, 11];
                                case 3: return [4 /*yield*/, (0, scan_schema_exec_1["default"])()];
                                case 4:
                                    _b.sent();
                                    return [3 /*break*/, 11];
                                case 5: return [4 /*yield*/, (0, create_gdk_modules_exec_1["default"])()];
                                case 6:
                                    _b.sent();
                                    return [3 /*break*/, 11];
                                case 7:
                                    console.log(schemaJSONfileNames);
                                    return [3 /*break*/, 11];
                                case 8: return [4 /*yield*/, (0, role_sync_exec_1["default"])()];
                                case 9:
                                    _b.sent();
                                    return [3 /*break*/, 11];
                                case 10: return [3 /*break*/, 11];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = StartInquirer;
