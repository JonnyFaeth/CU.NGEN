# Original RFQ compatibility package

Re-exported on 2026-10-20 after a supplier reported that the original DXFs opened as empty. The original files contain contours, but the cause of that supplier import failure is not established.

Download [the complete ZIP](../CU-original-RFQ-compatible.zip) or [the full-scale vector PDF](CU-original-RFQ-full-scale.pdf). Read READ-ME.txt before importing. Use only one format; the PDF and both DXF versions represent the same parts.

This preserves the original quote geometry: **100 mm synthetic fixture projection**, nominal 3.175 mm plywood, and a 474.05 mm square largest panel. It does not incorporate the later approximate nine-inch projection. Pricing only; no manufacturing or paid work is authorized.

The reproducible exporter is `scripts/build_supplier_repair.py`, requiring ezdxf 1.4.5, reportlab and pypdf. It checks every DXF segment against the frozen original design, reopens and audits each DXF, and checks PDF page dimensions and every vector coordinate. All seven PDF pages were rendered with Poppler and visually inspected. Supplier CAM compatibility remains unconfirmed.

## Suggested supplier reply (not sent)

Hello Marshall,

Thank you for flagging this. I have re-exported the original sample with standard-library DXFs and a full-scale vector PDF:

https://github.com/JonnyFaeth/CU.NGEN/raw/refs/heads/main/procurement/CU-original-RFQ-compatible.zip

The package contains seven PDF pages (A through E and two fit coupons), R2010 closed-polyline DXFs, and R12 line-based DXFs as a legacy alternative. These are alternate formats for the same parts. Please use one format only. All dimensions are millimeters; please confirm panel E measures 474.05 mm square after import. The PDF has a 10 mm margin around each part; please do not scale it to fit a page. R12 requires selecting millimeters manually.

The geometry is unchanged from the original pricing sample, including the synthetic 100 mm projection. Final dimensions and mounting remain unresolved. Could you confirm whether one of these formats imports correctly and provide the requested pricing for 1, 5 and 10 sets, including a coupon pair per set? If it still fails, please let us know the CAD/CAM software and error message.

This remains a pricing enquiry only, with no authorization for paid preparation, cutting or other work.

Thank you,
Jonathan D Faeth
