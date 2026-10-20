# Scanning projects evaluated

Reviewed 2026-10-20. These are candidate components, not evidence that any project already provides a validated scan-to-CNC lantern product.

| Project | Useful capability | Decision for CU |
| --- | --- | --- |
| [OpenCV](https://github.com/opencv/opencv) / [OpenCV.js](https://docs.opencv.org/4.x/d0/d84/tutorial_js_usage.html) | Browser image processing, contours and ellipse fitting | Integrated the official 4.13.0 JS distribution for editable rim suggestions. Apache 2.0; pinned artifact and license included. Does not supply scale or hidden depth. |
| [RTAB-Map](https://github.com/introlab/rtabmap) | Mapping and 3D scanning; repository includes an iOS application | Best next candidate for a native LiDAR capture experiment. Core BSD-style license; review dependencies separately. Not integrated or benchmarked on this fixture. |
| [COLMAP](https://github.com/colmap/colmap) | Structure-from-motion and multi-view stereo from image collections | Candidate desktop reconstruction baseline. Core new BSD license with separately licensed dependencies. More processing and capture effort than this first phone flow; requires metric scale validation. Not integrated. |
| [AR.js](https://github.com/AR-js-org/AR.js) | Browser marker/image tracking and AR placement | Useful later for preview placement, not automatic metric fixture scanning. AR.js code is MIT, underlying artoolkit5-js has LGPLv3 plus additional permission; review the actual distribution before reuse. Not integrated. |

Primary license references: [OpenCV](https://opencv.org/license/), [RTAB-Map](https://github.com/introlab/rtabmap/blob/master/LICENSE), [COLMAP README](https://github.com/colmap/colmap#license), [AR.js licenses](https://github.com/AR-js-org/AR.js#licenses).

## Chosen first workflow

Choose ceiling mode, load a plain image, review/correct the proposed outer-rim box, enter diameter and ceiling projection in mm or inches, physically confirm, and save a photo-free measurement JSON. OpenCV is served from our own site, not fetched from a third-party CDN at runtime. All photo pixels remain in browser memory. Manual entry works without the image-processing library.

This is assisted capture rather than a reconstruction system. The circular-envelope assumption must not be applied to irregular or protruding fixtures without measuring their complete envelope. The scan does not generate a ceiling CNC file, a verified mount, or a ceiling price. The separate tabletop tool remains available in its own mode.

Native iPhone LiDAR would require a different integration; the current website does not expose ARKit depth. HEIC decoding is browser-dependent. No remote image processing, paid API, or upload service was added.
