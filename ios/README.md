# CU native iPhone scanner — 0.11 prototype

CU now has a native iOS shell bundling the same web design engine. Tap Scan with CU camera, capture 2–12 views, then return directly to CU's guided measurement and design screen. No separate scanner app, ZIP export or upload is required. Captures stay in memory on the device and clear when the app closes or the user clears them.

## Build
Requires macOS, Xcode and XcodeGen (MIT licensed build tooling):

    python3 scripts/build_ios.py
    xcodegen generate --spec ios/project.yml
    open ios/CULantern.xcodeproj

Select your Apple development team and a unique bundle identifier in Xcode, connect the iPhone, and Run. No signing keys or team identifiers are committed. GitHub Actions compiles an **unsigned simulator build**, not an installable iPhone IPA. Signing and device installation remain outstanding; this Windows workspace cannot perform them. A native CU install is distinct from the Safari home-screen web app.

## Capture contract and privacy
Apple ARKit sceneDepth supplies depth and confidence; capturedImage and camera intrinsics come from the same ARFrame. Depth meters convert to integer millimeters, respecting pixel-buffer row strides. RGB is resized in the camera's unrotated coordinates to match the 256×192 depth map. Intrinsics scale from camera image resolution to the same grid. The browser bridge validates dimensions, calibration, sample ranges and unique frame IDs. No camera data is uploaded, persisted or published. Only bundled local pages receive the native bridge; remote navigation is blocked.

References: https://developer.apple.com/documentation/arkit/arframe/scenedepth and https://developer.apple.com/documentation/arkit/arframe

## What this release does not establish
- Real-device orientation/alignment, capture reliability and dimensional accuracy are unverified. Test on the iPhone 16 Pro against independently measured objects before relying on dimensions.
- Guided landmarks are still required. This is not automatic fixture segmentation. Similar readings from multiple views are not proof of accuracy.
- Thin, shiny or transparent features may have unreliable depth. Missing dimensions retain a manual fallback. Never infer missing stem depth from an image alone.
- Native file exports now open the iOS share sheet (Save to Files or a chosen destination), and HTTPS supplier links open an in-app Safari sheet without exposing the native bridge. Both still need a real-device acceptance pass. Web exports remain available in the hosted web version.
- Fabrication fit, fixture compatibility and mounting remain unverified. Checkout is not enabled.

## Acceptance checklist on a real phone
1. Allow and deny camera permission; unsupported devices must fall back without a crash.
2. Capture a known rectangular target and ceiling fixture from two angles; visually compare RGB/depth boundaries in portrait and landscape.
3. Check diameter and projection against ruler measurements, including the lowest stem. Keep failed cases as failures.
4. Cancel/restart/clear captures and verify old measurements are not silently reused.
5. Choose a design and confirm all five panel dimensions and cost provenance match the accepted planning dimensions.


## 0.11.1 � native export and capture improvements

- Existing generated ZIP, JSON, SVG, DXF and HTML downloads are intercepted inside the native app and passed byte-for-byte to the iOS share sheet. The browser edition is unchanged.
- Only a bundled main-frame page can request an export. Filenames are restricted, files are capped at 20 MB, and each export uses an isolated temporary directory. Completion/cancellation is reported separately and temporary files are removed after the activity closes. No recipient is selected automatically.
- Camera captures must be at least 3 cm apart from all earlier capture positions. This is a provisional diversity check, not proof of accuracy or complete fixture coverage.
- The web-only installation button is hidden inside the installed app. Scan guidance asks for the rim, ceiling and lowest stem.
- Test native exports using a saved quote ZIP, compare it to the web-generated package, then test cancellation and a second export. Confirm external supplier sheets can be dismissed back into CU.

The iPhone app is still unsigned for physical devices. No Apple account, subscription, paid hardware or vendor order was created.
