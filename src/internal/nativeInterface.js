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
var nativeModule_1 = require("./nativeModule");
// Produce an error if we don't have the native module
if (!nativeModule_1.default) {
    throw new Error("@react-native-community/netinfo: NativeModule.RNCNetInfo is null. To fix this issue try these steps:\n\n\u2022 Run `react-native link @react-native-community/netinfo` in the project root.\n\u2022 Rebuild and re-run the app.\n\u2022 If you are using CocoaPods on iOS, run `pod install` in the `ios` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.\n\u2022 Check that the library was linked correctly when you used the link command by running through the manual installation instructions in the README.\n* If you are getting this error while unit testing you need to mock the native module. Follow the guide in the README.\n\nIf none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-community/react-native-netinfo");
}
/**
 * We export the native interface in this way to give easy shared access to it between the
 * JavaScript code and the tests
 */
var nativeEventEmitter = null;
exports.default = {
    configure: nativeModule_1.default.configure,
    addListener: nativeModule_1.default.addListener,
    removeListeners: nativeModule_1.default.removeListeners,
    getCurrentState: nativeModule_1.default.getCurrentState,
    get eventEmitter() {
        if (!nativeEventEmitter) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /// @ts-ignore
            nativeEventEmitter = new react_native_1.NativeEventEmitter(nativeModule_1.default);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /// @ts-ignore
        return nativeEventEmitter;
    },
};
