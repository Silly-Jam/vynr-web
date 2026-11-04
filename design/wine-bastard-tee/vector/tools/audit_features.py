from resolve_vectors import *
Path('work').mkdir(exist_ok=True)
from PIL import Image
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt,convolve,label
import subprocess
results={}
for stem in ['back','front-stamp']:
 root=ET.parse(P/(stem+'-review.svg')).getroot()
 # Audit drawn marks separately, preserve League Gothic as authored.
 for parent in root.iter():
  for child in list(parent):
   if child.get('aria-label'):parent.remove(child)
 geoms=resolve(root)
 final=ET.parse(P/(stem+'-final.svg')).getroot()
 vb=[float(x) for x in final.get('viewBox').split()];mm=float(final.get('width')[:-2])/vb[2]
 g=unary_union(list(geoms.values())).intersection(box(vb[0],vb[1],vb[0]+vb[2],vb[1]+vb[3]))
 body=f'<svg xmlns="http://www.w3.org/2000/svg" width="{final.get("width")}" height="{final.get("height")}" viewBox="{final.get("viewBox")}"><path fill="black" fill-rule="evenodd" d="{dpath(g)}"/></svg>'
 src=Path('work')/(stem+'-marks.svg');src.write_text(body);png=src.with_suffix('.png')
 subprocess.run(['rsvg-convert','-d','400','-p','400','-o',str(png),str(src)],check=True)
 im=np.array(Image.open(png).convert('RGBA'))[:,:,3]>=128
 pixmm=25.4/400
 dist=distance_transform_edt(im)
 sk=skeletonize(im)
 for _ in range(8):
  neighbors=convolve(sk.astype(np.uint8),np.ones((3,3),dtype=np.uint8),mode='constant')-sk
  sk&=neighbors>1
 # Ignore intentional crop intersection within 0.5mm of page boundary.
 edge=max(1,int(.5/pixmm))
 sk[:edge,:]=False;sk[-edge:,:]=False;sk[:,:edge]=False;sk[:,-edge:]=False
 widths=dist[sk]*2*pixmm
 components= [g] if g.geom_type=='Polygon' else list(g.geoms)
 widths_components=[]
 for c in components:
  coords=list(c.minimum_rotated_rectangle.exterior.coords)
  widths_components.append(min(math.dist(coords[i],coords[i+1]) for i in range(4))*mm)
 results[stem]={'sample_dpi':400,'pixel_mm':pixmm,'body_medial_width_min_mm_after_8px_terminal_prune':float(widths.min()),'body_medial_width_1pct_mm':float(np.quantile(widths,.01)),'min_isolated_component_rotated_box_width_mm':min(widths_components),'component_count':len(components),'sub_0_4mm_samples':int((widths<.4).sum())}
 # Coordinates of worst positions for correction, not public minima claim.
 yy,xx=np.where(sk & (dist*2*pixmm<.4))
 if len(xx):results[stem]['thin_extent_source_units']=[float(xx.min()*pixmm/mm+vb[0]),float(yy.min()*pixmm/mm+vb[1]),float(xx.max()*pixmm/mm+vb[0]),float(yy.max()*pixmm/mm+vb[1])]
 bad=sk & (dist*2*pixmm<.4)
 labs,n=label(bad,structure=np.ones((3,3)))
 clusters=[]
 for i in range(1,n+1):
  cy,cx=np.where(labs==i)
  if len(cx):clusters.append({'count':len(cx),'x':round(float(cx.mean()*pixmm/mm+vb[0]),2),'y':round(float(cy.mean()*pixmm/mm+vb[1]),2)})
 results[stem]['thin_clusters']=clusters
 gapdist=distance_transform_edt(~im)
 gapsk=skeletonize(~im)
 for _ in range(12):
  nbs=convolve(gapsk.astype(np.uint8),np.ones((3,3),dtype=np.uint8),mode='constant')-gapsk
  gapsk&=nbs>1
 gapsk[:edge,:]=False;gapsk[-edge:,:]=False;gapsk[:,:edge]=False;gapsk[:,-edge:]=False
 gapwidths=gapdist[gapsk]*2*pixmm
 results[stem]['gap_medial_width_min_mm_after_12px_terminal_prune']=float(gapwidths.min())
 results[stem]['sub_0_5mm_gap_samples']=int((gapwidths<.5).sum())
 print(stem,results[stem])
Path('work/feature-audit.json').write_text(json.dumps(results,indent=2)+'\n')
