import pandas as pd
import plotly as py

data = pd.read_csv("mental-heath-in-tech-2019.csv")
count = 0
new_data = []
new_data = data["no_employees"]
more_new_data = data["benefits"]
yes = 0
no = 0
for i in range(0,len(new_data)):
    if(new_data[i] == "26-100" and more_new_data[i] == "Yes" ):
        yes +=1
    elif(new_data[i] == "26-100" and more_new_data[i] == "No" ):
        no +=1
print("No: ")
print(no)
print("Yes: ")
print(yes)
