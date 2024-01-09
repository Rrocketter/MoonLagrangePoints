import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the data from the CSV files
data1 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/Model/moonlet_data_dynamic_L4[1].csv')
data2 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/MoonletMass/moonlet_data_Mass_L4[2].csv')
control = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4 Behavior/MoonletMass/moonlet_data_Mass_L4[1].csv')

# Extract the 'L4 X Position (m)' column from the dataframes
data1_L4X = data1["L4 X Position (m)"]
data2_L4X = data2["L4 X Position (m)"]
control_L4X = control["L4 X Position (m)"]

# Calculate the mean and standard deviation
means = [data1_L4X.mean(), data2_L4X.mean(), control_L4X.mean()]
std_devs = [data1_L4X.std(), data2_L4X.std(), control_L4X.std()]

# Create a list for the x-axis labels
labels = ['Moonlet Mass 5e25kg', 'Dynamic Moonlet Pair', 'Control']

# Create an array for the positions of the bars on the x-axis
x_pos = np.arange(len(labels))

# Create a bar graph with error bars
plt.bar(x_pos, means, yerr=std_devs, align='center', alpha=0.5, ecolor='black', capsize=10)

# Change the x-axis labels
plt.xticks(x_pos, labels)

# Add labels and title
plt.xlabel('')
plt.ylabel('Mean of L4 X Position (m)')
plt.title('Mean of L4 X Position (m) with Error Bars')

# Show the graph
plt.show()