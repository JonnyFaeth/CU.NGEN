import json
import math
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

from generate import drawing, generate


class LampTests(unittest.TestCase):
    def setUp(self):
        self.c = json.loads(Path(__file__).with_name('example.json').read_text())

    def test_example_geometry_and_material_conservation(self):
        r = generate(self.c)
        self.assertEqual(r['overall_mm'], [200, 200, 292])
        self.assertEqual([p['length_mm'] for p in r['frame_cut_list']], [280, 156, 156])
        self.assertAlmostEqual(r['frame_wood_volume_m3'], 2368*144/1e9)
        self.assertAlmostEqual(r['paper_area_m2'], 4*168*268/1e6)
        self.assertEqual(sum(len(b['pieces']) for b in r['stock_bars']), 12)
        for b in r['stock_bars']:
            self.assertAlmostEqual(sum(p['length_mm']+3 for p in b['pieces'])+b['remaining_mm'], 900)
            self.assertGreaterEqual(b['remaining_mm'], 0)
        ET.fromstring(drawing(r))

    def test_rectangular_frame(self):
        self.c['depth_mm'] = 150
        r = generate(self.c)
        self.assertEqual(r['frame_cut_list'][2]['length_mm'], 126)
        self.assertEqual(r['paper_panels'][1]['width_mm'], 138)

    def test_rejects_bad_geometry_and_inputs(self):
        for key, value in [('width_mm', 24), ('height_mm', 50), ('paper_overlap_mm', 13),
                           ('stock_length_mm', 280), ('paper_sheet_width_mm', 100),
                           ('source_width_mm', 140), ('source_cg_above_base_mm', 41),
                           ('kerf_mm', -1), ('wood_density_kg_m3', math.nan),
                           ('depth_mm', True), ('height_mm', math.inf)]:
            with self.subTest(key=key, value=value):
                with self.assertRaises(ValueError):
                    generate(dict(self.c, **{key: value}))

    def test_missing_and_unknown_values_rejected(self):
        with self.assertRaises(ValueError):
            generate(dict(self.c, imaginary_strength=100))
        del self.c['wood_density_kg_m3']
        with self.assertRaises(ValueError):
            generate(self.c)

    def test_rotated_sheet_is_accepted(self):
        self.c.update(paper_sheet_width_mm=450, paper_sheet_height_mm=300)
        generate(self.c)

    def test_wider_base_increases_ideal_tip_resistance(self):
        original = generate(self.c)
        self.c['base_margin_mm'] = 30
        wider = generate(self.c)
        self.assertGreater(wider['ideal_static_tip_angle_deg'], original['ideal_static_tip_angle_deg'])
        self.assertGreater(wider['ideal_horizontal_force_at_top_to_tip_N'], original['ideal_horizontal_force_at_top_to_tip_N'])


if __name__ == '__main__':
    unittest.main()
