import sys
import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy import stats
from scipy.interpolate import griddata
import scipy.ndimage as ndimage
#from matplotlib.mlab import griddata
import scipy.interpolate
from scipy.interpolate import Rbf
from matplotlib import cm
import matplotlib
import matplotlib.mlab as ml
import matplotlib.image as mpimg


filename = sys.argv[1]

script_dir = os.path.dirname(__file__)
results_dir = os.path.join(script_dir, 'normalheatmaps/')
sample_file_name = filename

csv_filename = 'normalheatmaps/'+sample_file_name+'.csv'
df = pd.read_csv(csv_filename)

y = df.x
x = df.y
z = []
e = []

for f in df.z:
    e.append(f)
z = df.z

ny, nx = 100, 100
xmin, xmax = -100, 100
ymin, ymax = 0, 100

xi = np.linspace(xmin, xmax, nx, endpoint=False)
yi = np.linspace(ymin, ymax, ny, endpoint=False)
zi = griddata((x, y), e, (xi[None,:], yi[:,None]), method='cubic')

""" zi = ml.griddata(x, y, z, xi, yi, interp='linear') """
""" fig = plt.figure(figsize=(7.91,5.86)) """
fig = plt.figure(figsize=(7.91,6.124))
plt.axes().set_aspect('auto', 'box')

#plt.contour(xi, yi, zi, 1, linewidths = 0, colors = 'k')
#plt.pcolormesh(xi, yi, zi, vmin=-0.1, vmax=0.1, cmap = plt.get_cmap('bwr'))

""" img=mpimg.imread('heatmap_new_760.png') """
img=mpimg.imread('hriste_760x582@2x.png')

plt.imshow(img, aspect='auto', origin='lower', extent=[max(xi) + 3, min(xi)-1, max(yi)+1.5, min(yi)-0.5])

ymin, ymax = -40, 100
yi = np.linspace(ymin, ymax, ny, endpoint=False)

pw = 2
xm = ndimage.zoom(xi, pw, mode="wrap")
ym = ndimage.zoom(yi, pw, mode="wrap")
zm = ndimage.zoom(zi, pw, mode="wrap")

zi_minimum_list = min(z)
zi_maximum_list = max(z)

zi_min = 0
zi_max = 0
""" plt.imshow(img,aspect='auto',origin='lower',extent=[max(xi), min(xi), max(yi), min(yi)])"""
 
#https://coolors.co/198138-1c8a3c-1f9240-24a248-42bf65-6fdd8c-a7f1ba-cef4d9-e2f6e9-f5f7f8
colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000"]

count = round(z.max()/0.350)
boundaries_list = []

times = count
if(count==1):
    times = 6

if(count==2):
    times = 6

if(count==3):
    times = 6

if(count==4):
    times = 6

if(count==5):
    times = 7

if(count==6):
    times = 7

if(count==7):
    times = 8

if(count>=8):
    times = count + 1

if(times==6):
    colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C"]

if(times==7):
    colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424"]

if(times==8):
    colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000"]

if(times==9):
    colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000", "#B80000"]

if(times>9):
    colors = ["#FFDFDF", "#FFDCDC", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000", "#B80000"]

    index_count = times-9
    while index_count > 0:
        colors.append("#B80000")
        index_count -= 1


#plt.suptitle(len(colors), fontsize=14, fontweight='bold')

index = 0
times=times+1
while times > 0:
    boundaries_list.append(index * 0.350)
    index = index + 1
    times -= 1

cmap= matplotlib.colors.ListedColormap(colors)
boundaries=boundaries_list

m = plt.contourf(xm + 1, ym + 1.5, zm, levels=boundaries, cmap = cmap, alpha=0.6, extend="max")
m = plt.contourf(xm + 1, ym + 1.5, zm, levels=boundaries, cmap = cmap, alpha=0.6, extend="max")

#m = plt.contourf(xi, yi, zi, levels = boundaries, cmap=cmap,alpha=0.7, vmin=0, vmax=boundaries[-1])
#plt.colorbar()
#plt.contour(xi, yi, zi, 6, colors='k',alpha=1, linewidths=0.2, vmin=min(z), vmax=max(z))

#plt.scatter(x, y, marker = 'o', c = z, s = 50, edgecolors='black', vmin=0, vmax=boundaries[-1], cmap = cmap)



#m.set_array(zi)
#m.set_clim(0,boundaries[-1])
#cbar = plt.colorbar(m,  spacing="proportional", orientation='vertical' ,fraction=0.046, pad=0.04)


#cbar.ax.tick_params(labelsize=7)


plt.xlim(100,-100)
plt.ylim(0, 100)
plt.axis('off')

#plt.gca().invert_xaxis()
#plt.gca().invert_yaxis()

plt.gca().set_axis_off()
plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, hspace = 0, wspace = 0)
plt.margins(0,0)
plt.gca().xaxis.set_major_locator(plt.NullLocator())
plt.gca().yaxis.set_major_locator(plt.NullLocator())
plt.tight_layout()

if not os.path.isdir(results_dir):
    os.makedirs(results_dir)

#plt.savefig(results_dir + sample_file_name, bbox_inches='tight')

plt.show()
plt.savefig(results_dir + sample_file_name, bbox_inches='tight', pad_inches = 0)