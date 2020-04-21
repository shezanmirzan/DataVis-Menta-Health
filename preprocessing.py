# -*- coding: utf-8 -*-
"""
Created on Mon Apr 13 12:43:14 2020

@author: Nidhi
"""

import numpy as np
import pandas as pd
import random
import os

cur_Dir = os.getcwd();
fileName1 = "mental-heath-in-tech-2019.csv";
fileName2 = "mental-heath-in-tech-2019_cleaned.csv"

data = pd.read_csv(os.path.join(cur_Dir,fileName1))

#Replace outlier ages with mean
data.loc[(data['What is your age?'] > 90), 'What is your age?'] = 34
data.loc[(data['What is your age?'] < 10), 'What is your age?'] = 34

data['What is your gender?'] = data['What is your gender?'].replace([
    'male', 'Male ', 'M', 'm', 'man', 'Cis male',
    'Male.', 'Male (cis)', 'Man', 'Sex is male',
    'cis male', 'Malr', 'Dude', "I'm a man why didn't you make this a drop down question. You should of asked sex? And I would of answered yes please. Seriously how much text can this take? ",
    'mail', 'M|', 'male ', 'Cis Male', 'Male (trans, FtM)',
    'cisdude', 'cis man', 'MALE','Male-ish','maile','something kinda male?','Male (CIS)','Guy (-ish) ^_^','ostensibly male, unsure what that really means'], 'Male')
data['What is your gender?'] = data['What is your gender?'].replace([
    'female', 'I identify as female.', 'female ',
    'Female assigned at birth ', 'F', 'Woman', 'fm', 'f',
    'Cis female', 'Transitioned, M2F', 'Female or Multi-Gender Femme',
    'Female ', 'woman', 'female/woman', 'Cisgender Female', 
    'mtf', 'fem', 'Female (props for making this a freeform field, though)',
    ' Female', 'Cis-woman', 'AFAB', 'Transgender woman',
    'Cis female ','Cis Female','Androgyne','cis-female/femme','Female (cis)','femail'], 'Female')
data['What is your gender?'] = data['What is your gender?'].replace([
    'Bigender', 'non-binary,', 'Genderfluid (born female)',
    'Other/Transfeminine', 'Androgynous', 'male 9:1 female, roughly',
    'nb masculine', 'genderqueer', 'Human', 'Genderfluid',
    'Enby', 'genderqueer woman', 'Queer', 'Agender', 'Fluid',
    'Genderflux demi-girl', 'female-bodied; no feelings about gender',
    'non-binary', 'Male/genderqueer', 'Nonbinary', 'Other', 'none of your business',
    'Unicorn', 'human', 'Genderqueer','Trans-female','queer/she/they','All','male leaning androgynous','Trans woman','msle','Neuter','Female (trans)','queer','A little about you','Female (trans)','p'], 'Other')

# replace the one null with Male, the mode gender, so we don't have to drop the row
data['What is your gender?'] = data['What is your gender?'].replace(np.NaN, 'Male')
data['What is your gender?'].unique()
data.to_csv(os.path.join(cur_Dir,fileName2))

def assign(state):
    if(state=="Illinois"):
        return "IL"
    elif(state=="Tennessee"):
        return  "TN"
    elif(state=="Virginia"):
        return  "VA"
    elif(state=="California"):
        return  "CA"
    elif(state=="Kentucky"):
        return  "KY"
    elif(state=="Oregon"):
        return  "OR"
    elif(state=="Pennsylvania"):
        return  "PA"
    elif(state=="New Jersey"):
        return  "NJ"
    elif(state=="Georgia"):
        return  "GA"
    elif(state=="Washington"):
        return  "WA"
    elif(state=="New York"):
        return  "NY"
    elif(state=="Indiana"):
        return  "IN"
    elif(state=="Minnesota"):
        return  "MN"
    elif(state=="Ohio"):
        return  "OH"
    elif(state=="Florida"):
        return  "FL"
    elif(state=="Massachusetts"):
        return  "MA"
    elif(state=="North Dakota"):
        return  "ND"
    elif(state=="Texas"):
        return  "TX"
    elif(state=="District of Columbia"):
        return  "DC"
    elif(state=="Vermont"):
        return  "VT"
    elif(state=="North Carolina"):
        return  "NC"
    elif(state=="Missouri"):
        return  "MO"
    elif(state=="Kansas"):
        return  "KS"
    elif(state=="Nevada"):
        return  "NV"
    elif(state=="Utah"):
        return  "UT"
    elif(state=="Connecticut"):
        return  "CT"
    elif(state=="Maryland"):
        return  "MD"
    elif(state=="Michigan"):
        return  "MI"
    elif(state=="Colorado"):
        return  "CO"
    elif(state=="Iowa"):
        return  "IA"
    elif(state=="South Dakota"):
        return  "SD"
    elif(state=="Hawaii"):
        return  "HI"
    elif(state=="Nebraska"):
        return  "NE"
    elif(state=="Maine"):
        return  "ME"
    elif(state=="Arizona"):
        return  "AZ"    
    elif(state=="Oklahoma"):
        return  "OK"    
    elif(state=="Rhode Island"):
        return  "RI"
    elif(state=="Alabama"):
        return  "AL"
    elif(state=="West Virginia"):
        return  "WV"
    elif(state=="Louisiana"):
        return  "LA"
    elif(state=="New Hampshire"):
        return  "NH"
    elif(state=="New Mexico"):
        return  "NM"
    elif(state=="Montana"):
        return  "MT"
    elif(state=="Idaho"):
        return  "ID"
    elif(state=="Delaware"):
        return  "DE"
    elif(state=="Wyoming"):
        return  "WY"
    elif(state=="Virgin Islands"):
        return  "VI"
    elif(state=="Puerto Rico"):
        return  "PR"
    elif(state=="Arkansas"):
        return  "AR"
    else:
        codes = ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
        return random.choice(codes)
