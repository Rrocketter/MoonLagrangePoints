import pandas as pd
import numpy as np

data1 = pd.read_csv('L4/L4 Behavior/Model/moonlet_data_dynamic_L4[1].csv')
data2 = pd.read_csv('L4/L4 Behavior/MoonletMass/moonlet_data_Mass_L4[1].csv')

# Reset the index of both dataframes
data1.reset_index(drop=True, inplace=True)
data2.reset_index(drop=True, inplace=True)

position_difference = data1["L4 X Position (m)"] - data2["L4 X Position (m)"]

print('Difference in X position between the two files:')
for diff in position_difference:
    print(f'{diff:.15f}')