# -*- coding: utf-8 -*-
"""
Created on Sat Apr 18 23:19:50 2020

@author: Nidhi
"""
import numpy as np
import pandas as pd
import os
import json
import preprocessing


def shorten(name):
    if name.find("Anxiety Disorder")!=-1:
        return "Anxiety Disorder"
    elif name.find("Mood Disorder")!=-1:
        return "Mood Disorder"
    if name.find("Personality Disorder")!=-1:
        return "Personality Disorder"
    else:
        return "None"
#Set path
cur_Dir = os.getcwd();
fileName = "mental-heath-in-tech-2019_cleaned.csv"

#Read data
data = pd.read_csv(os.path.join(cur_Dir,fileName))

#Replace state name with code ; Replace NaN with random states
#2016:What US state or territory do you work in?
#2019:What US state or territory do you *work* in?

data.loc[data['What US state or territory do you *work* in?'].isna()] = "xyz"
data['What US state or territory do you *work* in?'] = data['What US state or territory do you *work* in?'].apply(preprocessing.assign)

#Shorten disorder name
#2016:If yes, what condition(s) have you been diagnosed with?
#2019:*If so, what disorder(s) were you diagnosed with?*

data.loc[data['*If so, what disorder(s) were you diagnosed with?*'].isna()] = "None"
data['*If so, what disorder(s) were you diagnosed with?*'] = data['*If so, what disorder(s) were you diagnosed with?*'].apply(shorten)


#Count cases per disorder
scodes = ['HI', 'AK', 'FL', 'SC', 'GA', 'AL', 'NC', 'TN', 'RI', 'CT', 'MA',
	'ME', 'NH', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'WV', 'KY', 'OH', 
	'MI', 'WY', 'MT', 'ID', 'WA', 'DC', 'TX', 'CA', 'AZ', 'NV', 'UT', 
	'CO', 'NM', 'OR', 'ND', 'SD', 'NE', 'IA', 'MS', 'IN', 'IL', 'MN', 
	'WI', 'MO', 'AR', 'OK', 'KS', 'LS', 'VA']

mdata= []

for sc in scodes:
    count1 = len(data.loc[(data['What US state or territory do you *work* in?']==sc) & 
                          (data['*If so, what disorder(s) were you diagnosed with?*']=="Anxiety Disorder")])
    count2 = len(data.loc[(data['What US state or territory do you *work* in?']==sc) & 
                          (data['*If so, what disorder(s) were you diagnosed with?*']=="Mood Disorder")])
    count3 = len(data.loc[(data['What US state or territory do you *work* in?']==sc) & 
                          (data['*If so, what disorder(s) were you diagnosed with?*']=="Personality Disorder")])
    
    
    mdata.append({'State':sc, 'freq':{'Anxiety Disorder':count1,'Mood Disorder':count2,'Personality Disorder':count3 } })


#Write to text file
with open('map_data_2019.txt', 'w') as filehandle:
    json.dump(mdata, filehandle)

#Modify the text file as per our format
fin = open("map_data_2019.txt", "rt")
md = fin.read()
md = md.replace('"State"', 'State')
md = md.replace('"freq"', 'freq')
md = md.replace('"Anxiety Disorder"', 'Anxiety Disorder')
md = md.replace('"Mood Disorder"', 'Mood Disorder')
md = md.replace('"Personality Disorder"', 'Personality Disorder')
md = md.replace('"', '\'')
md = md.replace(': ', ':')
fin.close()

fin = open("map_data_2019.txt", "wt")
fin.write(md)
fin.close()