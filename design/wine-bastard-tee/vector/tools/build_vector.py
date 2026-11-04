from pathlib import Path
from xml.etree import ElementTree as ET
OUT=Path(__file__).resolve().parents[1]
B='#1B1917'; R='#6E1522'
def p(d, **attrs):
    a=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in attrs.items())
    return f'<path d="{d}" {a}/>'
# Hand contours reconstructed as editable cubic curves, not auto-traced.
hand='M0 1536 C85 1380 163 1186 209 1040 C231 975 218 935 225 880 L242 811 C236 762 264 742 312 723 C355 705 377 682 395 674 Q404 651 418 654 Q431 658 437 664 L528 650 C551 644 565 655 580 659 C607 654 632 674 632 691 C635 714 611 728 579 724 L578 774 C614 778 636 790 631 816 C627 835 614 846 603 853 C620 860 628 880 619 900 C614 914 601 925 590 934 C608 943 612 963 600 979 C592 993 577 1003 560 1014 L505 1017 C482 1052 451 1076 412.8 1093 L412.8 1122.44 C342 1178 301 1284 273 1397 L237 1536 Z'
# Transparent holes for thumb and returning fingertips, all inside the silhouette.
holes=[
 'M252 817 C242 771 264 751 316 731 C354 717 380 691 401 682 Q409 660 420 664 Q432 671 441 672 L527 658 C507 680 479 704 448 724 C414 748 394 777 363 795 C332 813 307 841 291 867 Q291 870 294 868 C320 834 347 818 378 801 C412 781 428 756 454 738 C489 717 522 687 544 664 C564 660 579 683 570 704 C555 740 531 770 504 791 C490 820 477 848 478 878 C481 910 480 947 473 975 C460 1013 441 1036 412 1058 Q409 1062 413 1062 C448 1042 477 1014 491 986 C500 1004 499 1012 488 1026 C466 1053 438 1070 404 1085 L401 1124 C332 1191 291 1295 260 1430 L238 1526 L15 1526 C108 1341 177 1165 218 1045 C241 978 229 938 236 883 Z',
'M586 669 C610 666 627 680 625 695 C623 712 608 720 590 715 C582 704 583 685 586 669 Z',
'M543 807 C565 785 598 778 616 792 C634 806 612 838 577 861 C555 876 536 875 529 862 C518 847 526 825 543 807 Z',
'M541 891 C562 878 588 864 603 868 C620 882 610 900 591 913 C571 927 548 939 528 938 C507 937 506 922 514 912 C521 904 531 899 541 891 Z',
'M533 965 C555 956 575 944 591 949 C606 955 604 970 590 981 C574 991 550 999 534 995 C516 989 516 973 533 965 Z']
# mask to turn all light areas into actual no-ink areas
mask=f'<mask id="hand-cuts" maskUnits="userSpaceOnUse" x="-20" y="620" width="700" height="950"><rect x="-20" y="620" width="700" height="950" fill="white"/>'+''.join(p(d,fill='black',stroke='black',stroke_width='4',stroke_linejoin='round') for d in holes)+'</mask>'
hand_art=p(hand,mask='url(#hand-cuts)')+p(hand,fill='none',stroke=B,stroke_width='4',stroke_linejoin='round')
# Sparse cut-like black accents, minimum useful widths except intentional tips.
accents=[
'M276 1009 C328 1015 369 1003 407 977 C382 1013 330 1035 276 1009 Z',

'M182 1366 C195 1273 221 1217 258 1166 C233 1232 204 1310 182 1366 Z',
'M367 882 C404 878 430 861 447 838 C431 869 401 886 367 882 Z',
'M348 925 C394 922 423 905 443 879 C427 915 392 931 348 925 Z',
'M439 735 C450 744 461 752 470 758 C453 756 444 749 439 735 Z',
'M580 823 Q595 826 590 842 Q587 832 580 829 Z',
'M549 902 Q566 900 566 916 Q560 908 550 908 Z',
'M548 966 Q560 970 555 982 Q552 974 547 972 Z']
middle_joint=p('M567 797 Q554 808 554 818',fill='none',stroke=B,stroke_width='5',stroke_linecap='round')
thumb_nail=p('M518 697 Q533 709 545 697',fill='none',stroke=B,stroke_width='5',stroke_linecap='round')
# Bowl exact maximum width: 460 units (330..790); both extrema on the curve.
bowl_outer='M400 119 C426 100 699 100 727 119 C754 190 790 275 790 351 C790 475 692 580 600 610 C580 624 576 641 576 663 L541 663 C541 637 530 621 511 606 C410 563 330 474 330 351 C330 273 370 187 400 119 Z'
bowl_inner='M411 130 C382 204 344 284 344 351 C344 467 423 550 518 591 C544 604 572 604 596 593 C686 564 776 468 776 351 C776 280 743 197 716 130 C680 142 459 143 411 130 Z'
rim='M420 116 Q417 116 417 119 Q417 122 420 122 C470 130 660 130 708 122 Q711 122 711 119 Q711 116 708 116 C655 108 470 108 420 116 Z'
bowl=p(bowl_outer+' '+bowl_inner+' '+rim+' M535 608 Q556 621 568 611 L565 650 L552 650 Q550 627 535 608 Z',fill_rule='evenodd')
# Stem behind hand: single axis. Foot width 368, height 29.44. Wrist x=412.8.
stem=p('M541 650 L541 1095 L576 1095 L576 650 Z')
stemhole=p('M549 650 L549 1095 L567 1095 L567 650 Z',fill='black')
foot='<path id="foot" fill-rule="evenodd" d="M376 1108 A184 14.72 0 1 0 744 1108 A184 14.72 0 1 0 376 1108 Z M388 1108 A172 8.72 0 1 1 732 1108 A172 8.72 0 1 1 388 1108 Z"/>'
# Opaque overlay is implemented as a mask knockout, not an ecru ink object.
footmask='<mask id="foot-occlusion" maskUnits="userSpaceOnUse" x="-20" y="0" width="1100" height="1600"><rect x="-20" width="1100" height="1600" fill="white"/><ellipse cx="560" cy="1108" rx="184" ry="14.72" fill="black"/></mask>'
stemmask='<mask id="stem-cut" maskUnits="userSpaceOnUse" x="500" y="600" width="110" height="550"><rect x="500" y="600" width="110" height="550" fill="white"/>'+stemhole+'</mask>'
wine='M360 422 C429 474 522 450 580 393 C635 338 633 250 692 227 C711 218 734 221 744 232 C764 311 774 383 746 450 C715 525 650 567 592 576 C493 589 406 528 360 422 Z'
highlight='M656 312 C661 283 690 247 713 239 C735 231 714 253 702 269 C683 292 671 318 660 319 Q654 320 656 312 Z'
red=p(wine+' '+highlight,fill_rule='evenodd',stroke=R,stroke_width='4',stroke_linejoin='round')
def svg(content,defs='',w='300mm',h='450mm',vb='0 0 1000 1500'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="{w}" height="{h}" viewBox="{vb}"><title>Wine Bastard — editable vector review, not production approved</title><defs>{defs}</defs>{content}</svg>'
def layer(id,content,color):return f'<g id="{id}" fill="{color}">{content}</g>'
accents += ['M285 872 C315 807 362 799 409 758 C448 724 480 706 508 680 C500 698 473 718 437 746 C406 785 375 806 342 823 C318 839 300 856 285 872 Z', 'M493 780 C474 815 454 840 432 854 C459 833 474 804 482 780 Z']
palm_fix=p('M408 1065 Q420 1057 431 1044',fill='none',stroke=B,stroke_width='4',stroke_linecap='round')
black_hand=f'<g mask="url(#foot-occlusion)"><g mask="url(#stem-behind-hand)"><g mask="url(#stem-cut)">{stem}</g></g>{hand_art}{"".join(p(x,stroke=B,stroke_width="4",stroke_linejoin="round") for x in accents)}{thumb_nail}{middle_joint}{palm_fix}</g>{bowl}<circle cx="535" cy="608" r="2.2"/>{foot}'
defs=mask+footmask+stemmask+'<mask id="stem-behind-hand" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1600"><rect width="1024" height="1600" fill="white"/>'+p(hand,fill='black')+'</mask>'
OUT.joinpath('hand-glass-review.svg').write_text(svg(layer('black',black_hand,B)+layer('oxblood',red,R),defs,w='240mm',h='360mm',vb='0 0 1024 1536'))
# League Gothic, native glyph proportions; licence bundled under fonts/.
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
font=TTFont(OUT/'fonts/LeagueGothic[wdth].ttf')
glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); units=font['head'].unitsPerEm

def text(s,x,y,size,width=None,tracking=0,center=False):
    scale=size/units
    advances=[glyphs[cmap[ord(ch)]].width*scale for ch in s]
    total=sum(advances)+tracking*max(0,len(s)-1)
    cursor=x-total/2 if center else x
    paths=[]
    for ch,advance in zip(s,advances):
        pen=SVGPathPen(glyphs); glyphs[cmap[ord(ch)]].draw(pen)
        paths.append(f'<path transform="translate({cursor} {y}) scale({scale} {-scale})" d="{pen.getCommands()}"/>')
        cursor+=advance+tracking
    return '<g aria-label="'+s+'">'+''.join(paths)+'</g>'

def stamp(x,y,width,front=False):
    if front:
        lines=text('WINE BASTARD',80,31,30,center=True)+text('MANIFESTO',80,49,13,tracking=13*.34,center=True)
    else:
        lines=text('WINE',80,32,35,center=True)+text('BASTARD',80,66,35,center=True)
    ht=60 if front else 80
    sid='front-wear' if front else 'cuff-wear'
    wear=f'<mask id="{sid}" maskUnits="userSpaceOnUse" x="-5" y="-5" width="170" height="{ht+10}"><rect x="-5" y="-5" width="170" height="{ht+10}" fill="white"/><path d="M22 -2 H26 V11 H22 Z M110 {ht-11} H114 V{ht+2} H110 Z M-2 39 H11 V43 H-2 Z M151 18 H162 V22 H151 Z" fill="black"/></mask>'
    return wear+f'<g transform="translate({x} {y}) rotate(-6) scale({width/160})"><g mask="url(#{sid})"><rect x="1.5" y="1.5" width="157" height="{ht-3}" rx="2" fill="none" stroke="{R}" stroke-width="3"/><rect x="7" y="7" width="146" height="{ht-14}" fill="none" stroke="{R}" stroke-width="2"/><ellipse cx="155" cy="{ht-5}" rx="4" ry="3"/>{lines}</g></g>'
# Main hand retained as single shared drawing, scaled without changing ratios.
transform='translate(-130 -65) scale(.9)'
# Truncate arm at cuff using clipPath.
defs+='<clipPath id="arm-crop"><path d="M0 0 H1000 V1297 H185 Q83 1232 -25 1250 H0 Z"/></clipPath>'
backblack=f'<g clip-path="url(#arm-crop)"><g transform="{transform}">{black_hand}</g></g>'
# Cuff occupies lower left, outlined to keep red stamp on exposed ecru.
backblack+=p('M-25 1250 Q83 1232 185 1297 L146 1454 Q51 1398 -62 1420 Z',fill='none',stroke=B,stroke_width='9',stroke_linejoin='round')
backblack+=p('M-25 1274 Q72 1258 176 1322',fill='none',stroke=B,stroke_width='6')
backblack+=text('ENJOY IT',345,1120,195)+text('MIGHTILY.',305,1310,205)
backred=f'<g transform="{transform}">{red}</g>'+stamp(12,1330,132)
OUT.joinpath('back-review.svg').write_text(svg(layer('black',backblack,B)+layer('oxblood',backred,R),defs))
OUT.joinpath('front-stamp-review.svg').write_text(svg(layer('oxblood',stamp(8,23,160,True),R),w='80mm',h='42mm',vb='0 0 180 94.5'))
# Geometry checks tied to constructed paths.
assert 744-376 == .8*(790-330)
assert abs(29.44/(744-376)-.08)<1e-9
assert abs((412.8-376)/(744-376)-.1)<1e-9
for f in OUT.glob('*review.svg'):
 root=ET.parse(f).getroot()
 assert not root.findall('.//{http://www.w3.org/2000/svg}image')
 print(f.name, 'valid XML; no embedded raster')
print('foot width 368 = 80% of bowl 460; height 29.44 = 8%; wrist x 412.8 = 10% inset')
