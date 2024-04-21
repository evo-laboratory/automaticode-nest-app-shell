"use strict";
exports.__esModule = true;
exports.ROLE_STATIC_FILE_NAME = void 0;
var help_1 = require("../../../utils/help");
exports.ROLE_STATIC_FILE_NAME = 'role.static';
function GDKV1RoleStaticFile(roles) {
    return "export enum ROLE {\n    ".concat(roles
        .map(function (r) { return "".concat((0, help_1.KebabToConstantCase)(r), " = '").concat((0, help_1.KebabToConstantCase)(r), "'"); })
        .join(',\n'), "\n  }\n");
}
exports["default"] = GDKV1RoleStaticFile;
