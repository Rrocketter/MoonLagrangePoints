import pandas as pd
import numpy as np

data1 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/Model/moonlet_data_dynamic_L4[1].csv')
data2 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/MoonletMass/moonlet_data_Mass_L4[2].csv')

data1.reset_index(drop=True, inplace=True)
data2.reset_index(drop=True, inplace=True)

position_difference = data1["L4 X Position (m)"] - data2["L4 X Position (m)"]
location = []

print('Difference in X position between the two files:')
for diff in position_difference:
    # print(f'{diff}')
    location.append(diff)
    
# print(location)
location = np.array(location)
# print(location)
print(np.mean(location))
print(np.std(location))
print(np.median(location))