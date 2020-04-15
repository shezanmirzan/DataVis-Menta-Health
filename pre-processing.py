# -*- coding: utf-8 -*-
"""
Created on Mon Apr 13 12:43:14 2020

@author: Nidhi
"""

import numpy as np
import pandas as pd
import random as rnd

import seaborn as sns

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