import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

G = 6.67e-11  # N * m^2 / kg^2
M_earth = 5.97e24  # kg
R_earth_moon = 3.84e8  # meters

def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x ** 2 + y ** 2)
    force_x = -G * M1 * x / r ** 3 - G * M2 * x / r ** 3
    force_y = -G * M1 * y / r ** 3 - G * M2 * y / r ** 3
    return force_x, force_y

def equations_of_motion(state, t, M1, M2, M3, M4):
    x1, y1, vx1, vy1, x2, y2, vx2, vy2 = state
    force_x1, force_y1 = gravitational_force(x1 - x2, y1 - y2, M1, M2)
    force_x2, force_y2 = gravitational_force(x2 - x1, y2 - y1, M3, M4)

    dx1dt = vx1
    dy1dt = vy1
    dvx1dt = (force_x1 / M2) + (force_x2 / M4)
    dvy1dt = (force_y1 / M2) + (force_y2 / M4)

    dx2dt = vx2
    dy2dt = vy2
    dvx2dt = (force_x2 / M4) + (force_x1 / M2)
    dvy2dt = (force_y2 / M4) + (force_y1 / M2)

    return [dx1dt, dy1dt, dvx1dt, dvy1dt, dx2dt, dy2dt, dvx2dt, dvy2dt]

def lagrange_point_l5_location(theta, distance_earth_moon):
    x_l5 = distance_earth_moon * np.cos(theta)
    y_l5 = -distance_earth_moon * np.sin(theta)
    return x_l5, y_l5

def simulate_orbit(moonlet_mass1, moonlet_mass2, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  # moon angle
    theta_l5 = np.pi  #l5 angle

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (27.3 * 24 * 3600),
                     R_earth_moon + initial_distance_earth_moon + 1e7, 0, 0,
                     2 * np.pi * R_earth_moon / (27.3 * 24 * 3600)]  # Initial positions and velocities

    times = np.arange(0, time_span * 365, time_step)  # Time span is in years, convert to days

    moonlet_timeseries = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600)  # Update Moon's angle based on its orbital period
        x_l5, y_l5 = lagrange_point_l5_location(theta_l5, R_earth_moon + initial_distance_earth_moon)

        state = odeint(equations_of_motion, initial_state, [0, time_step],
                       args=(M_earth, moonlet_mass1, M_earth, moonlet_mass2))
        initial_state = state[-1, :]

        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        moonlet_positions = [t, x_moon, y_moon, initial_state[0], initial_state[1], initial_state[4], initial_state[5],
                             x_l5, y_l5]
        moonlet_timeseries.append(moonlet_positions)

        theta_l5 += 2 * np.pi * time_step / (
                    27.3 * 24 * 3600)  # Update Lagrange point L5's angle based on Moon's orbital period

    return moonlet_timeseries

moonlet_mass1 = 1e18
moonlet_mass2 = 5e25
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass1, moonlet_mass2, initial_distance_earth_moon, time_span_years,
                                    time_step_days)

time_values = [entry[0] for entry in moonlet_timeseries]
moon_x_values = [entry[1] for entry in moonlet_timeseries]
moon_y_values = [entry[2] for entry in moonlet_timeseries]
moonlet1_x_values = [entry[3] for entry in moonlet_timeseries]
moonlet1_y_values = [entry[4] for entry in moonlet_timeseries]
moonlet2_x_values = [entry[5] for entry in moonlet_timeseries]
moonlet2_y_values = [entry[6] for entry in moonlet_timeseries]
l5_x_values = [entry[7] for entry in moonlet_timeseries]
l5_y_values = [entry[8] for entry in moonlet_timeseries]

fig, ax = plt.subplots(figsize=(12, 12))

earth_circle = plt.Circle((0, 0), 0.1 * R_earth_moon, color='blue', label='Earth')
moon_circle = plt.Circle((R_earth_moon, 0), 0.05 * R_earth_moon, color='gray', label='Moon')
ax.add_patch(earth_circle)
ax.add_patch(moon_circle)

plt.scatter(moonlet1_x_values, moonlet1_y_values, s=20, color='blue', label='Moonlet 1')
plt.scatter(moonlet2_x_values, moonlet2_y_values, s=20, color='green', label='Moonlet 2')

plt.plot(moonlet1_x_values, moonlet1_y_values, linestyle='--', color='blue', alpha=0.5)
plt.plot(moonlet2_x_values, moonlet2_y_values, linestyle='--', color='green', alpha=0.5)
plt.plot(l5_x_values, l5_y_values, color='red', alpha=0.5)

ax.set_xlim(-0.5 * R_earth_moon, 2.5 * R_earth_moon)
ax.set_ylim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_aspect('equal', 'box')
plt.title("Multiple Moonlet Interactions in Lagrange Point 5")
plt.legend()
plt.grid(True)
plt.show()
