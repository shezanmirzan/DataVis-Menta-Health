# -*- coding: utf-8 -*-
"""
Created on Thu Apr 23 18:31:30 2020

@author: shree
"""

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure();
ax= plt.subplot()
fig.set_facecolor('#faf0e6')
cm = np.load('./Data/2016_Physical.npy')
sns.heatmap(cm, annot=True, fmt="d", ax = ax); #annot=True to annotate cells

# labels, title and ticks
ax.set_xlabel('Are there negative consequences?');ax.set_ylabel('Is your Anonymity protected?'); 
ax.set_title('Correlation Matrix'); 
ax.xaxis.set_ticklabels(['Yes', 'No', 'Maybe']); ax.yaxis.set_ticklabels(['Yes', 'No', 'Maybe']);