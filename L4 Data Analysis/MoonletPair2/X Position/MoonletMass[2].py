import pandas as pd
import numpy as np
from scipy import stats

data1 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/Model/moonlet_data_dynamic_L4[2].csv')
data2 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/MoonletMass/moonlet_data_Mass_L4[3].csv')

data1.reset_index(drop=True, inplace=True)
data2.reset_index(drop=True, inplace=True)

# position_difference = data1["L4 X Position (m)"] - data2["L4 X Position (m)"]
# location = []

# for diff in position_difference:
#     # print(f'{diff}')
#     location.append(diff)
    
# # print(location)
# location = np.array(location)
# print(location)
# print(np.mean(location))
# print(np.std(location))
# print(np.median(location))


# Extract the 'L4 X Position (m)' column from both dataframes
data1_L4X = data1["L4 X Position (m)"]
data2_L4X = data2["L4 X Position (m)"]

# Calculate the mean
mean1 = data1_L4X.mean()
mean2 = data2_L4X.mean()

# Calculate the standard deviation
std_dev1 = data1_L4X.std()
std_dev2 = data2_L4X.std()

print(f'Data1: Mean = {mean1}, Standard Deviation = {std_dev1}')
print(f'Data2: Mean = {mean2}, Standard Deviation = {std_dev2}')

# Perform the t-test on the means
t_stat, p_val = stats.ttest_ind_from_stats(mean1, std_dev1, len(data1_L4X), mean2, std_dev2, len(data2_L4X))

print(f'T-test result: T-statistic = {t_stat}, p-value = {p_val}')

