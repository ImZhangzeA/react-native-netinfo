"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var nativeInterface_1 = require("./nativeInterface");
var internetReachability_1 = require("@react-native-community/netinfo/src/internal/internetReachability");
var PrivateTypes = require("@react-native-community/netinfo/src/internal//privateTypes");
var State = /** @class */ (function () {
    function State(configuration) {
        var _this = this;
        this._nativeEventSubscription = null;
        this._subscriptions = new Set();
        this._latestState = null;
        this._handleNativeStateUpdate = function (state) {
            // Update the internet reachability module
            _this._internetReachability.update(state);
            // Convert the state from native to JS shape
            var convertedState = _this._convertState(state);
            // Update the listeners
            _this._latestState = convertedState;
            _this._subscriptions.forEach(function (handler) { return handler(convertedState); });
        };
        this._handleInternetReachabilityUpdate = function (isInternetReachable) {
            if (!_this._latestState) {
                return;
            }
            var nextState = __assign(__assign({}, _this._latestState), { isInternetReachable: isInternetReachable });
            _this._latestState = nextState;
            _this._subscriptions.forEach(function (handler) { return handler(nextState); });
        };
        this._fetchCurrentState = function (requestedInterface) { return __awaiter(_this, void 0, void 0, function () {
            var state, convertedState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nativeInterface_1.default.getCurrentState(requestedInterface)];
                    case 1:
                        state = _a.sent();
                        // Update the internet reachability module
                        this._internetReachability.update(state);
                        convertedState = this._convertState(state);
                        if (!requestedInterface) {
                            this._latestState = convertedState;
                            this._subscriptions.forEach(function (handler) { return handler(convertedState); });
                        }
                        return [2 /*return*/, convertedState];
                }
            });
        }); };
        this._convertState = function (input) {
            if (typeof input.isInternetReachable === 'boolean') {
                return input;
            }
            else {
                return __assign(__assign({}, input), { isInternetReachable: _this._internetReachability.currentState() });
            }
        };
        this.latest = function (requestedInterface) {
            if (requestedInterface) {
                return _this._fetchCurrentState(requestedInterface);
            }
            else if (_this._latestState) {
                return Promise.resolve(_this._latestState);
            }
            else {
                return _this._fetchCurrentState();
            }
        };
        this.add = function (handler) {
            // Add the subscription handler to our set
            _this._subscriptions.add(handler);
            // Send it the latest data we have
            if (_this._latestState) {
                handler(_this._latestState);
            }
            else {
                _this.latest().then(handler);
            }
        };
        this.remove = function (handler) {
            _this._subscriptions.delete(handler);
        };
        this.tearDown = function () {
            if (_this._internetReachability) {
                _this._internetReachability.tearDown();
            }
            if (_this._nativeEventSubscription) {
                _this._nativeEventSubscription.remove();
            }
            _this._subscriptions.clear();
        };
        // Add the listener to the internet connectivity events
        this._internetReachability = new internetReachability_1.default(configuration, this._handleInternetReachabilityUpdate);
        // Add the subscription to the native events
        this._nativeEventSubscription = nativeInterface_1.default.eventEmitter.addListener(PrivateTypes.DEVICE_CONNECTIVITY_EVENT, this._handleNativeStateUpdate);
        // Fetch the current state from the native module
        this._fetchCurrentState();
    }
    return State;
}());
exports.default = State;
