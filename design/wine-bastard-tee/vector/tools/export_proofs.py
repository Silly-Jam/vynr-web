from pathlib import Path
from xml.etree import ElementTree as ET
import subprocess,shutil,json
p=Path(__file__).resolve().parents[1]
ns='{http://www.w3.org/2000/svg}'
for stem,png in [('back','back-final-preview.png'),('front-stamp','front-final-preview.png'),('hand-glass','hand-final-preview.png')]:
 subprocess.run(['rsvg-convert','-b','#F4ECD8','-d','300','-p','300','-o',str(p/png),str(p/(stem+'-final.svg'))],check=True)
subprocess.run(['rsvg-convert','-f','pdf','-o',str(p/'back-actual-size.pdf'),str(p/'back-final.svg')],check=True)
f=ET.parse(p/'front-stamp-final.svg').getroot();h=float(f.get('height')[:-2]);vb=f.get('viewBox');inner=''.join(ET.tostring(x,encoding='unicode') for x in f if x.tag!=ns+'title')
proof=f'''<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect width="210" height="297" fill="white"/><text x="20" y="22" font-family="sans-serif" font-size="5">WINE BASTARD — FRONT PRINT PROOF</text><text x="20" y="33" font-family="sans-serif" font-size="3.5">Print at 100% / actual size. Do not fit to page.</text><svg x="65" y="60" width="80" height="{h}" viewBox="{vb}">{inner}</svg><path d="M20 125 H30 M20 122 V128 M30 122 V128" stroke="black" stroke-width=".3"/><text x="35" y="126" font-family="sans-serif" font-size="3.5">10 mm check</text><text x="20" y="145" font-family="sans-serif" font-size="3.5">Stamp ink width: 80 mm. Oxblood ink only.</text><text x="20" y="153" font-family="sans-serif" font-size="3.5">Design review proof; printer proof on fabric still required.</text></svg>'''
(p/'front-a4-proof.svg').write_text(proof)
subprocess.run(['rsvg-convert','-f','pdf','-o',str(p/'front-actual-size-a4.pdf'),str(p/'front-a4-proof.svg')],check=True)
print('300dpi previews and 1:1 back/front PDFs exported')
