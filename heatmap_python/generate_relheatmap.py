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
""" from matplotlib.mlab import griddata """
import scipy.interpolate
from scipy.interpolate import Rbf
from matplotlib import cm
import matplotlib
import matplotlib.mlab as ml
import matplotlib.image as mpimg
from matplotlib.colors import LightSource


filename = sys.argv[1]

script_dir = os.path.dirname(__file__)
results_dir = os.path.join(script_dir, 'relheatmaps/')
sample_file_name = filename

csv_filename = 'relheatmaps/'+sample_file_name+'.csv'
df = pd.read_csv(csv_filename)

data = [df.x, df.y]
y = df.x 
x = df.y
z = []
e = []

for f in df.z:
    e.append(f)

print("e",e)
print("F",f)
z = df.z

""" print("df",df)
print("e",e)
print("z",z) """

ny, nx = 100, 100
xmin, xmax = -100, 100
ymin, ymax = 0, 100

xi = np.linspace(xmin, xmax, nx, endpoint=False)
yi = np.linspace(ymin, ymax, ny, endpoint=False)
zi = griddata((x, y), e, (xi[None,:], yi[:,None]), method='cubic')



""" fig = plt.figure(figsize=(7.91,5.86)) """
fig = plt.figure(figsize=(7.91,6.124))

plt.axes().set_aspect('auto', 'box')

""" img=mpimg.imread('heatmap_new_760.png') """
img=mpimg.imread('hriste_760x582@2x.png')

plt.imshow(img, aspect='auto', origin='lower', extent=[max(xi) + 3, min(xi)-1, max(yi)+1.5, min(yi)-0.5])
""" plt.imshow(img, aspect='auto', origin='lower', extent=[max(xi), min(xi), max(yi), min(yi) ]) """

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

#minima a maxima
if (abs(zi_minimum_list) > abs(zi_maximum_list)):
  print("zaporne minimum je vetsi")
  zi_min = min(z)
  zi_max = abs(min(z))

elif (abs(zi_minimum_list) < abs(zi_maximum_list)):
  print("kladne minimum je vetsi")
  zi_min = max(z) * -1
  zi_max = max(z)

else:
  print("jsou stejna")
  zi_min = max(z)
  zi_max = max(z)

print("zi_max",zi_max)
print("zi_min", zi_min)


count = round(zi_max/0.125)
boundaries_list = []
print("count",count)
times = count
if(count<=1):
    times = 12

if(count<=6):
    times = 12

if(count==7):
    times = 14

if(count==8):
    times = 16

if(count>8):
    times = count * 2

print("times",times)

#https://coolors.co/198138-24a248-42bf65-6fdd8c-a7f1ba-cef4d9-e2f6e9-f5f7f8
#https://coolors.co/f5f7f8-ffd7d9-ffb3b8-ff9ba1-fe8389-f94d56-e9363f-d91e28

colors = ["#4848FF", "#6C6CFF", "#9090FF", "#B4B4FF", "#D8D8FF", "#ffffff", "#f5f7f8", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848"]

if(times==12):
    colors = ["#4848FF", "#6C6CFF", "#9090FF", "#B4B4FF", "#D8D8FF", "#ffffff", "#ffffff", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848"]

if(times==14):
    colors = ["#2424F6", "#4848FF", "#6C6CFF", "#9090FF", "#B4B4FF", "#D8D8FF", "#ffffff", "#ffffff", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424"]

if(times==16):
    colors = ["#0000E4", "#2424F6", "#4848FF", "#6C6CFF", "#9090FF", "#B4B4FF", "#D8D8FF", "#ffffff", "#ffffff", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000"]

main_colors = ["#0000E4", "#2424F6", "#4848FF", "#6C6CFF", "#9090FF", "#B4B4FF", "#D8D8FF", "#ffffff", "#ffffff", "#FFD8D8", "#FEB4B4", "#F89090", "#EE6C6C", "#E04848", "#CE2424", "#B90000"]

left_side = []
right_side = []
print("times", times)
#198138
#D91E28

if(times>16):
    index_count = (times-16)/2
    while index_count > 0:
        left_side.append("#0000E4")
        right_side.append("#B90000")
        index_count -= 1


if(times>16):
    colors = left_side + main_colors + right_side
    """ colors = main_colors """



index = 0
times_count = (times/2)
while (times_count > 0) and (index < 8):
    boundaries_list.append(index * 0.125)
    index = index + 1
    times_count -= 1


index = 1
times_count = (times/2)
while times_count > 0:
    print("index",index)
    boundaries_list.append(index * -0.125)
    index = index + 1
    times_count -= 1


boundaries_list.sort(reverse=False)
boundaries_list.append(boundaries_list[0]*-1);


boundaries=boundaries_list

print("boundaries",boundaries)


#plt.suptitle(matplotlib.__version__, fontsize=10, fontweight='bold')
#plt.suptitle(count, fontsize=10, fontweight='normal')

cmap= matplotlib.colors.ListedColormap(colors)

m = plt.contourf(xm + 1, ym + 1.5, zm, levels=boundaries, cmap = cmap, alpha=0.6, extend="max")
m = plt.contourf(xm + 1, ym + 1.5, zm, levels=boundaries, cmap = cmap, alpha=0.6, extend="max")




#plt.scatter(x, y, marker = 'o', c = z, edgecolors='black', s = 50, alpha=0.7, vmin=boundaries_list[0], vmax=boundaries_list[-1], cmap = cmap)

""" m.set_array(zi) """
""" m.set_clim(boundaries_list[0], boundaries_list[-1]) """



ticky = [-4,-3.5,-3,-2.5,-2,-1.5,-1,-0.5 ,0 , 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
if(count>=30):
    ticky = [-8,-7,-6,-5,-4,-3,-2,-1 ,0 , 1, 2, 3, 4, 5, 6, 7, 8]

""" cbar = plt.colorbar(m, ticks=ticky, spacing="proportional", orientation='vertical' ,fraction=0.046, pad=0.04)

cbar.ax.tick_params(labelsize=7) """

plt.xlim(100,-100)
plt.ylim(0, 100)
plt.axis('off')

#vyjebane okraje
plt.gca().set_axis_off()
plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, hspace = 0, wspace = 0)
plt.margins(0,0)
plt.gca().xaxis.set_major_locator(plt.NullLocator())
plt.gca().yaxis.set_major_locator(plt.NullLocator())

plt.tight_layout()




if not os.path.isdir(results_dir):
    os.makedirs(results_dir)

#plt.savefig(filename, transparent=True)

ve = 1
ls = LightSource(azdeg=315, altdeg=45)
""" rgb = ls.shade(z, cmap=cmap, vert_exag=1, blend_mode='hsv') """

plt.show()
plt.savefig(results_dir + sample_file_name, bbox_inches='tight', pad_inches = 0)
