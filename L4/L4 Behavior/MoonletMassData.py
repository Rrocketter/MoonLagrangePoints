import pandas as pd
import numpy as np

data1 = pd.read_csv('MoonletMass/moonlet_data_Mass_L4[1].csv')
data2 = pd.read_csv('MoonletMass/moonlet_data_Mass_L4[2].csv')

position=[]

for x in range(len(data1["L4 Y Position (m)"])):
    position.append(data1["L4 Y Position (m)"][x] - data1["L4 X Position (m)"][x])

lol_array = np.array(position)


print(np.mean(lol_array))
print(np.std(lol_array))
print(np.median(lol_array))

# test data analysis in python
#  update later