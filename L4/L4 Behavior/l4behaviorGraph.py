import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint
from matplotlib.animation import FuncAnimation

G = 6.67e-11  # N * m^2 / kg^2
M_earth = 5.97e24  #kg
M_moon = 7.35e22  # kg
R_earth_moon = 3.84e8  # meters

def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x**2 + y**2)
    force_x = -G * M1 * x / r**3 - G * M2 * x / r**3
    force_y = -G * M1 * y / r**3 - G * M2 * y / r**3
    return force_x, force_y

def equations_of_motion(state, t, M1, M2):
    x, y, vx, vy = state
    force_x, force_y = gravitational_force(x, y, M1, M2)
    dxdt = vx
    dydt = vy
    dvxdt = force_x / M2
    dvydt = force_y / M2
    return [dxdt, dydt, dvxdt, dvydt]

def lagrange_point_l4_location(theta):
    x_l4 = 0.5 * R_earth_moon * np.cos(theta)
    y_l4 = (np.sqrt(3) / 2) * R_earth_moon * np.sin(theta)
    return x_l4, y_l4

def simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  # Initial angle for Moon's position
    theta_l4 = 0  # Initial angle for Lagrange point L4

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (27.3 * 24 * 3600)]  # Initial position at Moon's location with Moon's orbital velocity
    times = np.arange(0, time_span * 365, time_step)  # Time span is in years, convert to days

    moonlet_positions = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600)  # Update Moon's angle based on its orbital period
        x_l4, y_l4 = lagrange_point_l4_location(theta_l4)

        state = odeint(equations_of_motion, initial_state, [0, time_step], args=(M_earth, moonlet_mass))
        initial_state = state[-1, :]

        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        moonlet_positions.append([x_moon, y_moon, initial_state[0], initial_state[1], x_l4, y_l4])

        theta_l4 += 2 * np.pi * time_step / (27.3 * 24 * 3600)  # Update Lagrange point L4's angle based on Moon's orbital period

    return moonlet_positions

moonlet_mass = 1e18
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_positions = simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span_years, time_step_days)

fig, ax = plt.subplots()

def update(frame):
    ax.clear()
    ax.set_xlim(-5e8, 5e8)
    ax.set_ylim(-5e8, 5e8)

    moon_x, moon_y, moonlet_x, moonlet_y, l4_x, l4_y = moonlet_positions[frame]

    ax.scatter(0, 0, label='Earth', color='green', marker='o', s=500)
    ax.scatter(moon_x, moon_y, label='Moon', color='blue')
    ax.scatter(l4_x, l4_y, label='L4', color='red')
    ax.scatter(moonlet_x, moonlet_y, label='Moonlet', color='orange')

    ax.set_title(f"Time: {frame} days")
    ax.legend()

ani = FuncAnimation(fig, update, frames=len(moonlet_positions), repeat=False)
plt.show()
