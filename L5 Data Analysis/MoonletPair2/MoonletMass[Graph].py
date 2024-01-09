import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

data1 = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L5/L5 Behavior/MoonletMass/moonlet_orbit_data_Mass_L5[2].csv')
dynamic = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L5/L5 Behavior/Model/moonlet_data_dynamic_L5[1].csv')
control = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L5/L5 Behavior/MoonletMass/moonlet_orbit_data_Mass_L5[1].csv')

data1_L5X = data1["L5 X Position (m)"]
data1_L5Y = data1["L5 Y Position (m)"]

dynamic_L5X = dynamic["L5 X Position (m)"]
dynamic_L5Y = dynamic["L5 Y Position (m)"]

control_L5X = control["L5 X Position (m)"]
control_L5Y = control["L5 Y Position (m)"]

means_X = [control_L5X.mean(), data1_L5X.mean(), dynamic_L5X.mean()]
std_devs_X = [control_L5X.std(), data1_L5X.std(), dynamic_L5X.std()]

means_Y = [control_L5Y.mean(), data1_L5Y.mean(), dynamic_L5Y.mean()]
std_devs_Y = [control_L5Y.std(), data1_L5Y.std(), dynamic_L5Y.std()]

labels = ['Control', 'Moonlet Mass 5e25kg', 'Dynamic Moonlet Pair']

x_pos = np.arange(len(labels))


y_min = min(min(means_X), min(means_Y)) - max(max(std_devs_X), max(std_devs_Y))
y_max = max(max(means_X), max(means_Y)) + max(max(std_devs_X), max(std_devs_Y))


interval = (y_max - y_min) / 10 


# plt.yticks(np.arange(y_min, y_max, interval))
plt.ylim(y_min, y_max)
plt.minorticks_on()

plt.bar(x_pos - 0.2, means_X, yerr=std_devs_X, width=0.4, align='center', alpha=0.5, ecolor='black', capsize=10, label='X Position')

plt.bar(x_pos + 0.2, means_Y, yerr=std_devs_Y, width=0.4, align='center', alpha=0.5, ecolor='black', capsize=10, label='Y Position')

plt.xticks(x_pos, labels)

plt.xlabel('')
plt.ylabel('Mean Position (m)')
plt.title('Moonlet Pair 1 - L5 Position')

plt.legend()

plt.show()

print(dynamic.columns)
print(dynamic["L5 Y Position (m)"].isna().sum())