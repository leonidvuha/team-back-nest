"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.RegisterDto = exports.LoginSchema = exports.RegisterSchema = void 0;
var nestjs_zod_1 = require("nestjs-zod");
var zod_1 = require("zod");
exports.RegisterSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    fullName: zod_1.default.string().min(2, 'Full name must be at least 2 characters'),
    password: zod_1.default.string().min(8, 'Min password length is 8 symbols'),
});
exports.LoginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8, 'Min password length is 8 symbols'),
});
var RegisterDto = /** @class */ (function (_super) {
    __extends(RegisterDto, _super);
    function RegisterDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RegisterDto;
}((0, nestjs_zod_1.createZodDto)(exports.RegisterSchema)));
exports.RegisterDto = RegisterDto;
var LoginDto = /** @class */ (function (_super) {
    __extends(LoginDto, _super);
    function LoginDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LoginDto;
}((0, nestjs_zod_1.createZodDto)(exports.LoginSchema)));
exports.LoginDto = LoginDto;
