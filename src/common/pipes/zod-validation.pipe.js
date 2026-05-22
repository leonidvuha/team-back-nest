"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
var common_1 = require("@nestjs/common");
var zod_1 = require("zod");
var ZodValidationPipe = /** @class */ (function () {
    function ZodValidationPipe(schema) {
        this.schema = schema;
    }
    ZodValidationPipe.prototype.transform = function (value) {
        var result = this.schema.safeParse(value);
        if (!result.success) {
            console.log(result.error.issues.map(function (issue) { return ({
                message: issue.message,
                field: issue.path.at(0),
            }); }));
            throw new common_1.BadRequestException(zod_1.default.treeifyError(result.error));
        }
        return result.data;
    };
    return ZodValidationPipe;
}());
exports.ZodValidationPipe = ZodValidationPipe;
