# control group

import numpy as np
from scipy.integrate import odeint
import csv

G = 6.67e-11  # N * m^2 / kg^2
M_earth = 5.97e24  # kg
M_moon = 7.35e22  #kg
R_earth_moon = 3.84e8  # distance meters

def gravitational_force(x, y, M1, M2):
    r = np.sqrt(x**2 + y**2)
    force_x = -G * M1 * x / r**3 - G * M2 * x / r**3
    force_y = -G * M1 * y / r**3 - G * M2 * y / r**3
    return force_x, force_y

def equations_of_motion(state, t, M1, M2, M3, x1, y1, x2, y2, x3, y3):
    x, y, vx, vy = state
    r1 = np.sqrt((x - x1)**2 + (y - y1)**2) + 1e-6
    r2 = np.sqrt((x - x2)**2 + (y - y2)**2) + 1e-6
    r3 = np.sqrt((x - x3)**2 + (y - y3)**2) + 1e-6

    dxdt = vx
    dydt = vy
    dvxdt = -G * M1 * (x - x1) / r1**3 - G * M2 * (x - x2) / r2**3 - G * M3 * (x - x3) / r3**3
    dvydt = -G * M1 * (y - y1) / r1**3 - G * M2 * (y - y2) / r2**3 - G * M3 * (y - y3) / r3**3

    return dxdt, dydt, dvxdt, dvydt

def lagrange_point_l4_location(theta_l4, x_earth, y_earth, x_moon, y_moon, x_moonlet, y_moonlet, moonlet_mass):
    R_earth_moon = np.sqrt((x_moon - x_earth)**2 + (y_moon - y_earth)**2)
    R_earth_moonlet = np.sqrt((x_moonlet - x_earth)**2 + (y_moonlet - y_earth)**2)

    x_l4 = x_earth + R_earth_moon * np.cos(theta_l4) + moonlet_mass / M_earth * R_earth_moonlet * np.cos(theta_l4)
    y_l4 = y_earth + R_earth_moon * np.sin(theta_l4) + moonlet_mass / M_earth * R_earth_moonlet * np.sin(theta_l4)

    return x_l4, y_l4

def simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span, time_step):
    theta_moon = 0  #Moon angle
    theta_l4 = 0  # l4 angle

    initial_state = [R_earth_moon + initial_distance_earth_moon, 0, 0, 2 * np.pi * R_earth_moon / (27.3 * 24 * 3600)]  
    times = np.arange(0, time_span * 365, time_step)  # time span (years) => days

    moonlet_timeseries = []

    for t in times:
        theta_moon = (2 * np.pi * t) / (27.3 * 24 * 3600) 
        theta_l4 = theta_moon + np.pi / 3  # Update theta_l4

        x_earth = 0
        y_earth = 0
        x_moon = R_earth_moon * np.cos(theta_moon)
        y_moon = R_earth_moon * np.sin(theta_moon)

        state = odeint(equations_of_motion, initial_state, [0, time_step], args=(M_earth, M_moon, moonlet_mass, x_earth, y_earth, x_moon, y_moon, initial_state[0], initial_state[1]))
        initial_state = state[-1, :]

        x_moonlet, y_moonlet = initial_state[0], initial_state[1]
        x_l4, y_l4 = lagrange_point_l4_location(theta_l4, x_earth, y_earth, x_moon, y_moon, x_moonlet, y_moonlet, moonlet_mass)

        moonlet_positions = [t, x_moon, y_moon, x_moonlet, y_moonlet, x_l4, y_l4]
        moonlet_timeseries.append(moonlet_positions)

    return moonlet_timeseries

moonlet_mass = 1e18
initial_distance_earth_moon = 3.84e8
time_span_years = 10
time_step_days = 1

moonlet_timeseries = simulate_orbit(moonlet_mass, initial_distance_earth_moon, time_span_years, time_step_days)

output_file = 'moonlet_data_Mass_L4[1].csv'

with open(output_file, 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)

    csv_writer.writerow(["Time (days)", "Moon X Position (m)", "Moon Y Position (m)", "Moonlet X Position (m)", "Moonlet Y Position (m)", "L4 X Position (m)", "L4 Y Position (m)"])

    for entry in moonlet_timeseries:
        csv_writer.writerow(entry)

print(f"Data has been saved to {output_file}.")

print("Time (days) | Moon X Position (m) | Moon Y Position (m) | Moonlet X Position (m) | Moonlet Y Position (m) | L4 X Position (m) | L4 Y Position (m)")

for entry in moonlet_timeseries:
    print(f"{entry[0]:.2f} | {entry[1]:.2f} | {entry[2]:.2f} | {entry[3]:.2f} | {entry[4]:.2f} | {entry[5]} | {entry[6]}")
