import numpy as np
from scipy.integrate import odeint
import csv

G = 6.67e-11  # N * m^2 / kg^2
M_earth = 5.97e24  # kg
M_moon = 7.35e22  # kg
R_earth_moon = 3.84e8  # distance meters


def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x ** 2 + y ** 2)
    force_x = -G * M1 * x / r ** 3 - G * M2 * x / r ** 3
    force_y = -G * M1 * y / r ** 3 - G * M2 * y / r ** 3
    return force_x, force_y


def equations_of_motion(state, t, M1, M2):
    x, y, vx, vy = state
    force_x, force_y = gravitational_force(x, y, M1, M2)
    dxdt = vx
    dydt = vy
    dvxdt = force_x / M2
    dvydt = force_y / M2
    return [dxdt, dydt, dvxdt, dvydt]


def lagrange_point_l5_location(theta):
    x_l5 = 0.5 * R_earth_moon * np.cos(theta)
    y_l5 = -(np.sqrt(3) / 2) * R_earth_moon * np.sin(theta)
    return x_l5, y_l5


def simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  # moon angle
    theta_l5 = 0  # L5 angle

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (
                27.3 * 24 * 3600)]  # Initial position at Moon's location with Moon's orbital velocity
    times = np.arange(0, time_span * 365, time_step)  # time span => days

    moonlet_timeseries = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600)  # Update Moon's angle based on its orbital period
        x_l5, y_l5 = lagrange_point_l5_location(theta_l5)

        state = odeint(equations_of_motion, initial_state, [0, time_step], args=(M_earth, moonlet_mass))
        initial_state = state[-1, :]

        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        moonlet_positions = [t, x_moon, y_moon, initial_state[0], initial_state[1], x_l5, y_l5]
        moonlet_timeseries.append(moonlet_positions)

        theta_l5 += 2 * np.pi * time_step / (
                    27.3 * 24 * 3600)  # Update Lagrange point L5's angle based on Moon's orbital period

    return moonlet_timeseries


moonlet_mass = 5e15
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span_years, time_step_days)

print(
    "Time (days) | Moon X Position (m) | Moon Y Position (m) | Moonlet X Position (m) | Moonlet Y Position (m) | L5 X Position (m) | L5 Y Position (m)")

for entry in moonlet_timeseries:
    print(f"{entry[0]:} | {entry[1]:} | {entry[2]:} | {entry[3]:} | {entry[4]:} | {entry[5]:} | {entry[6]:}")

# output_file = 'moonlet_orbit_data_Mass_L5[4].csv'
#
# with open(output_file, 'w', newline='') as csvfile:
#     csv_writer = csv.writer(csvfile)
#
#     csv_writer.writerow(["Time (days)", "Moon X Position (m)", "Moon Y Position (m)", "Moonlet X Position (m)", "Moonlet Y Position (m)", "L5 X Position (m)", "L5 Y Position (m)"])
#
#     for entry in moonlet_timeseries:
#         csv_writer.writerow(entry)
#
# print(f"Data has been saved to {output_file}.")
