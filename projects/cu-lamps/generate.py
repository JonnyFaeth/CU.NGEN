"""Orthogonal lamp concept generator. Standard library only; dimensions in mm."""
import argparse
import json
import math
from pathlib import Path


def generate(c):
    required = {
        'width_mm', 'depth_mm', 'height_mm', 'section_mm', 'base_margin_mm',
        'base_thickness_mm', 'paper_overlap_mm', 'stock_length_mm', 'kerf_mm',
        'paper_sheet_width_mm', 'paper_sheet_height_mm', 'wood_density_kg_m3',
        'base_density_kg_m3', 'paper_g_m2', 'source_width_mm', 'source_depth_mm',
        'source_height_mm', 'source_mass_kg', 'source_cg_above_base_mm',
        'design_clearance_mm', 'dimensional_allowance_mm',
    }
    if set(c) != required:
        raise ValueError(f'Config keys differ: missing={sorted(required-set(c))}, '
                         f'unknown={sorted(set(c)-required)}')
    for k, v in c.items():
        if isinstance(v, bool) or not isinstance(v, (float, int)) or not math.isfinite(v) or v <= 0:
            raise ValueError(f'{k} must be a finite positive number')
    w, d, h, s = (c[k] for k in ('width_mm', 'depth_mm', 'height_mm', 'section_mm'))
    a, o = c['dimensional_allowance_mm'], c['paper_overlap_mm']
    if min(w, d, h) <= 2*s + 2*a:
        raise ValueError('Frame has no usable opening')
    if not a < o <= s-a:
        raise ValueError('Paper overlap must fit within rail face with dimensional allowance')
    if c['source_cg_above_base_mm'] > c['source_height_mm']:
        raise ValueError('Source center of mass lies outside source envelope')
    clearances = {
        'x': (w-2*s-c['source_width_mm'])/2-a,
        'y': (d-2*s-c['source_depth_mm'])/2-a,
        'above': h-s-c['source_height_mm']-a,
    }
    if min(clearances.values()) < c['design_clearance_mm']:
        raise ValueError('Source envelope fails requested geometric clearance')
    cuts = [('post', h)]*4 + [('width rail', w-2*s)]*4 + [('depth rail', d-2*s)]*4
    # First-fit decreasing: conservative kerf charged for every piece, including last.
    bars = []
    for name, length in sorted(cuts, key=lambda x: x[1], reverse=True):
        need = length+c['kerf_mm']
        if need > c['stock_length_mm']:
            raise ValueError('A frame part exceeds usable stock length including kerf')
        bar = next((b for b in bars if b['remaining_mm'] >= need), None)
        if bar is None:
            bar = {'pieces': [], 'remaining_mm': c['stock_length_mm']}
            bars.append(bar)
        bar['pieces'].append({'part': name, 'length_mm': length})
        bar['remaining_mm'] -= need
    panels = [
        {'face': face, 'quantity': 2, 'width_mm': span-2*s+2*o, 'height_mm': h-2*s+2*o}
        for face, span in [('front/back', w), ('left/right', d)]]
    for p in panels:
        pw, ph = p['width_mm']+2*a, p['height_mm']+2*a
        sw, sh = c['paper_sheet_width_mm'], c['paper_sheet_height_mm']
        if not ((pw <= sw and ph <= sh) or (ph <= sw and pw <= sh)):
            raise ValueError('Paper panel plus trim allowance exceeds sheet')
    t = c['base_thickness_mm']
    bw, bd = w+2*c['base_margin_mm'], d+2*c['base_margin_mm']
    wood_volume = sum(length*s*s for _, length in cuts)*1e-9
    frame_mass = wood_volume*c['wood_density_kg_m3']
    base_mass = bw*bd*t*1e-9*c['base_density_kg_m3']
    paper_area = sum(p['quantity']*p['width_mm']*p['height_mm'] for p in panels)*1e-6
    paper_mass = paper_area*c['paper_g_m2']/1000
    source_mass = c['source_mass_kg']
    total = frame_mass+base_mass+paper_mass+source_mass
    cg = ((frame_mass+paper_mass)*(t+h/2)+base_mass*t/2
          +source_mass*(t+c['source_cg_above_base_mm']))/total
    half_span = min(bw, bd)/2
    return {
        'schema_version': 1, 'status': 'calculated concept; not build-validated',
        'inputs': c, 'overall_mm': [bw, bd, t+h],
        'frame_cut_list': [{'part': name, 'quantity': 4, 'length_mm': length,
                            'section_mm': [s, s]} for name, length in
                           [('post', h), ('width rail', w-2*s), ('depth rail', d-2*s)]],
        'base_mm': [bw, bd, t], 'stock_bars': bars,
        'paper_panels': panels, 'paper_sheets_conservative': 4,
        'paper_area_m2': paper_area, 'frame_wood_volume_m3': wood_volume,
        'source_clearances_mm': clearances,
        'estimated_mass_kg': {'frame': frame_mass, 'base': base_mass,
                              'paper': paper_mass, 'source': source_mass, 'total': total},
        'estimated_center_of_mass_above_table_mm': cg,
        'ideal_static_tip_angle_deg': math.degrees(math.atan(half_span/cg)),
        'ideal_horizontal_force_at_top_to_tip_N': total*9.80665*half_span/(t+h),
        'assumptions': [
            'All dimensions nominal; allowance is an input, not a measured tolerance.',
            'Symmetric uniform frame, base and paper; source centered and fixed to base.',
            'Rigid joints, full base footprint contact, level table; no sliding.',
            'Glue, clips, feet, wiring and finish masses omitted.',
            'Density and paper weight are supplied estimates, not measured properties.',
            'Clearance is a requested geometry constraint, not a thermal safety rating.',
            'Stock length is usable length after damaged ends/squaring; packing is heuristic.',
        ],
        'unresolved': [
            'Exact wood, paper, adhesive, joint reinforcement and source product.',
            'Joint/racking strength, paper sag, humidity response and surface finish.',
            'Source installation instructions, attachment, cable routing and electrical protection.',
            'Temperature testing, optical transmission, illuminance and fire performance.',
            'Measured mass/center of gravity, sliding, tip resistance and assembly trial.',
            'Procurement availability, tools, delivered cost and independent reproduction.',
        ],
    }


def drawing(r):
    c = r['inputs']
    w, d, h, s = (c[k] for k in ('width_mm', 'depth_mm', 'height_mm', 'section_mm'))
    t, m, o = c['base_thickness_mm'], c['base_margin_mm'], c['paper_overlap_mm']
    fullw = w+d+4*m+140
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fullw} {h+t+140}">',
             '<rect width="100%" height="100%" fill="#faf8f2"/>',
             '<g font-family="sans-serif" font-size="12" fill="#292620">',
             '<text x="20" y="22">CU.NGEN — orthogonal paper lamp | concept, not a cutting template</text>']
    for span, x, label in [(w, 30+m, 'Front'), (d, 90+w+3*m, 'Side')]:
        y = 65
        parts.append(f'<rect x="{x+s-o}" y="{y+s-o}" width="{span-2*s+2*o}" height="{h-2*s+2*o}" fill="#eee1bf"/>')
        for rx, ry, rw, rh in [(x,y,s,h),(x+span-s,y,s,h),
                               (x+s,y,span-2*s,s),(x+s,y+h-s,span-2*s,s),
                               (x-m,y+h,span+2*m,t)]:
            parts.append(f'<rect x="{rx}" y="{ry}" width="{rw}" height="{rh}" fill="#967345" stroke="#503e28" stroke-width="0.5"/>')
        parts.append(f'<text x="{x}" y="{y+h+t+20}">{label}: {span:g} × {h:g} mm frame</text>')
    parts.append('</g></svg>')
    return '\n'.join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('config', type=Path)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    try:
        result = generate(json.loads(args.config.read_text(encoding='utf-8')))
    except (ValueError, OSError) as exc:
        parser.exit(2, f'Invalid lamp configuration: {exc}\n')
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out/'build.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    (args.out/'elevations.svg').write_text(drawing(result), encoding='utf-8')
    print(f'Generated calculated concept in {args.out}; physical validation remains required.')


if __name__ == '__main__':
    main()
