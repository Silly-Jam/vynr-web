from pathlib import Path
import runpy
from svgpathtools import parse_path
from fontTools.pens.svgPathPen import SVGPathPen
from xml.etree import ElementTree as ET
base=Path(__file__).resolve().parent.parent
out=base/'bowl-lettering';out.mkdir(exist_ok=True)
# Reuse the exact accepted source generator without rewriting its outputs.
code=(base/'tools/build_vector.py').read_text()
code=code.replace("OUT=Path(__file__).resolve().parents[1]",f"OUT=Path({str(out)!r})")
code=code.replace("font=TTFont(OUT/'fonts/LeagueGothic[wdth].ttf')",f"font=TTFont(Path({str(base/'fonts/LeagueGothic[wdth].ttf')!r}))")
code=code.replace("text('ENJOY IT',345,1120,195)+text('MIGHTILY.',305,1310,205)","text('ENJOY IT',345,1180,195)+text('MIGHTILY.',305,1370,205)")
code=code.replace("+stamp(12,1330,132)","")
# Bring the cuff to the wrist and crop the forearm at its curved opening.
code=code.replace('M0 0 H1000 V1297 H185 Q83 1232 -25 1250 H0 Z','M0 0 H1000 V1060 H215 Q95 1005 -15 1035 H0 Z')
code=code.replace('M-25 1250 Q83 1232 185 1297 L146 1454 Q51 1398 -62 1420 Z','M-15 1035 Q95 1005 215 1060 L175 1220 Q65 1160 -65 1195 Z')
code=code.replace('M-25 1274 Q72 1258 176 1322','M-21 1059 Q90 1031 209 1085')
# Place each unchanged glyph on the baseline tangent, no text stretching.
insert='''
def bowl_lettering():
    # Offset the actual outer bowl contour, rather than drawing a second curve.
    contour=parse_path('M600 610 C692 580 790 475 790 351')
    offset=45.0  # cap height 23.52 + approximately 21.5 units of clear air
    points=[]
    for i in range(801):
        t=i/800
        tangent=contour.derivative(t)
        outward=1j*tangent/abs(tangent)
        points.append(contour.point(t)+offset*outward)
    baseline=parse_path('M'+str(points[0].real)+' '+str(points[0].imag)+''.join(' L'+str(p.real)+' '+str(p.imag) for p in points[1:]))
    label='WINE BASTARD';size=32;tracking=2.6;scale=size/units
    advances=[glyphs[cmap[ord(ch)]].width*scale for ch in label]
    total=sum(advances)+tracking*(len(label)-1)
    cursor=80
    paths=[]
    for ch,advance in zip(label,advances):
        t=baseline.ilength(cursor+advance/2)
        pt=baseline.point(t);tan=baseline.derivative(t)
        angle=math.degrees(math.atan2(tan.imag,tan.real))
        pen=SVGPathPen(glyphs);glyphs[cmap[ord(ch)]].draw(pen)
        paths.append(f'<g transform="translate({pt.real} {pt.imag}) rotate({angle}) translate({-advance/2} 0)"><path transform="scale({scale} {-scale})" d="{pen.getCommands()}"/></g>')
        cursor+=advance+tracking
    return '<g aria-label="WINE BASTARD">'+''.join(paths)+'</g>'
'''
code=code.replace('# Main hand retained',insert+'\n# Main hand retained')
code=code.replace("backred=f'<g transform=\"{transform}\">{red}</g>'", "backred=f'<g transform=\"{transform}\">{red}{bowl_lettering()}</g>'")
ns={'__file__':str(base/'tools/build_vector.py'),'parse_path':parse_path,'math':__import__('math')}
exec(code,ns)
# Save the reusable adapter, not a separate hand implementation.
print(out)
