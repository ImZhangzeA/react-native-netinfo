"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
// React Native sets `__turboModuleProxy` on global when TurboModules are enabled.
// Currently, this is the recommended way to detect TurboModules.
// https://reactnative.dev/docs/the-new-architecture/backward-compatibility-turbomodules#unify-the-javascript-specs
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var isTurboModuleEnabled = global.__turboModuleProxy != null;
var RNCNetInfo = isTurboModuleEnabled
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./NativeRNCNetInfo').default
    : react_native_1.NativeModules.RNCNetInfo;
exports.default = RNCNetInfo;
