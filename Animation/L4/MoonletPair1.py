import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.animation import FuncAnimation

data = pd.read_csv('/Users/rahulgupta/Research Project/Research Project Code/L4/L4-Behavior/Model/moonlet_data_dynamic_L4[1].csv')

fig, ax = plt.subplots()

x_min = min(min(data['L4 X Position (m)']), min(data['Moon X Position (m)']), 0)
x_max = max(max(data['L4 X Position (m)']), max(data['Moon X Position (m)']), 0)
y_min = min(min(data['L4 Y Position (m)']), min(data['Moon Y Position (m)']), 0)
y_max = max(max(data['L4 Y Position (m)']), max(data['Moon Y Position (m)']), 0)

ax.set_xlim(x_min, x_max)
ax.set_ylim(y_min, y_max)

ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_title('Movement of Lagrange Point 4, Moon and Earth')

line_l4, = ax.plot([], [], marker='o', color='b')
line_moon, = ax.plot([], [], marker='o', color='g')
line_earth, = ax.plot([], [], marker='o', color='r')

def animate(frame):
    point = data.iloc[frame]
    line_l4.set_data([point['L4 X Position (m)']], [point['L4 Y Position (m)']])
    line_moon.set_data([point['Moon X Position (m)']], [point['Moon Y Position (m)']])
    line_earth.set_data([0], [0])  # Earth's position is stable
    return line_l4, line_moon, line_earth,

line_l4, = ax.plot([], [], marker='o', color='b', label='L4')
line_moon, = ax.plot([], [], marker='o', color='g', label='Moon')
line_earth, = ax.plot([], [], marker='o', color='r', label='Earth')

ax.legend()

# Create animation
ani = FuncAnimation(fig, animate, frames=len(data), interval=100, blit=True)

ani.save('lagrange_point_4_animation1.mp4', fps=60)

# Show plot (optional)
plt.show()

total_points = len(data)
print(f'The animation is plotting a total of {total_points} points.')