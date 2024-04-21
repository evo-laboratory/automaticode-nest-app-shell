"use strict";
exports.__esModule = true;
exports.GreetingBanner = exports.ChalkLight = exports.ChalkBoldSecondary = exports.ChalkBoldPrimary = void 0;
var figlet = require("figlet");
var chalk = require("chalk");
var constants_1 = require("./constants");
function ChalkBoldPrimary(text) {
    return chalk.hex(constants_1.PRIMARY_HEX).bold(text);
}
exports.ChalkBoldPrimary = ChalkBoldPrimary;
function ChalkBoldSecondary(text) {
    return chalk.hex(constants_1.SECONDARY_HEX).bold(text);
}
exports.ChalkBoldSecondary = ChalkBoldSecondary;
function ChalkLight(text) {
    return chalk.hex(constants_1.LIGHT_HEX).bold(text);
}
exports.ChalkLight = ChalkLight;
function GreetingBanner() {
    console.log(ChalkBoldPrimary(figlet.textSync('Automaticode.io')));
    console.log("".concat(ChalkLight('⚡'), " ").concat(ChalkBoldSecondary('Powered by Evo Laboratory - https://evolabs.io')));
}
exports.GreetingBanner = GreetingBanner;
