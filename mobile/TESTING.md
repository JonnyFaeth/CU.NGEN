# Mobile 0.3 verification

Software checks on 2026-10-17/18. No physical phone or lamp was available.

- Fifteen Node tests passed across the existing geometry engine and new mobile modules. New checks cover affine/projective known-dimension recovery, degenerate references, style-dependent cut geometry, fee rounding and unknown fulfillment costs.
- Chromium browser preview at 393 × 852 CSS pixels had no horizontal overflow (client and scroll widths both 378 px with scrollbar).
- Selecting Split changed the cut list to 16 parts. Entering fabrication $10, packaging $2, handling $3, shipping $5 and tax $2 yielded $52.47, including a $4.13 CU fee on the $41.34 kit base.
- Review dialog explicitly says orders are closed; downloaded specification marks orderPlaced and paymentCollected false.
- Width 999 mm blocks kit review and shows the input error.
- The downloaded CC0 museum image loads in the reference-photo interface. It has no known scale and cannot be applied as a measured light.
- Phone icons and web-app manifest are generated without external libraries. Actual Safari Home Screen installation, camera capture, offline behavior behind hosted authentication and phone file sharing still need device checks.

Limitations: calibration is coplanar, not a 3D scan; test fixtures do not establish real camera accuracy. Pricing is a planning estimate, not a supplier-backed delivered quote. No physical kit has been validated.

## 0.4 checks — 2026-10-20

18 engine/mobile tests pass, including new outline, rejection and package-confirmation checks. Browser checks verified export disabled before confirmation, enabled after confirmation, successful HTML download, and disabled again after editing width. Eight taps on the synthetic 80 × 140 mm fixture returned 78.4 × 139.2 mm; this measures UI click/calculation behavior, not camera accuracy. The 5,400-trial comparison and its negative accuracy finding are in `simulations/COMPARISON.md`.
