"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfileResponseDto = void 0;
var toProfileResponseDto = function (user) {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
    };
};
exports.toProfileResponseDto = toProfileResponseDto;
