"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertController = void 0;
var common_1 = require("@nestjs/common");
var AdvertController = function () {
    var _classDecorators = [(0, common_1.Controller)('/adverts')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _example_decorators;
    var _getHeaders_decorators;
    var _getAuthHeaders_decorators;
    var _getRequestInfo_decorators;
    var _findOne_decorators;
    var AdvertController = _classThis = /** @class */ (function () {
        function AdvertController_1(advertService) {
            this.advertService = (__runInitializers(this, _instanceExtraInitializers), advertService);
        }
        AdvertController_1.prototype.findAll = function () {
            return this.advertService.findAll();
        };
        // /adverts/example?skip=2&limit=10
        AdvertController_1.prototype.example = function (skip, limit) {
            console.log(skip);
            console.log(limit);
            return { skip: skip, limit: limit };
        };
        // /adverts/get-headers - если хотим работать со всеми хедерами
        AdvertController_1.prototype.getHeaders = function (headers) {
            // вернет все хедеры
            return headers;
        };
        AdvertController_1.prototype.getAuthHeaders = function (token) {
            // достали хедер authorization
            return { token: token };
        };
        AdvertController_1.prototype.getRequestInfo = function (req) {
            // console.log(req);
            // достали метод для примера
            return { method: req.method };
        };
        AdvertController_1.prototype.findOne = function (id) {
            console.log(id);
            return { id: id };
        };
        return AdvertController_1;
    }());
    __setFunctionName(_classThis, "AdvertController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)()];
        _example_decorators = [(0, common_1.Get)('/example')];
        _getHeaders_decorators = [(0, common_1.Get)('/get-headers')];
        _getAuthHeaders_decorators = [(0, common_1.Get)('/get-auth-header')];
        _getRequestInfo_decorators = [(0, common_1.Get)('/example-2')];
        _findOne_decorators = [(0, common_1.Get)('/:id')];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _example_decorators, { kind: "method", name: "example", static: false, private: false, access: { has: function (obj) { return "example" in obj; }, get: function (obj) { return obj.example; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHeaders_decorators, { kind: "method", name: "getHeaders", static: false, private: false, access: { has: function (obj) { return "getHeaders" in obj; }, get: function (obj) { return obj.getHeaders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAuthHeaders_decorators, { kind: "method", name: "getAuthHeaders", static: false, private: false, access: { has: function (obj) { return "getAuthHeaders" in obj; }, get: function (obj) { return obj.getAuthHeaders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRequestInfo_decorators, { kind: "method", name: "getRequestInfo", static: false, private: false, access: { has: function (obj) { return "getRequestInfo" in obj; }, get: function (obj) { return obj.getRequestInfo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdvertController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdvertController = _classThis;
}();
exports.AdvertController = AdvertController;
// headers, url, body, method
// headers
// {
//   "content-type": "json"
// }
// body
// {
//   "email": "sdasd",
//   "password": "sdaasdsd"
// }
// url
// http://google.com/search?q=blablabla
// http://google.com/users/2?new=true
// /users/2 - path
// 2 - path variable
// new - query param
// Record
// const obj: Record<string, number> = {
//   age: 28,
//   height: 190,
//   height2: 190,
//   height3: 190,
//   height4: 190,
// };
