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
exports.TSNestGDKMongoGenerator = void 0;
var AutomaticodeJSON = require("../../../../../../automaticode.json");
var gdk_v1_controller_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-controller.file");
var gdk_v1_module_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-module.file");
var gdk_v1_schema_create_dto_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-schema-create-dto.file");
var gdk_v1_schema_static_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-schema-static.file");
var gdk_v1_schema_type_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-schema-type.file");
var gdk_v1_schema_update_dto_file_1 = require("../../../../templates/ts-nest/common/gdk-v1-schema-update-dto.file");
var gdk_v1_mongoose_schema_file_1 = require("../../../../templates/ts-nest/mongodb/gdk-v1-mongoose-schema.file");
var gdk_v1_mongoose_service_file_1 = require("../../../../templates/ts-nest/mongodb/gdk-v1-mongoose-service.file");
var generator_static_1 = require("../../../../types/generator.static");
var file_1 = require("../../../../utils/file");
function TSNestGDKMongoGenerator(schema) {
    return __awaiter(this, void 0, void 0, function () {
        var MODULE_FOLDER, MODULE_DTO_FOLDER, gdkFolder, isDirExist, isDtoDirExist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MODULE_FOLDER = "".concat(AutomaticodeJSON.Config.GDKOutPutFolder, "/").concat(schema.kebabCaseName);
                    MODULE_DTO_FOLDER = "".concat(MODULE_FOLDER, "/").concat(generator_static_1.DTOS_FOLDER_NAME);
                    gdkFolder = "".concat(AutomaticodeJSON.Config.GDKOutPutFolder).split('src/')[1];
                    return [4 /*yield*/, (0, file_1.CheckDirExist)(MODULE_FOLDER)];
                case 1:
                    isDirExist = _a.sent();
                    return [4 /*yield*/, (0, file_1.CheckDirExist)(MODULE_DTO_FOLDER)];
                case 2:
                    isDtoDirExist = _a.sent();
                    if (!isDirExist) return [3 /*break*/, 4];
                    console.log("[WARNING] Removing all files under ".concat(MODULE_FOLDER, " ..."));
                    return [4 /*yield*/, (0, file_1.RemoveAllFilesUnderDir)(MODULE_FOLDER)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, file_1.CreateDirUnderSrc)("".concat(gdkFolder, "/").concat(schema.kebabCaseName))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (!isDtoDirExist) return [3 /*break*/, 8];
                    console.log("[WARNING] Removing all files under ".concat(MODULE_DTO_FOLDER, " ..."));
                    return [4 /*yield*/, (0, file_1.RemoveAllFilesUnderDir)(MODULE_DTO_FOLDER)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, file_1.CreateDirUnderSrc)("".concat(gdkFolder, "/").concat(schema.kebabCaseName, "/").concat(generator_static_1.DTOS_FOLDER_NAME))];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: 
                // * Static
                return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.staticFileName, ".ts"), (0, gdk_v1_schema_static_file_1["default"])(schema))];
                case 11:
                    // * Static
                    _a.sent();
                    // * Type
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.typeFileName, ".ts"), (0, gdk_v1_schema_type_file_1["default"])(schema))];
                case 12:
                    // * Type
                    _a.sent();
                    // * Schema
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.schemaFileName, ".ts"), (0, gdk_v1_mongoose_schema_file_1["default"])(schema))];
                case 13:
                    // * Schema
                    _a.sent();
                    // * DTOs
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_DTO_FOLDER, "/").concat(schema.createDtoFileName, ".ts"), (0, gdk_v1_schema_create_dto_file_1.GDKV1NestSchemaCreateDtoFile)(schema))];
                case 14:
                    // * DTOs
                    _a.sent();
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_DTO_FOLDER, "/").concat(schema.updateFullDtoFileName, ".ts"), (0, gdk_v1_schema_update_dto_file_1.GDKV1NestSchemaUpdateDtoFile)(schema))];
                case 15:
                    _a.sent();
                    // * Service
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.serviceFileName, ".ts"), (0, gdk_v1_mongoose_service_file_1["default"])(schema))];
                case 16:
                    // * Service
                    _a.sent();
                    // * Controller
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.controllerFileName, ".ts"), (0, gdk_v1_controller_file_1.GDKV1NestControllerFile)(schema))];
                case 17:
                    // * Controller
                    _a.sent();
                    // * Module
                    return [4 /*yield*/, (0, file_1.WriteFile)("".concat(MODULE_FOLDER, "/").concat(schema.moduleFileName, ".ts"), (0, gdk_v1_module_file_1.GDKV1NestModuleFile)(schema))];
                case 18:
                    // * Module
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.TSNestGDKMongoGenerator = TSNestGDKMongoGenerator;
