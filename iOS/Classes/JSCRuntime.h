/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <memory.h>
#include <JavaScriptCore/JSContextRef.h>

namespace facebook {
    namespace jsc {

        std::unique_ptr<jsi::Runtime> makeJSCRuntime(JSGlobalContextRef context);

    } // namespace jsc
} // namespace facebook