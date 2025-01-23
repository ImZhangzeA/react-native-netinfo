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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = configure;
exports.fetch = fetch;
exports.refresh = refresh;
exports.addEventListener = addEventListener;
exports.useNetInfo = useNetInfo;
exports.useNetInfoInstance = useNetInfoInstance;
var react_1 = require("react");
var react_native_1 = require("react-native");
var defaultConfiguration_1 = require("@react-native-community/netinfo/src/internal/defaultConfiguration");
var nativeInterface_1 = require("./internal/nativeInterface");
var state_1 = require("./internal/state");
var Types = require("@react-native-community/netinfo/src/internal/types");
// Stores the currently used configuration
var _configuration = defaultConfiguration_1.default;
// Stores the singleton reference to the state manager
var _state = null;
var createState = function () {
    return new state_1.default(_configuration);
};
/**
 * Configures the library with the given configuration. Note that calling this will stop all
 * previously added listeners from being called again. It is best to call this right when your
 * application is started to avoid issues. The configuration sets up a global singleton instance.
 *
 * @param configuration The new configuration to set.
 */
function configure(configuration) {
    _configuration = __assign(__assign({}, defaultConfiguration_1.default), configuration);
    if (_state) {
        _state.tearDown();
        _state = createState();
    }
    if (react_native_1.Platform.OS === 'ios') {
        nativeInterface_1.default.configure(configuration);
    }
}
/**
 * Returns a `Promise` that resolves to a `NetInfoState` object.
 * This function operates on the global singleton instance configured using `configure()`
 *
 * @param [requestedInterface] interface from which to obtain the information
 *
 * @returns A Promise which contains the current connection state.
 */
function fetch(requestedInterface) {
    if (!_state) {
        _state = createState();
    }
    return _state.latest(requestedInterface);
}
/**
 * Force-refreshes the internal state of the global singleton managed by this library.
 *
 * @returns A Promise which contains the updated connection state.
 */
function refresh() {
    if (!_state) {
        _state = createState();
    }
    return _state._fetchCurrentState();
}
/**
 * Subscribe to the global singleton's connection information. The callback is called with a parameter of type
 * [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener
 * will be called with the latest information soon after you subscribe and then with any
 * subsequent changes afterwards. You should not assume that the listener is called in the same
 * way across devices or platforms.
 *
 * @param listener The listener which is called when the network state changes.
 *
 * @returns A function which can be called to unsubscribe.
 */
function addEventListener(listener) {
    if (!_state) {
        _state = createState();
    }
    _state.add(listener);
    return function () {
        _state && _state.remove(listener);
    };
}
/**
 * A React Hook into this library's singleton which updates when the connection state changes.
 *
 * @param {Partial<Types.NetInfoConfiguration>} configuration - Configure the isolated network checker managed by this hook
 *
 * @returns The connection state.
 */
function useNetInfo(configuration) {
    if (configuration) {
        configure(configuration);
    }
    var _a = (0, react_1.useState)({
        type: Types.NetInfoStateType.unknown,
        isConnected: null,
        isInternetReachable: null,
        details: null,
    }), netInfo = _a[0], setNetInfo = _a[1];
    (0, react_1.useEffect)(function () {
        return addEventListener(setNetInfo);
    }, []);
    return netInfo;
}
/**
 * A React Hook which manages an isolated instance of the network info manager.
 * This is not a hook into a singleton shared state. NetInfo.configure, NetInfo.addEventListener,
 * NetInfo.fetch, NetInfo.refresh are performed on a global singleton and have no affect on this hook.
 * @param {boolean} isPaused - Pause the internal network checks.
 * @param {Partial<Types.NetInfoConfiguration>} configuration - Configure the isolated network checker managed by this hook
 *
 * @returns the netInfo state and a refresh function
 */
function useNetInfoInstance(isPaused, configuration) {
    if (isPaused === void 0) { isPaused = false; }
    var _a = (0, react_1.useState)(), networkInfoManager = _a[0], setNetworkInfoManager = _a[1];
    var _b = (0, react_1.useState)({
        type: Types.NetInfoStateType.unknown,
        isConnected: null,
        isInternetReachable: null,
        details: null,
    }), netInfo = _b[0], setNetInfo = _b[1];
    (0, react_1.useEffect)(function () {
        if (isPaused) {
            return;
        }
        var config = __assign(__assign({}, defaultConfiguration_1.default), configuration);
        var state = new state_1.default(config);
        setNetworkInfoManager(state);
        state.add(setNetInfo);
        return state.tearDown;
    }, [isPaused, configuration]);
    var refresh = (0, react_1.useCallback)(function () {
        networkInfoManager && networkInfoManager._fetchCurrentState();
    }, [networkInfoManager]);
    return {
        netInfo: netInfo,
        refresh: refresh,
    };
}
__exportStar(require("@react-native-community/netinfo/src/internal/types"), exports);
exports.default = {
    configure: configure,
    fetch: fetch,
    refresh: refresh,
    addEventListener: addEventListener,
    useNetInfo: useNetInfo,
    useNetInfoInstance: useNetInfoInstance,
};
