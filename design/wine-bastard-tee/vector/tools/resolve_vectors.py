from pathlib import Path
import math,re,json
import numpy as np
from xml.etree import ElementTree as ET
from svgpathtools import parse_path
from shapely.geometry import Polygon,LineString,box,GeometryCollection
from shapely.ops import unary_union
from shapely.affinity import affine_transform
from shapely import make_valid
P=Path(__file__).resolve().parents[1]
NS='{http://www.w3.org/2000/svg}'
EMPTY=GeometryCollection()
def tidy(g):
 g=make_valid(g)
 if g.geom_type=='GeometryCollection':return unary_union([x for x in g.geoms if x.geom_type in ('Polygon','MultiPolygon')])
 if g.geom_type=='Polygon':
  g=Polygon(g.exterior,[r for r in g.interiors if Polygon(r).area>.0001])
 elif g.geom_type=='MultiPolygon':
  g=unary_union([Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>.0001]) for q in g.geoms if q.area>.0001])
 return g

def matrix(t):
 m=np.eye(3)
 for name,body in re.findall(r'(\w+)\s*\(([^)]*)\)',t or ''):
  a=[float(v) for v in re.split(r'[ ,]+',body.strip())]; n=np.eye(3)
  if name=='translate':n[0,2]=a[0];n[1,2]=a[1] if len(a)>1 else 0
  elif name=='scale':n[0,0]=a[0];n[1,1]=a[1] if len(a)>1 else a[0]
  elif name=='rotate':
   r=math.radians(a[0]);n[:2,:2]=[[math.cos(r),-math.sin(r)],[math.sin(r),math.cos(r)]]
   if len(a)>1:
    c=np.array([a[1],a[2]]);n[:2,2]=c-n[:2,:2]@c
  elif name=='matrix':n=np.array([[a[0],a[2],a[4]],[a[1],a[3],a[5]],[0,0,1]])
  else:raise ValueError(name)
  m=m@n
 return [m[0,0],m[0,1],m[1,0],m[1,1],m[0,2],m[1,2]]

def geometry(el):
 tag=el.tag.split('}')[-1];a=el.attrib
 if tag=='path':
  path=parse_path(a.get('d',''))
  rings=[]; lines=[]
  for sub in path.continuous_subpaths() if len(path) else []:
   pts=[]
   for seg in sub:
    # Sample source VECTOR curves, never raster pixels. Max chord <=0.5 units.
    n=max(2,int(math.ceil(seg.length(error=1e-4)/.5)))
    pts.extend((seg.point(t).real,seg.point(t).imag) for t in np.linspace(0,1,n+1)[:-1])
   if not pts:continue
   pts.append((sub[-1].end.real,sub[-1].end.imag))
   lines.append(LineString(pts))
   if len(pts)>=3:
    g=tidy(Polygon(pts))
    if not g.is_empty:rings.append(g)
  fill=EMPTY
  for ring in rings:fill=tidy(fill.symmetric_difference(ring))
  return fill,unary_union(lines)
 if tag=='rect':
  x=float(a.get('x',0));y=float(a.get('y',0));w=float(a.get('width',0));h=float(a.get('height',0));r=float(a.get('rx',0))
  g=box(x+r,y+r,x+w-r,y+h-r).buffer(r,quad_segs=32) if r else box(x,y,x+w,y+h)
  return g,g.boundary
 if tag in ('ellipse','circle'):
  cx=float(a.get('cx',0));cy=float(a.get('cy',0));rx=float(a.get('rx',a.get('r',0)));ry=float(a.get('ry',a.get('r',0)))
  pts=[(cx+rx*math.cos(t),cy+ry*math.sin(t)) for t in np.linspace(0,2*math.pi,1025)]
  g=Polygon(pts);return g,g.boundary
 return EMPTY,EMPTY

def resolve(root):
 ids={e.get('id'):e for e in root.iter() if e.get('id')}
 def render(e,inherit=None,is_mask=False):
  style=dict(inherit or {'fill':'black','stroke':'none'})
  for k in ['fill','stroke','stroke-width','stroke-linejoin','stroke-linecap']:
   if k in e.attrib:style[k]=e.get(k)
  tag=e.tag.split('}')[-1]
  if tag in ['defs','title','desc','mask','clipPath']:return EMPTY
  if tag in ['g','svg']:
   g=unary_union([render(c,style,is_mask) for c in e])
  else:
   f,l=geometry(e);g=f if style.get('fill')!='none' else EMPTY
   if style.get('stroke','none')!='none' and not l.is_empty:
    stroke=l.buffer(float(style.get('stroke-width',1))/2,quad_segs=16,cap_style=1 if style.get('stroke-linecap')=='round' else 2,join_style=1 if style.get('stroke-linejoin')=='round' else 2)
    g=unary_union([g,stroke])
  if e.get('mask'):
   mask=ids[e.get('mask')[5:-1]];mg=EMPTY
   for child in mask:
    cg=render(child)
    if child.get('fill','black')=='white':mg=unary_union([mg,cg])
    else:mg=mg.difference(cg)
   g=g.intersection(mg)
  if e.get('clip-path'):
   clip=ids[e.get('clip-path')[5:-1]]
   g=g.intersection(unary_union([render(c) for c in clip]))
  if e.get('transform'):g=affine_transform(g,matrix(e.get('transform')))
  return tidy(g)
 return {k:render(ids[k]) for k in ['black','oxblood'] if k in ids}

def dpath(g):
 polys=[g] if g.geom_type=='Polygon' else list(g.geoms)
 s=[]
 for poly in polys:
  if poly.geom_type!='Polygon':continue
  for ring in [poly.exterior,*poly.interiors]:
   coords=list(ring.coords)
   s.append('M'+' L'.join(f'{x:.4f},{y:.4f}' for x,y in coords)+' Z')
 return ' '.join(s)

if __name__ == '__main__':
    report={}
    
    for stem in ['hand-glass','back','front-stamp']:
     source=P/(stem+'-review.svg');root=ET.parse(source).getroot(); geoms=resolve(root)
     vb=[float(v) for v in root.get('viewBox').split()]
     width=float(root.get('width').replace('mm',''));height=float(root.get('height').replace('mm',''))
     if stem=='front-stamp':
      bounds=unary_union(list(geoms.values())).bounds
      vb=[bounds[0],bounds[1],bounds[2]-bounds[0],bounds[3]-bounds[1]]
      width=80.;height=80*vb[3]/vb[2]
     mm=width/vb[2]
     for k in geoms:geoms[k]=geoms[k].intersection(box(vb[0],vb[1],vb[0]+vb[2],vb[1]+vb[3])).simplify(.01,preserve_topology=True)
     content=''.join(f'<g id="{k}" fill="{color}"><path fill-rule="evenodd" d="{dpath(geoms[k])}"/></g>' for k,color in [('black','#1B1917'),('oxblood','#6E1522')] if k in geoms)
     output=f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}mm" height="{height}mm" viewBox="{" ".join(map(str,vb))}"><title>Wine Bastard — resolved vector candidate</title>{content}</svg>'
     (P/(stem+'-final.svg')).write_text(output)
     report[stem]={'width_mm':width,'height_mm':height,'mm_per_unit':mm,'ink_components':{k:len(list(v.geoms)) if hasattr(v,'geoms') else 1 for k,v in geoms.items()},'mask_count':0,'clip_count':0,'curve_sampling_max_chord_units':.5}
     print(stem,report[stem])
    (P/'geometry-report.json').write_text(json.dumps(report,indent=2)+'\n')
