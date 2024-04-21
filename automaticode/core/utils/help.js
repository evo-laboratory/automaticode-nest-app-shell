"use strict";
exports.__esModule = true;
exports.KebabToConstantCase = exports.KebabToCamelCase = exports.KebabToPascalCase = exports.FstLetterLowerCase = exports.FstLetterUppercase = exports.EnumToArray = void 0;
function EnumToArray(enumObject) {
    if (typeof enumObject !== 'object') {
        console.error("[ HELPER ][ EnumsToList ] Input is not an valid Enum Object.");
        return [];
    }
    var result = Object.keys(enumObject).map(function (property) {
        return enumObject[property];
    });
    return result;
}
exports.EnumToArray = EnumToArray;
function FstLetterUppercase(filename) {
    if (typeof filename !== 'string') {
        console.error('[ HELPER ][ FstLetterUppercase ] Input is not a string');
        return filename;
    }
    return filename.charAt(0).toUpperCase() + filename.slice(1);
}
exports.FstLetterUppercase = FstLetterUppercase;
function FstLetterLowerCase(filename) {
    if (typeof filename !== 'string') {
        console.error('[ HELPER ][ FstLetterLowerCase ] Input is not a string');
        return filename;
    }
    return filename.charAt(0).toLowerCase() + filename.slice(1);
}
exports.FstLetterLowerCase = FstLetterLowerCase;
function KebabToPascalCase(input) {
    if (typeof input !== 'string') {
        console.error("[ HELPER ][ KebabToPascalCase ] Input is not a string.");
        return input;
    }
    var result = input
        .split('-')
        .map(function (word) { return FstLetterUppercase(word.toLowerCase()); })
        .reduce(function (result, currWord) {
        return (result += currWord);
    }, '');
    return result;
}
exports.KebabToPascalCase = KebabToPascalCase;
function KebabToCamelCase(input) {
    if (typeof input !== 'string') {
        console.error("[ HELPER ][ KebabToCamelCase ] Input is not a string.");
        return input;
    }
    return FstLetterLowerCase(KebabToPascalCase(input));
}
exports.KebabToCamelCase = KebabToCamelCase;
function KebabToConstantCase(input) {
    if (typeof input !== 'string') {
        console.error("[ HELPER ][ KebabToConstantCase ] Input is not a string.");
        return input;
    }
    return input.replace('-', '_').toUpperCase();
}
exports.KebabToConstantCase = KebabToConstantCase;
