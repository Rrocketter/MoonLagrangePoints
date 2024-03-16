import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

data1 = pd.read_csv('/Research Project Code/L4/L4-Behavior/MoonletMass/moonlet_data_Mass_L4[2].csv')
dynamic = pd.read_csv('/Research Project Code/L4/L4-Behavior/Model/moonlet_data_dynamic_L4[1].csv')
control = pd.read_csv('/Research Project Code/L4/L4-Behavior/MoonletMass/moonlet_data_Mass_L4[1].csv')

data1_L4X = data1["L4 X Position (m)"]
data1_L4Y = data1["L4 Y Position (m)"]

dynamic_L4X = dynamic["L4 X Position (m)"]
dynamic_L4Y = dynamic["L4 Y Position (m)"]

control_L4X = control["L4 X Position (m)"]
control_L4Y = control["L4 Y Position (m)"]

means_X = [control_L4X.mean(), data1_L4X.mean(), dynamic_L4X.mean()]
std_devs_X = [control_L4X.std(), data1_L4X.std(), dynamic_L4X.std()]

means_Y = [control_L4Y.mean(), data1_L4Y.mean(), dynamic_L4Y.mean()]
std_devs_Y = [control_L4Y.std(), data1_L4Y.std(), dynamic_L4Y.std()]

labels = ['Control', 'Moonlet Mass 5e25kg', 'Moonlet Pair 1']

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
plt.title('Moonlet Pair 1 - L4 Position')

plt.legend()

plt.show()

print(dynamic.columns)
print(dynamic["L4 Y Position (m)"].isna().sum())