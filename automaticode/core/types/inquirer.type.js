"use strict";
exports.__esModule = true;
exports.CLI_ACTION = exports.INQUIRER_TYPE = void 0;
var INQUIRER_TYPE;
(function (INQUIRER_TYPE) {
    INQUIRER_TYPE["INPUT"] = "input";
    INQUIRER_TYPE["NUMBER"] = "number";
    INQUIRER_TYPE["CONFIRM"] = "confirm";
    INQUIRER_TYPE["LIST"] = "list";
    INQUIRER_TYPE["RAW_LIST"] = "rawlist";
    INQUIRER_TYPE["EXPAND"] = "expand";
    INQUIRER_TYPE["CHECK_BOX"] = "checkbox";
    INQUIRER_TYPE["PASSWORD"] = "password";
    INQUIRER_TYPE["EDITOR"] = "editor";
})(INQUIRER_TYPE = exports.INQUIRER_TYPE || (exports.INQUIRER_TYPE = {}));
var CLI_ACTION;
(function (CLI_ACTION) {
    CLI_ACTION["A_CREATE_SCHEMA"] = "A) Create a new schema";
    CLI_ACTION["B_SCAN_SCHEMAS"] = "B) Scan current schemas";
    CLI_ACTION["C_RUN_ALL_GENERATION"] = "C) Generate GDK modules base on all Schemas";
    CLI_ACTION["D_RUN_SINGLE_GENERATION"] = "D) Generate GDK modules base on selected Schemas [IN DEVELOP]";
    CLI_ACTION["E_RUN_SYNC_EXTRA_USER_AND_ROLE"] = "E) Sync User and Role from automaticode.json Config.User";
})(CLI_ACTION = exports.CLI_ACTION || (exports.CLI_ACTION = {}));
